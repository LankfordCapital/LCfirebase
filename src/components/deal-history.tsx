'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PlusCircle, Trash2, Download, Save } from 'lucide-react';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { useBorrowerProfile } from '@/hooks/use-borrower-profile';
import { borrowerDocumentService, type BorrowerDocument } from '@/lib/borrower-document-service';
import { useAuth } from '@/contexts/auth-context';

type Deal = {
  id: string;
  address: string;
  purchasePrice: number;
  rehabAmount: number;
  salePrice: number;
  daysOnMarket: number;
  purchaseHud1DocumentId?: string;
  dispositionHud1DocumentId?: string;
  createdAt: string;
  updatedAt: string;
};

export function DealHistory() {
  const { user } = useAuth();
  const { profile, updateDealHistory, addDeal, updateDeal, removeDeal, loading } = useBorrowerProfile();
  const { toast } = useToast();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [borrowerDocuments, setBorrowerDocuments] = useState<BorrowerDocument[]>([]);
  const [saving, setSaving] = useState(false);

  // Load deal history from profile
  useEffect(() => {
    if (profile?.dealHistory) {
      setDeals(profile.dealHistory);
    } else {
      // Initialize with one empty deal if no deals exist
      setDeals([{
        id: `deal-${Date.now()}`,
        address: '',
        purchasePrice: 0,
        rehabAmount: 0,
        salePrice: 0,
        daysOnMarket: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }]);
    }
  }, [profile?.dealHistory]);

  // Load borrower documents
  useEffect(() => {
    const loadDocuments = async () => {
      if (user?.uid) {
        try {
          const result = await borrowerDocumentService.getBorrowerDocuments(user.uid);
          if (result.success && Array.isArray(result.documents)) {
            setBorrowerDocuments(result.documents);
          } else {
            setBorrowerDocuments([]);
          }
        } catch (error) {
          console.error('Error loading borrower documents:', error);
          setBorrowerDocuments([]);
        }
      }
    };

    loadDocuments();
  }, [user?.uid]);

  const handleAddDeal = () => {
    if (deals.length < 10) {
      const newId = `deal-${deals.length}-${Date.now()}`;
      const newDeal: Deal = {
        id: newId,
        address: '',
        purchasePrice: 0,
        rehabAmount: 0,
        salePrice: 0,
        daysOnMarket: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setDeals([...deals, newDeal]);
    }
  };

  const handleRemoveDeal = async (id: string) => {
    if (deals.length > 1) {
      const updatedDeals = deals.filter(deal => deal.id !== id);
      setDeals(updatedDeals);
      
      // Save to Firebase
      try {
        await updateDealHistory(updatedDeals);
      } catch (error) {
        console.error('Error removing deal:', error);
        // Revert local state on error
        setDeals(deals);
      }
    }
  };

  const handleDealChange = (id: string, field: keyof Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>, value: string | number) => {
    setDeals(deals.map(deal => 
      deal.id === id 
        ? { ...deal, [field]: value, updatedAt: new Date().toISOString() }
        : deal
    ));
  };

  const handleSaveDeals = async () => {
    if (!user?.uid) return;

    setSaving(true);
    try {
      await updateDealHistory(deals);
      toast({
        title: 'Deal History Saved',
        description: 'Your deal history has been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving deal history:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save deal history. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };
    
  const handleDocumentUpload = async (docName: string, dealId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.uid || !event.target.files || !event.target.files[0]) return;

    const file = event.target.files[0];
    
    // Validate file type for PDFs
    if (!file.type.includes('pdf') && !file.type.includes('image')) {
      toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a PDF or image file for HUD-1 documents.',
      });
      return;
    }
    
    try {
      // Upload the document
      const uploadResult = await borrowerDocumentService.uploadDocument(file, user.uid, 'hud1_document', docName);
      
      if (uploadResult.success) {
        // Add the document to the database
        const addResult = await borrowerDocumentService.addDocument({
          borrowerId: user.uid,
          type: 'hud1_document',
          name: docName,
          fileName: file.name,
          fileUrl: uploadResult.url!,
          fileSize: file.size,
          mimeType: file.type,
          status: 'pending'
        });

        if (addResult.success && addResult.id) {
          // Update the deal with the document ID
          const isPurchaseHud1 = docName.includes('Purchase HUD-1');
          const isDispositionHud1 = docName.includes('Disposition HUD-1');
          
          if (isPurchaseHud1 || isDispositionHud1) {
            const updatedDeals = deals.map(deal => {
              if (deal.id === dealId) {
                return {
                  ...deal,
                  ...(isPurchaseHud1 && { purchaseHud1DocumentId: addResult.id }),
                  ...(isDispositionHud1 && { dispositionHud1DocumentId: addResult.id }),
                  updatedAt: new Date().toISOString()
                };
              }
              return deal;
            });
            
            setDeals(updatedDeals);
            
            // Save the updated deals to the backend
            try {
              await updateDealHistory(updatedDeals);
            } catch (error) {
              console.error('Error saving deal history:', error);
              toast({
                variant: 'destructive',
                title: 'Save Warning',
                description: 'Document uploaded but deal history not saved. Please save manually.',
              });
            }
          }
        }
      }
      
      // Reload documents
      const result = await borrowerDocumentService.getBorrowerDocuments(user.uid);
      if (result.success && Array.isArray(result.documents)) {
        setBorrowerDocuments(result.documents);
      } else {
        setBorrowerDocuments([]);
      }
      
      toast({
        title: 'Document Uploaded',
        description: `${docName} has been uploaded successfully.`,
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'Failed to upload document. Please try again.',
      });
    }
  };

  const UploadButton = ({ docName, dealId }: { docName: string; dealId: string }) => {
    const fileInputId = `upload-${docName.replace(/\s+/g, '-')}`;
    const doc = Array.isArray(borrowerDocuments) ? borrowerDocuments.find(d => d.name === docName) : undefined;
    
    // Check if this document is associated with the specific deal
    const deal = deals.find(d => d.id === dealId);
    const isPurchaseHud1 = docName.includes('Purchase HUD-1');
    const isDispositionHud1 = docName.includes('Disposition HUD-1');
    
    const isAssociatedWithDeal = deal && (
      (isPurchaseHud1 && deal.purchaseHud1DocumentId) ||
      (isDispositionHud1 && deal.dispositionHud1DocumentId)
    );
    
    // Find the actual document by ID if it's associated with the deal
    const associatedDoc = isAssociatedWithDeal ? 
      (Array.isArray(borrowerDocuments) ? borrowerDocuments.find(d => 
        (isPurchaseHud1 && d.id === deal?.purchaseHud1DocumentId) ||
        (isDispositionHud1 && d.id === deal?.dispositionHud1DocumentId)
      ) : undefined) : undefined;
    
    const handleViewDocument = () => {
      if (associatedDoc?.fileUrl) {
        window.open(associatedDoc.fileUrl, '_blank');
      }
    };
    
    return (
      <div className="space-y-2">
        <div className="relative">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Label htmlFor={fileInputId} className="cursor-pointer">
              <Download className="mr-2 h-4 w-4" /> 
              {docName}
              {isAssociatedWithDeal && <span className="text-green-500 ml-2">✓</span>}
            </Label>
          </Button>
          <Input 
            id={fileInputId} 
            type="file" 
            className="sr-only" 
            onChange={(e) => handleDocumentUpload(docName, dealId, e)} 
            accept=".pdf,.jpg,.jpeg,.png"
          />
        </div>
        
        {isAssociatedWithDeal && associatedDoc && (
          <div className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-200">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-green-700">
                {associatedDoc.fileName}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleViewDocument}
              className="text-green-700 hover:text-green-800 hover:bg-green-100"
            >
              View
            </Button>
          </div>
        )}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Deal History</CardTitle>
            <CardDescription>Please provide details on your past real estate deals (up to 10).</CardDescription>
          </div>
          <Button 
            onClick={handleSaveDeals} 
            disabled={saving || loading}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save All'}
          </Button>
        </div>
      </CardHeader>
      <CardContent id="deal-history-card" className="space-y-6">
        {deals.map((deal, index) => (
          <div key={deal.id} className="space-y-4 rounded-md border p-4 relative">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold">Deal #{index + 1}</h4>
              {deals.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleRemoveDeal(deal.id)}
                  disabled={saving || loading}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove Deal</span>
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`address-${deal.id}`}>Property Address</Label>
              <Input 
                id={`address-${deal.id}`} 
                placeholder="123 Main St, Anytown, USA" 
                value={deal.address} 
                onChange={e => handleDealChange(deal.id, 'address', e.target.value)} 
              />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`purchasePrice-${deal.id}`}>Purchase Price</Label>
                <Input 
                  id={`purchasePrice-${deal.id}`} 
                  type="number" 
                  placeholder="200000" 
                  value={deal.purchasePrice || ''} 
                  onChange={e => handleDealChange(deal.id, 'purchasePrice', parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`rehabAmount-${deal.id}`}>Rehab Amount</Label>
                <Input 
                  id={`rehabAmount-${deal.id}`} 
                  type="number" 
                  placeholder="50000" 
                  value={deal.rehabAmount || ''} 
                  onChange={e => handleDealChange(deal.id, 'rehabAmount', parseFloat(e.target.value) || 0)} 
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`salePrice-${deal.id}`}>Sale Price</Label>
                <Input 
                  id={`salePrice-${deal.id}`} 
                  type="number" 
                  placeholder="300000" 
                  value={deal.salePrice || ''} 
                  onChange={e => handleDealChange(deal.id, 'salePrice', parseFloat(e.target.value) || 0)} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`daysOnMarket-${deal.id}`}>Days on Market</Label>
                <Input 
                  id={`daysOnMarket-${deal.id}`} 
                  type="number" 
                  placeholder="30" 
                  value={deal.daysOnMarket || ''} 
                  onChange={e => handleDealChange(deal.id, 'daysOnMarket', parseInt(e.target.value) || 0)} 
                />
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 pt-2">
              <UploadButton docName={`Purchase HUD-1 (Deal #${index + 1})`} dealId={deal.id} />
              <UploadButton docName={`Disposition HUD-1 (Deal #${index + 1})`} dealId={deal.id} />
            </div>
            
            {index < deals.length - 1 && <Separator />}
          </div>
        ))}

        {deals.length < 10 && (
          <Button 
            variant="outline" 
            onClick={handleAddDeal}
            disabled={saving || loading}
            className="gap-2"
          >
            <PlusCircle className="h-4 w-4" />
            Add Another Deal
          </Button>
        )}
      </CardContent>
    </Card>
  );
}