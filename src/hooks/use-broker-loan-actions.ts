import { useState, useEffect } from 'react';
import { authenticatedGet } from '@/lib/api-client';

export interface MissingDocument {
  id: string;
  name: string;
  category: string;
  note?: string;
  required: boolean;
  status: 'missing' | 'pending' | 'approved' | 'rejected';
}

export interface LoanAction {
  id: string;
  propertyAddress: string;
  loanType: string;
  status: string;
  progress: number;
  missingDocuments: MissingDocument[];
  createdAt: any;
  updatedAt: any;
}

export interface BrokerLoanActionsData {
  loans: LoanAction[];
  loading: boolean;
  error: string | null;
  refreshData: () => void;
}

export function useBrokerLoanActions(): BrokerLoanActionsData {
  const [loans, setLoans] = useState<LoanAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLoanActions = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch broker's loan applications
      const response = await authenticatedGet('/api/enhanced-loan-applications', { 
        action: 'getByBroker' 
      });
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        const loanActions: LoanAction[] = result.data.map((app: any) => {
          const missingDocs = getMissingDocuments(app);
          
          return {
            id: app.id,
            propertyAddress: app.propertyAddress || app.propertyInfo?.address || 'Property address not set',
            loanType: app.loanProgram || app.loanType || 'Unknown Program',
            status: app.status || 'Draft',
            progress: typeof app.progress === 'object' && app.progress?.overallProgress 
              ? app.progress.overallProgress 
              : (typeof app.progress === 'number' ? app.progress : 0),
            missingDocuments: missingDocs,
            createdAt: app.createdAt,
            updatedAt: app.updatedAt
          };
        });

        // Filter to only show loans with missing documents
        const loansWithMissingDocs = loanActions.filter(loan => 
          loan.missingDocuments.length > 0
        );

        setLoans(loansWithMissingDocs);
      } else {
        setLoans([]);
      }
    } catch (err) {
      console.error('Error fetching broker loan actions:', err);
      setError('Failed to load loan applications');
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  const getMissingDocuments = (application: any): MissingDocument[] => {
    const missingDocs: MissingDocument[] = [];
    
    // Check if document tracking exists
    if (!application.documentTracking) {
      // If no document tracking, return basic required documents
      return [
        { id: 'gov_id', name: 'Government ID', category: 'borrower', required: true, status: 'missing' },
        { id: 'credit_report', name: 'Credit Report', category: 'borrower', required: true, status: 'missing' },
        { id: 'purchase_agreement', name: 'Purchase Agreement', category: 'property', required: true, status: 'missing' }
      ];
    }

    const docTracking = application.documentTracking;

    // Check borrower documents
    if (!docTracking.borrowerDocuments?.governmentId?.fileUrl) {
      missingDocs.push({
        id: 'gov_id',
        name: 'Government ID',
        category: 'borrower',
        required: true,
        status: 'missing',
        note: docTracking.borrowerDocuments?.governmentId?.notes
      });
    }

    if (!docTracking.borrowerDocuments?.creditReport?.fileUrl) {
      missingDocs.push({
        id: 'credit_report',
        name: 'Credit Report',
        category: 'borrower',
        required: true,
        status: 'missing',
        note: docTracking.borrowerDocuments?.creditReport?.notes
      });
    }

    if (!docTracking.borrowerDocuments?.personalFinancialStatement?.fileUrl) {
      missingDocs.push({
        id: 'financial_statement',
        name: 'Personal Financial Statement',
        category: 'borrower',
        required: true,
        status: 'missing',
        note: docTracking.borrowerDocuments?.personalFinancialStatement?.notes
      });
    }

    if (!docTracking.borrowerDocuments?.proofOfFunds?.fileUrl) {
      missingDocs.push({
        id: 'proof_of_funds',
        name: 'Proof of Funds',
        category: 'borrower',
        required: true,
        status: 'missing',
        note: docTracking.borrowerDocuments?.proofOfFunds?.notes
      });
    }

    // Check property documents
    if (!docTracking.propertyDocuments?.purchaseAgreement?.fileUrl) {
      missingDocs.push({
        id: 'purchase_agreement',
        name: 'Purchase Agreement',
        category: 'property',
        required: true,
        status: 'missing',
        note: docTracking.propertyDocuments?.purchaseAgreement?.notes
      });
    }

    if (!docTracking.propertyDocuments?.appraisal?.fileUrl) {
      missingDocs.push({
        id: 'appraisal',
        name: 'Property Appraisal',
        category: 'property',
        required: true,
        status: 'missing',
        note: docTracking.propertyDocuments?.appraisal?.notes
      });
    }

    if (!docTracking.propertyDocuments?.titleCommitment?.fileUrl) {
      missingDocs.push({
        id: 'title_commitment',
        name: 'Title Commitment',
        category: 'property',
        required: true,
        status: 'missing',
        note: docTracking.propertyDocuments?.titleCommitment?.notes
      });
    }

    if (!docTracking.propertyDocuments?.insuranceQuote?.fileUrl) {
      missingDocs.push({
        id: 'insurance_quote',
        name: 'Insurance Quote',
        category: 'property',
        required: true,
        status: 'missing',
        note: docTracking.propertyDocuments?.insuranceQuote?.notes
      });
    }

    // Check for rejected documents that need to be re-uploaded
    Object.entries(docTracking.borrowerDocuments || {}).forEach(([key, doc]: [string, any]) => {
      if (doc?.status === 'rejected' && doc?.fileUrl) {
        missingDocs.push({
          id: `rejected_${key}`,
          name: getDocumentDisplayName(key),
          category: 'borrower',
          required: true,
          status: 'rejected',
          note: doc.notes || 'Document was rejected and needs to be re-uploaded'
        });
      }
    });

    Object.entries(docTracking.propertyDocuments || {}).forEach(([key, doc]: [string, any]) => {
      if (doc?.status === 'rejected' && doc?.fileUrl) {
        missingDocs.push({
          id: `rejected_${key}`,
          name: getDocumentDisplayName(key),
          category: 'property',
          required: true,
          status: 'rejected',
          note: doc.notes || 'Document was rejected and needs to be re-uploaded'
        });
      }
    });

    return missingDocs;
  };

  const getDocumentDisplayName = (key: string): string => {
    const displayNames: Record<string, string> = {
      governmentId: 'Government ID',
      socialSecurityCard: 'Social Security Card',
      personalFinancialStatement: 'Personal Financial Statement',
      creditReport: 'Credit Report',
      personalAssetStatements: 'Asset Statements',
      proofOfFunds: 'Proof of Funds',
      purchaseAgreement: 'Purchase Agreement',
      earnestMoneyDeposit: 'Earnest Money Deposit',
      titleCommitment: 'Title Commitment',
      appraisal: 'Property Appraisal',
      propertyTaxCertificate: 'Property Tax Certificate',
      insuranceQuote: 'Insurance Quote',
      environmentalReport: 'Environmental Report'
    };
    
    return displayNames[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
  };

  useEffect(() => {
    fetchLoanActions();
  }, []);

  return {
    loans,
    loading,
    error,
    refreshData: fetchLoanActions
  };
}

