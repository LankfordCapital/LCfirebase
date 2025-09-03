# 🏗️ How to Use the Ground Up Construction Form Hook

## 📋 Overview

This hook gives you a complete object structure to save all user-entered fields and files while they're filling out the **Residential NOO Ground Up Construction** loan application.

## 🚀 Quick Start

### 1. Import the Hook

```typescript
import { useGroundUpConstructionForm } from '@/hooks/use-ground-up-construction-form';
```

### 2. Use in Your Component

```typescript
function YourLoanApplicationForm() {
  const {
    application,
    saving,
    lastSaved,
    initializeApplication,
    updateField,
    updateFields,
    saveApplication,
    markPageCompleted,
    getApplicationData
  } = useGroundUpConstructionForm();

  // Initialize when component mounts
  useEffect(() => {
    if (!application) {
      initializeApplication('broker123'); // Replace with actual broker ID
    }
  }, [application, initializeApplication]);

  // Handle form field changes
  const handlePropertyAddressChange = (value: string) => {
    updateField('propertyInfo.propertyAddress', value);
  };

  const handleLoanAmountChange = (value: number) => {
    updateField('loanDetails.loanAmount', value);
  };

  // Save to your database
  const handleSave = async () => {
    await saveApplication(async (data) => {
      // Save to Firebase, PostgreSQL, or any database
      await yourDatabaseService.save(data);
    });
  };

  // Mark page as completed
  const handlePageComplete = (pageNumber: number) => {
    markPageCompleted(pageNumber);
  };

  return (
    <div>
      {/* Your existing form fields */}
      <input 
        value={application?.propertyInfo.propertyAddress || ''}
        onChange={(e) => handlePropertyAddressChange(e.target.value)}
        placeholder="Property Address"
      />
      
      <input 
        type="number"
        value={application?.loanDetails.loanAmount || ''}
        onChange={(e) => handleLoanAmountChange(parseFloat(e.target.value) || 0)}
        placeholder="Loan Amount"
      />
      
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Application'}
      </button>
      
      {lastSaved && (
        <p>Last saved: {lastSaved.toLocaleString()}</p>
      )}
    </div>
  );
}
```

## 📊 Field Paths for All Pages

### **Page 1: Loan & Property Details**
```typescript
// Property Information
updateField('propertyInfo.propertyAddress', '123 Main St');
updateField('propertyInfo.propertyApn', '123-456-789');
updateField('propertyInfo.annualPropertyTaxes', 5000);
updateField('propertyInfo.propertyType', 'multi-family');
updateField('propertyInfo.asIsValue', 350000);
updateField('propertyInfo.afterConstructedValue', 1000000);
updateField('propertyInfo.stabilizedValue', 1200000);
updateField('propertyInfo.propertySquareFootage', 2000);
updateField('propertyInfo.lotSize', '10,000 sq. ft.');
updateField('propertyInfo.constructionTime', 6);
updateField('propertyInfo.requestedClosingDate', new Date());

// Loan Details
updateField('loanDetails.loanAmount', 300000);
updateField('loanDetails.transactionType', 'purchase');
updateField('loanDetails.purchasePrice', 400000);

// Business Information
updateField('businessInfo.companyName', 'Real Estate Holdings LLC');
updateField('businessInfo.companyEin', '12-3456789');
```

### **Page 2: Company P&L Statement**
```typescript
updateField('financialInfo.revenue', 50000);
updateField('financialInfo.cogs', 15000);
updateField('financialInfo.salaries', 8000);
updateField('financialInfo.rent', 2000);
updateField('financialInfo.utilities', 500);
updateField('financialInfo.marketing', 1000);
updateField('financialInfo.repairs', 1500);
updateField('financialInfo.otherExpenses', 500);
```

### **Page 3: Borrower Information**
```typescript
updateField('borrowerInfo.fullName', 'John Construction Investor');
updateField('borrowerInfo.email', 'john@construction.com');
updateField('borrowerInfo.phone', '555-123-4567');
updateField('borrowerInfo.dateOfBirth', new Date('1980-01-01'));
updateField('borrowerInfo.ssn', '123-45-6789');
updateField('borrowerInfo.maritalStatus', 'married');
updateField('borrowerInfo.dependents', 2);
updateField('borrowerInfo.currentAddress.street', '123 Main Street');
updateField('borrowerInfo.currentAddress.city', 'Austin');
updateField('borrowerInfo.currentAddress.state', 'TX');
updateField('borrowerInfo.currentAddress.zipCode', '78701');
updateField('borrowerInfo.currentAddress.yearsAtAddress', 5);
updateField('borrowerInfo.currentAddress.rentOrOwn', 'own');
updateField('borrowerInfo.currentAddress.monthlyPayment', 2500);
updateField('borrowerInfo.employmentStatus', 'employed');
updateField('borrowerInfo.annualIncome', 120000);
updateField('borrowerInfo.citizenship', 'us_citizen');
```

### **Page 4: Financial Assets & Liabilities**
```typescript
// Add checking account
const checkingAccount = {
  institution: 'Chase Bank',
  accountNumber: '****1234',
  balance: 25000,
  accountType: 'checking' as const
};
updateField('financialAssets.checkingAccounts', [checkingAccount]);

// Add credit card
const creditCard = {
  institution: 'American Express',
  accountNumber: '****5678',
  balance: 5000,
  monthlyPayment: 500,
  creditLimit: 15000
};
updateField('financialLiabilities.creditCards', [creditCard]);
```

### **Page 5: Income Information**
```typescript
updateField('incomeInfo.employmentIncome.salary', 80000);
updateField('incomeInfo.employmentIncome.commission', 20000);
updateField('incomeInfo.employmentIncome.bonus', 15000);
updateField('incomeInfo.employmentIncome.overtime', 5000);
updateField('incomeInfo.businessIncome.netBusinessIncome', 50000);
updateField('incomeInfo.investmentIncome.dividends', 5000);
updateField('incomeInfo.investmentIncome.rentalIncome', 24000);
```

## 📄 Document Uploads

### **Company Documents**
```typescript
const einDocument = {
  name: 'EIN Certificate (Company)',
  fileUrl: 'https://storage.googleapis.com/...',
  fileName: 'ein-cert.pdf',
  fileSize: 1024000,
  mimeType: 'application/pdf',
  uploadedAt: new Date(),
  uploadedBy: user.uid,
  status: 'uploaded' as const
};

updateField('documents.einCertificate', einDocument);
```

### **Construction Plans**
```typescript
const architecturalPlan = {
  name: 'Architectural Plans',
  fileUrl: 'https://storage.googleapis.com/...',
  fileName: 'architectural-plans.pdf',
  fileSize: 2048000,
  mimeType: 'application/pdf',
  uploadedAt: new Date(),
  uploadedBy: user.uid,
  status: 'uploaded' as const
};

updateField('documents.architecturalPlans', architecturalPlan);
```

## 🔄 Progress Tracking

### **Mark Pages Complete**
```typescript
// Mark Page 1 as complete
markPageCompleted(1);

// Mark Page 2 as complete
markPageCompleted(2);

// Check if page is complete
const isPage1Complete = isPageCompleted(1);
```

### **Get Progress**
```typescript
const overallProgress = getOverallProgress(); // Returns 0-100
const documentsStatus = getDocumentsStatus(); // Returns { uploaded: 5, total: 12 }
```

## 💾 Save Operations

### **Save to Database**
```typescript
// Save to Firebase
const handleSaveToFirebase = async () => {
  await saveApplication(async (data) => {
    const docRef = doc(db, 'applications', applicationId);
    await setDoc(docRef, data);
  });
};

// Save to PostgreSQL
const handleSaveToPostgreSQL = async () => {
  await saveApplication(async (data) => {
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  });
};

// Save to any database
const handleSaveToAnyDB = async () => {
  await saveApplication(async (data) => {
    await yourDatabaseService.saveApplication(data);
  });
};
```

## 🎯 Integration with Existing Forms

### **Replace Broken Hook**
```typescript
// OLD (broken)
import { useLoanApplication } from '@/hooks/use-loan-application';
const { updateField } = useLoanApplication(applicationId);

// NEW (working)
import { useGroundUpConstructionForm } from '@/hooks/use-ground-up-construction-form';
const { updateField } = useGroundUpConstructionForm();
```

### **Update Field Paths**
```typescript
// OLD (broken paths)
handleFieldUpdate('propertyInfo.propertyAddress.street', value);

// NEW (working paths)
updateField('propertyInfo.propertyAddress', value);
```

## 🧮 Auto-Calculations

### **Financial Ratios**
```typescript
// These are calculated automatically when you save
const debtToIncomeRatio = application?.calculatedFields.debtToIncomeRatio;
const loanToValueRatio = application?.calculatedFields.loanToValueRatio;
const constructionCostPerSqFt = application?.calculatedFields.constructionCostPerSqFt;
```

## 📱 Real-Time Updates

### **Immediate UI Updates**
```typescript
// Field updates are reflected immediately in the UI
updateField('propertyInfo.propertyAddress', 'New Address');

// The form will show "New Address" instantly
// Then you can save when ready
```

## 🎉 Benefits

- **✅ Captures Every Field** - All 50+ fields from your 12-page form
- **✅ Real-Time Updates** - Form reflects changes immediately
- **✅ Progress Tracking** - Know which pages are complete
- **✅ Document Management** - Handle file uploads with status
- **✅ Type Safety** - Full TypeScript support
- **✅ Easy Integration** - Works with your existing forms
- **✅ Flexible Saving** - Save to any database you want

---

**🎯 This hook gives you everything you need to save all user-entered data while they fill out the Ground Up Construction loan application!**
