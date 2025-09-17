
'use client';

import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { useDocumentContext } from '@/contexts/document-context';
import { CheckCircle, ArrowLeft, ArrowRight, User, Briefcase, FileText, FileUp, Check, AlertTriangle, Landmark, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getOfficeContextFromUrl, getOfficeBasePath } from '@/lib/office-routing';
import { getDocumentChecklist } from '@/ai/flows/document-checklist-flow';
import { useAuth } from '@/contexts/auth-context';
import { DealHistory } from '@/components/deal-history';
import { scanAssetStatement, type ScanAssetStatementOutput } from '@/ai/flows/asset-statement-scanner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomLoader } from './ui/custom-loader';
import { useLoanApplication } from '@/hooks/use-loan-application';

type UploadStatus = 'pending' | 'uploaded' | 'verified' | 'missing';

type DocumentItem = {
    name: string;
    status: UploadStatus;
};

type CategorizedDocuments = {
    borrower: DocumentItem[];
    company: DocumentItem[];
    subjectProperty: DocumentItem[];
};

type AssetScanState = {
    balance: ScanAssetStatementOutput | null;
    isScanning: boolean;
};

export function LoanApplicationClientPage4Enhanced({ 
  loanProgram, 
  officeContext = 'borrower',
  applicationId,
  borrowerId 
}: { 
  loanProgram: string, 
  officeContext?: 'borrower' | 'broker' | 'workforce',
  applicationId?: string,
  borrowerId?: string
}) {
  const [checklist, setChecklist] = useState<CategorizedDocuments | null>(null);
  const [isLoadingChecklist, setIsLoadingChecklist] = useState(true);
  const [numberOfSponsors, setNumberOfSponsors] = useState(1);
  
  const [assetScanStates, setAssetScanStates] = useState<Record<string, Record<string, AssetScanState>>>({});

  const { documents, addDocument, getDocument } = useDocumentContext();
  const { user } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  // Use the loan application hook for auto-save functionality
  const { 
    application,
    loading,
    saving,
    updateField,
    updateFields
  } = useLoanApplication(applicationId);

  // Load saved data when component mounts or applicationId changes
  useEffect(() => {
    if (applicationId && application) {
      try {
        // Load number of sponsors
        if (application.borrowerInfo?.numberOfSponsors) {
          setNumberOfSponsors(application.borrowerInfo.numberOfSponsors);
        }
        
        // Load asset scan states if they exist
        if (application.notes) {
          try {
            const savedData = JSON.parse(application.notes);
            if (savedData.assetScanStates) {
              setAssetScanStates(savedData.assetScanStates);
            }
          } catch (error) {
            console.log('No saved asset scan states found');
          }
        }
      } catch (error) {
        console.log('Error loading saved data:', error);
      }
    }
  }, [applicationId, application]);

  // Auto-save number of sponsors when it changes
  useEffect(() => {
    if (applicationId && numberOfSponsors > 0) {
      updateField('borrowerInfo.numberOfSponsors', numberOfSponsors);
    }
  }, [applicationId, numberOfSponsors, updateField]);

  // Save all form data to database
  const saveAllData = async () => {
    if (!applicationId) return;

    try {
      // Save asset scan states to notes field as JSON
      const notesData = {
        assetScanStates,
        lastSaved: new Date().toISOString()
      };

      await updateField('notes', JSON.stringify(notesData));

      toast({
        title: 'Data Saved',
        description: 'All form data has been saved to your application.',
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Failed to save your data. Please try again.',
      });
    }
  };

  const loadDocumentChecklist = useCallback(async () => {
    if (!loanProgram) return;
    
    setIsLoadingChecklist(true);
    try {
      const checklistData = await getDocumentChecklist(loanProgram);
      setChecklist(checklistData);
    } catch (error) {
      console.error('Error loading document checklist:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load document checklist. Please try again.',
      });
    } finally {
      setIsLoadingChecklist(false);
    }
  }, [loanProgram, toast]);

  useEffect(() => {
    loadDocumentChecklist();
  }, [loadDocumentChecklist]);

  const handleNextPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    const isEquipmentFinancing = loanProgram.toLowerCase().includes('equipment financing');

    // Get the current office context from the URL
    const currentOfficeContext = getOfficeContextFromUrl();
    const basePath = getOfficeBasePath(currentOfficeContext);

    if (isEquipmentFinancing) {
        router.push(`${basePath}/${programSlug}/page-5`);
    } else {
        router.push(`${basePath}/${programSlug}/page-5`);
    }
  };

  const handlePreviousPage = () => {
    const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
    const currentOfficeContext = getOfficeContextFromUrl();
    const basePath = getOfficeBasePath(currentOfficeContext);
    router.push(`${basePath}/${programSlug}/page-3`);
  };

  const handleSponsorCountChange = (value: string) => {
    const count = parseInt(value) || 1;
    setNumberOfSponsors(count);
  };

  const getStatusIcon = (status: UploadStatus) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'uploaded':
        return <FileUp className="h-4 w-4 text-blue-600" />;
      case 'missing':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: UploadStatus) => {
    switch (status) {
      case 'verified':
        return 'Verified';
      case 'uploaded':
        return 'Uploaded';
      case 'missing':
        return 'Missing';
      default:
        return 'Pending';
    }
  };

  const scanAssetStatementForSponsor = async (sponsorIndex: number, statementType: string) => {
    if (!user) return;

    const key = `sponsor-${sponsorIndex}`;
    const statementKey = statementType;

    // Update loading state
    setAssetScanStates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [statementKey]: {
          ...prev[key]?.[statementKey],
          isScanning: true
        }
      }
    }));

    try {
      // Get the document from context
      const doc = getDocument(`Asset Statement - ${statementType} - Sponsor ${sponsorIndex + 1}`);
      
      if (!doc) {
        throw new Error('Document not found');
      }

      const result = await scanAssetStatement(doc.file);
      
      // Update with scan result
      setAssetScanStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [statementKey]: {
            balance: result,
            isScanning: false
          }
        }
      }));

      // Auto-save scan results
      if (applicationId) {
        const updatedStates = {
          ...assetScanStates,
          [key]: {
            ...assetScanStates[key],
            [statementKey]: {
              balance: result,
              isScanning: false
            }
          }
        };
        
        const notesData = {
          assetScanStates: updatedStates,
          lastSaved: new Date().toISOString()
        };
        
        await updateField('notes', JSON.stringify(notesData));
      }

      toast({
        title: 'Scan Complete',
        description: `Asset statement scanned successfully. Balance: $${result.totalBalance?.toLocaleString() || 'N/A'}`,
      });
    } catch (error) {
      console.error('Error scanning asset statement:', error);
      
      // Update loading state on error
      setAssetScanStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          [statementKey]: {
            ...prev[key]?.[statementKey],
            isScanning: false
          }
        }
      }));

      toast({
        variant: 'destructive',
        title: 'Scan Failed',
        description: 'Failed to scan asset statement. Please try again.',
      });
    }
  };

  if (isLoadingChecklist) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-headline text-3xl font-bold">Loan Application - Page 4 of 12</h1>
          <p className="text-muted-foreground">{loanProgram.replace(/Dscr/g, 'DSCR')}</p>
        </div>
        <CustomLoader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold">Loan Application - Page 4 of 12</h1>
          <p className="text-muted-foreground">{loanProgram.replace(/Dscr/g, 'DSCR')}</p>
        </div>
        
        {/* Save Button */}
        <Button 
          onClick={saveAllData} 
          variant="outline" 
          className="flex items-center gap-2"
          disabled={saving}
        >
          <Save className="h-4 w-4" />
          {saving ? 'Saving...' : 'Save Progress'}
        </Button>
      </div>

      {/* Sponsor Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Number of Sponsors
          </CardTitle>
          <CardDescription>
            How many sponsors are involved in this loan application?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="sponsor-count">Number of Sponsors</Label>
              <Select value={numberOfSponsors.toString()} onValueChange={handleSponsorCountChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select number of sponsors" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} Sponsor{num > 1 ? 's' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Statements */}
      {Array.from({ length: numberOfSponsors }, (_, sponsorIndex) => (
        <Card key={sponsorIndex}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Landmark className="h-5 w-5 text-primary" />
              Sponsor {sponsorIndex + 1} - Asset Statements
            </CardTitle>
            <CardDescription>
              Upload and scan asset statements for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Bank Statement', 'Investment Statement', 'Business Bank Statement'].map((statementType) => {
                const key = `sponsor-${sponsorIndex}`;
                const statementKey = statementType;
                const scanState = assetScanStates[key]?.[statementKey];
                const doc = getDocument(`Asset Statement - ${statementType} - Sponsor ${sponsorIndex + 1}`);
                
                return (
                  <div key={statementType} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{statementType}</h4>
                      <div className="flex items-center gap-2">
                        {doc && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => scanAssetStatementForSponsor(sponsorIndex, statementType)}
                            disabled={scanState?.isScanning}
                          >
                            {scanState?.isScanning ? (
                              <>
                                <CustomLoader size="sm" />
                                Scanning...
                              </>
                            ) : (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Scan
                              </>
                            )}
                          </Button>
                        )}
                        {scanState?.balance && (
                          <span className="text-sm font-medium text-green-600">
                            Balance: ${scanState.balance.totalBalance?.toLocaleString() || 'N/A'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Document Checklist */}
      {checklist && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Borrower Documents
              </CardTitle>
              <CardDescription>
                Required documents for the borrower
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.borrower.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <span>{doc.name}</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      doc.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                      doc.status === 'missing' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(doc.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Company Documents
              </CardTitle>
              <CardDescription>
                Required documents for the company
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.company.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <span>{doc.name}</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      doc.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                      doc.status === 'missing' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(doc.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Subject Property Documents
              </CardTitle>
              <CardDescription>
                Required documents for the subject property
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {checklist.subjectProperty.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(doc.status)}
                      <span>{doc.name}</span>
                    </div>
                    <span className={`text-sm px-2 py-1 rounded ${
                      doc.status === 'verified' ? 'bg-green-100 text-green-800' :
                      doc.status === 'uploaded' ? 'bg-blue-100 text-blue-800' :
                      doc.status === 'missing' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {getStatusText(doc.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Deal History */}
      <DealHistory />

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={handlePreviousPage}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <Button onClick={handleNextPage}>
          Next
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Save Status Indicator */}
      {applicationId && saving && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-blue-700">
              <CustomLoader size="sm" />
              <span>Saving your progress...</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="pt-4 border-t">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Progress saved automatically</span>
          <span>Page 4 of 12</span>
        </div>
      </div>
    </div>
  );
}
