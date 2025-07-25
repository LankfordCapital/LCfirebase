
'use client';

import { useState, useId, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { PlusCircle, Trash2, Download } from 'lucide-react';
import { Label } from './ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { Separator } from './ui/separator';

type Deal = {
  id: string;
  address: string;
  purchasePrice: string;
  rehabAmount: string;
  salePrice: string;
  daysOnMarket: string;
};

export function DealHistory() {
    const { addDocument, documents } = useDocumentContext();
    const dealId = useId();
    const [deals, setDeals] = useState<Deal[]>([
        { id: dealId, address: '', purchasePrice: '', rehabAmount: '', salePrice: '', daysOnMarket: '' },
    ]);

    const handleAddDeal = () => {
        if (deals.length < 10) {
            const newId = `deal-${deals.length}-${Date.now()}`;
            setDeals([...deals, { id: newId, address: '', purchasePrice: '', rehabAmount: '', salePrice: '', daysOnMarket: '' }]);
        }
    };

    const handleRemoveDeal = (id: string) => {
        setDeals(deals.filter(deal => deal.id !== id));
    };

    const handleDealChange = (id: string, field: keyof Omit<Deal, 'id'>, value: string) => {
        setDeals(deals.map(deal => (deal.id === id ? { ...deal, [field]: value } : deal)));
    };
    
    const handleDocumentUpload = async (docName: string, event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            addDocument({
                name: docName,
                file,
                status: 'uploaded'
            });
        }
    };

    const UploadButton = ({ docName }: { docName: string }) => {
        const fileInputId = `upload-${docName.replace(/\s+/g, '-')}`;
        const doc = documents[docName];
        return (
            <div className="relative">
                <Button variant="outline" className="w-full justify-start" asChild>
                    <Label htmlFor={fileInputId} className="cursor-pointer">
                        <Download className="mr-2" /> 
                        {docName}
                        {doc && <span className="text-green-500 ml-2">(Uploaded)</span>}
                    </Label>
                </Button>
                <Input 
                    id={fileInputId} 
                    type="file" 
                    className="sr-only" 
                    onChange={(e) => handleDocumentUpload(docName, e)} 
                />
            </div>
        );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Deal History</CardTitle>
                <CardDescription>Please provide details on your past real estate deals (up to 10).</CardDescription>
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
                            >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove Deal</span>
                            </Button>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`address-${deal.id}`}>Property Address</Label>
                        <Input id={`address-${deal.id}`} placeholder="123 Main St, Anytown, USA" value={deal.address} onChange={e => handleDealChange(deal.id, 'address', e.target.value)} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor={`purchasePrice-${deal.id}`}>Purchase Price</Label>
                        <Input id={`purchasePrice-${deal.id}`} type="number" placeholder="200000" value={deal.purchasePrice} onChange={e => handleDealChange(deal.id, 'purchasePrice', e.target.value)}/>
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor={`rehabAmount-${deal.id}`}>Rehab Amount</Label>
                        <Input id={`rehabAmount-${deal.id}`} type="number" placeholder="50000" value={deal.rehabAmount} onChange={e => handleDealChange(deal.id, 'rehabAmount', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                        <Label htmlFor={`salePrice-${deal.id}`}>Sale Price</Label>
                        <Input id={`salePrice-${deal.id}`} type="number" placeholder="300000" value={deal.salePrice} onChange={e => handleDealChange(deal.id, 'salePrice', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor={`daysOnMarket-${deal.id}`}>Days on Market</Label>
                        <Input id={`daysOnMarket-${deal.id}`} type="number" placeholder="30" value={deal.daysOnMarket} onChange={e => handleDealChange(deal.id, 'daysOnMarket', e.target.value)} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 pt-2">
                        <UploadButton docName={`Purchase HUD-1 (Deal #${index + 1})`} />
                        <UploadButton docName={`Disposition HUD-1 (Deal #${index + 1})`} />
                    </div>
                    {index < deals.length - 1 && <Separator />}
                    </div>
                ))}

                {deals.length < 10 && (
                    <Button variant="outline" onClick={handleAddDeal}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Another Deal
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
