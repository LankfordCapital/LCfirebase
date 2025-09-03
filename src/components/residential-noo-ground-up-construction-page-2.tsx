'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowRight, ArrowLeft, Calculator, TrendingUp, DollarSign, CheckCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getOfficeBasePath } from '@/lib/office-routing';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/hooks/use-toast';

// Simple application interface for this component
interface SimpleApplication {
  id?: string;
  userId: string;
  brokerId: string;
  financialInfo: {
    revenue: number;
    cogs: number;
    grossProfit: number;
    salaries: number;
    rent: number;
    utilities: number;
    marketing: number;
    repairs: number;
    otherExpenses: number;
    totalOperatingExpenses: number;
    netOperatingIncome: number;
  };
  progress?: {
    page2Completed: boolean;
    overallProgress: number;
  };
}

export function ResidentialNOOGroundUpConstructionPage2({ 
  officeContext = 'broker',
  applicationId,
  borrowerId
}: { 
  officeContext?: 'borrower' | 'broker' | 'workforce',
  applicationId?: string,
  borrowerId?: string
}) {
  // Simple state management
  const [application, setApplication] = useState<SimpleApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Hooks
  const authContext = useAuth();
  const user = authContext?.user;
  const toastContext = useToast();
  const toast = toastContext?.toast || (() => {});
  const router = useRouter();

  // ============================================================================
  // LOAD APPLICATION DATA
  // ============================================================================
  
  const loadApplication = useCallback(async () => {
    if (!applicationId || !user) {
      setLoading(false);
      return;
    }
    
    try {
      console.log('Loading application:', applicationId);
      setLoading(true);
      
      const response = await fetch(`/api/enhanced-loan-applications?id=${applicationId}`);
      if (!response.ok) {
        throw new Error(`Failed to load application: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        console.log('Application loaded successfully:', result.data);
        
        // Transform to simple structure
        const simpleApp: SimpleApplication = {
          id: result.data.id,
          userId: result.data.userId || user.uid,
          brokerId: result.data.brokerId || user.uid,
          financialInfo: {
            revenue: result.data.financialInfo?.revenue || 0,
            cogs: result.data.financialInfo?.cogs || 0,
            grossProfit: result.data.financialInfo?.grossProfit || 0,
            salaries: result.data.financialInfo?.salaries || 0,
            rent: result.data.financialInfo?.rent || 0,
            utilities: result.data.financialInfo?.utilities || 0,
            marketing: result.data.financialInfo?.marketing || 0,
            repairs: result.data.financialInfo?.repairs || 0,
            otherExpenses: result.data.financialInfo?.otherExpenses || 0,
            totalOperatingExpenses: result.data.financialInfo?.totalOperatingExpenses || 0,
            netOperatingIncome: result.data.financialInfo?.netOperatingIncome || 0
          },
          progress: {
            page2Completed: result.data.progress?.page2Completed || false,
            overallProgress: result.data.progress?.overallProgress || 0
          }
        };
        
        console.log('Simple application created:', simpleApp);
        setApplication(simpleApp);
      } else {
        console.error('Failed to load application:', result.error);
        toast({
          variant: 'destructive',
          title: 'Load Error',
          description: result.error || 'Failed to load application',
        });
      }
    } catch (error) {
      console.error('Error loading application:', error);
      toast({
        variant: 'destructive',
        title: 'Load Error',
        description: error instanceof Error ? error.message : 'Failed to load application',
      });
    } finally {
      setLoading(false);
    }
  }, [applicationId, user, toast]);

  // Load application on mount
  useEffect(() => {
    if (applicationId && user) {
      loadApplication();
    } else if (!applicationId) {
      // Create new application if no ID
      setApplication({
        userId: user?.uid || '',
        brokerId: user?.uid || '',
        financialInfo: {
          revenue: 0,
          cogs: 0,
          grossProfit: 0,
          salaries: 0,
          rent: 0,
          utilities: 0,
          marketing: 0,
          repairs: 0,
          otherExpenses: 0,
          totalOperatingExpenses: 0,
          netOperatingIncome: 0
        },
        progress: {
          page2Completed: false,
          overallProgress: 0
        }
      });
      setLoading(false);
    }
  }, [applicationId, user, loadApplication]);

  // ============================================================================
  // UPDATE FIELD HELPER
  // ============================================================================
  
  const updateField = useCallback((path: string, value: any) => {
    if (!application) return;
    
    setApplication(prev => {
      if (!prev) return prev;
      
      const newApp = { ...prev };
      const keys = path.split('.');
      let current: any = newApp;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newApp;
    });
  }, [application]);

  // ============================================================================
  // SAVE APPLICATION
  // ============================================================================
  
  const saveApplication = useCallback(async () => {
    if (!application || !user) return;
    
    try {
      setSaving(true);
      console.log('Saving application:', application);
      
      const response = await fetch('/api/enhanced-loan-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          applicationId: application.id,
          data: application
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save: ${response.statusText}`);
      }
      
      const result = await response.json();
      if (result.success) {
        console.log('Application saved successfully');
        toast({
          title: 'Saved',
          description: 'Application updated successfully',
        });
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Error saving application:', error);
      toast({
        variant: 'destructive',
        title: 'Save Error',
        description: error instanceof Error ? error.message : 'Failed to save application',
      });
    } finally {
      setSaving(false);
    }
  }, [application, user, toast]);

  // ============================================================================
  // FORM FIELD HANDLERS FOR PAGE 2 - COMPANY P&L STATEMENT
  // ============================================================================
  
  const handleRevenueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.revenue', value);
    // Auto-calculate gross profit
    const cogs = application?.financialInfo?.cogs || 0;
    updateField('financialInfo.grossProfit', value - cogs);
  };

  const handleCogsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.cogs', value);
    // Auto-calculate gross profit
    const revenue = application?.financialInfo?.revenue || 0;
    updateField('financialInfo.grossProfit', revenue - value);
  };

  const handleSalariesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.salaries', value);
    calculateTotalExpenses();
  };

  const handleRentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.rent', value);
    calculateTotalExpenses();
  };

  const handleUtilitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.utilities', value);
    calculateTotalExpenses();
  };

  const handleMarketingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.marketing', value);
    calculateTotalExpenses();
  };

  const handleRepairsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.repairs', value);
    calculateTotalExpenses();
  };

  const handleOtherExpensesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    updateField('financialInfo.otherExpenses', value);
    calculateTotalExpenses();
  };

  // Auto-calculate total operating expenses and net operating income
  const calculateTotalExpenses = useCallback(() => {
    if (!application?.financialInfo) return;
    
    const { salaries, rent, utilities, marketing, repairs, otherExpenses } = application.financialInfo;
    const totalExpenses = salaries + rent + utilities + marketing + repairs + otherExpenses;
    
    updateField('financialInfo.totalOperatingExpenses', totalExpenses);
    
    // Calculate net operating income
    const revenue = application.financialInfo.revenue;
    const cogs = application.financialInfo.cogs;
    const grossProfit = revenue - cogs;
    const netOperatingIncome = grossProfit - totalExpenses;
    
    updateField('financialInfo.netOperatingIncome', netOperatingIncome);
  }, [application, updateField]);

  // ============================================================================
  // NAVIGATION HANDLERS
  // ============================================================================
  
  const handleNextPage = (currentPage: number) => {
    if (application) {
      // Mark page as completed
      updateField('progress.page2Completed', true);
      updateField('progress.overallProgress', Math.min(100, (currentPage / 12) * 100));
      
      // Save before navigating
      saveApplication().then(() => {
        const nextPage = currentPage + 1;
        const basePath = getOfficeBasePath(officeContext);
        router.push(`${basePath}/residential-noo-ground-up-construction/page-${nextPage}`);
      });
    }
  };

  const handlePreviousPage = (currentPage: number) => {
    const previousPage = currentPage - 1;
    const basePath = getOfficeBasePath(officeContext);
    router.push(`${basePath}/residential-noo-ground-up-construction/page-${previousPage}`);
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  
  // Debug logging
  console.log('Page 2 Render State:', {
    loading,
    hasApplication: !!application,
    applicationId: application?.id,
    progress: application?.progress
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-red-600">
        <p>Failed to load application. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Application Progress</span>
              <span className="text-blue-600 font-semibold">{application.progress?.overallProgress || 0}%</span>
            </div>
            <Progress value={application.progress?.overallProgress || 0} className="h-3" />
            
            {/* Page Completion Status */}
            <div className="grid grid-cols-6 gap-2 text-xs">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((pageNum) => (
                <div key={pageNum} className="text-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-1",
                    pageNum === 2 && application.progress?.page2Completed
                      ? "bg-green-100 text-green-600 border-2 border-green-300" 
                      : pageNum === 2
                      ? "bg-blue-100 text-blue-600 border-2 border-blue-300"
                      : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                  )}>
                    {pageNum === 2 && application.progress?.page2Completed ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      pageNum
                    )}
                  </div>
                  <span className="text-xs">Page {pageNum}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page 2: Company P&L Statement */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Company Profit & Loss Statement
          </CardTitle>
          <CardDescription>
            Enter your company's financial information for the past 12 months
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Revenue Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Revenue
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Revenue */}
              <div className="space-y-2">
                <Label htmlFor="revenue">Total Revenue *</Label>
                <Input
                  id="revenue"
                  type="number"
                  value={application.financialInfo?.revenue || ''}
                  onChange={handleRevenueChange}
                  placeholder="50000"
                  className="w-full"
                />
              </div>

              {/* Cost of Goods Sold */}
              <div className="space-y-2">
                <Label htmlFor="cogs">Cost of Goods Sold</Label>
                <Input
                  id="cogs"
                  type="number"
                  value={application.financialInfo?.cogs || ''}
                  onChange={handleCogsChange}
                  placeholder="15000"
                  className="w-full"
                />
              </div>
            </div>

            {/* Auto-calculated Gross Profit */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-800">Gross Profit (Auto-calculated)</span>
                <span className="text-lg font-bold text-green-600">
                  ${(application.financialInfo?.grossProfit || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Operating Expenses Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Operating Expenses
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Salaries */}
              <div className="space-y-2">
                <Label htmlFor="salaries">Salaries & Wages</Label>
                <Input
                  id="salaries"
                  type="number"
                  value={application.financialInfo?.salaries || ''}
                  onChange={handleSalariesChange}
                  placeholder="8000"
                  className="w-full"
                />
              </div>

              {/* Rent */}
              <div className="space-y-2">
                <Label htmlFor="rent">Rent & Utilities</Label>
                <Input
                  id="rent"
                  type="number"
                  value={application.financialInfo?.rent || ''}
                  onChange={handleRentChange}
                  placeholder="2000"
                  className="w-full"
                />
              </div>

              {/* Utilities */}
              <div className="space-y-2">
                <Label htmlFor="utilities">Utilities</Label>
                <Input
                  id="utilities"
                  type="number"
                  value={application.financialInfo?.utilities || ''}
                  onChange={handleUtilitiesChange}
                  placeholder="500"
                  className="w-full"
                />
              </div>

              {/* Marketing */}
              <div className="space-y-2">
                <Label htmlFor="marketing">Marketing & Advertising</Label>
                <Input
                  id="marketing"
                  type="number"
                  value={application.financialInfo?.marketing || ''}
                  onChange={handleMarketingChange}
                  placeholder="1000"
                  className="w-full"
                />
              </div>

              {/* Repairs */}
              <div className="space-y-2">
                <Label htmlFor="repairs">Repairs & Maintenance</Label>
                <Input
                  id="repairs"
                  type="number"
                  value={application.financialInfo?.repairs || ''}
                  onChange={handleRepairsChange}
                  placeholder="1500"
                  className="w-full"
                />
              </div>

              {/* Other Expenses */}
              <div className="space-y-2">
                <Label htmlFor="otherExpenses">Other Operating Expenses</Label>
                <Input
                  id="otherExpenses"
                  type="number"
                  value={application.financialInfo?.otherExpenses || ''}
                  onChange={handleOtherExpensesChange}
                  placeholder="500"
                  className="w-full"
                />
              </div>
            </div>

            {/* Auto-calculated Totals */}
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">Total Operating Expenses (Auto-calculated)</span>
                  <span className="text-lg font-bold text-gray-600">
                    ${(application.financialInfo?.totalOperatingExpenses || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-blue-800">Net Operating Income (Auto-calculated)</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${(application.financialInfo?.netOperatingIncome || 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handlePreviousPage(2)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button
          onClick={() => handleNextPage(2)}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Next Page
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>

      {/* Debug Information (remove in production) */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">Debug Info - Page 2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xs text-gray-500 space-y-1">
            <p>Page 2 Complete: {application.progress?.page2Completed ? 'Yes' : 'No'}</p>
            <p>Revenue: ${application.financialInfo?.revenue || 0}</p>
            <p>COGS: ${application.financialInfo?.cogs || 0}</p>
            <p>Gross Profit: ${application.financialInfo?.grossProfit || 0}</p>
            <p>Total Expenses: ${application.financialInfo?.totalOperatingExpenses || 0}</p>
            <p>Net Income: ${application.financialInfo?.netOperatingIncome || 0}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
