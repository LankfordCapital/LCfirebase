# Borrower Profile Backend Implementation

## Overview

This document describes the complete backend implementation for managing borrower profiles in the Lankford Lending application. The system handles personal information, company details, financial data, document tracking, and profile completion calculations.

## Architecture

The borrower profile backend follows a layered architecture:

1. **Data Layer** - Enhanced Firestore services with borrower-specific interfaces
2. **API Layer** - Next.js API routes for all profile operations
3. **Hook Layer** - React hooks for easy frontend integration
4. **UI Components** - Profile completion indicators and status displays

## Data Models

### BorrowerProfile Interface

```typescript
interface BorrowerProfile extends FirestoreUser {
  // Personal Information
  personalInfo?: {
    firstName: string;
    lastName: string;
    ssn: string;
    dateOfBirth: string;
    profilePhotoUrl?: string;
  };
  
  // Contact Information
  contactInfo?: {
    phone: string;
    address?: Address;
  };
  
  // Company Information
  companies?: CompanyProfile[];
  
  // Financial Information
  financialInfo?: {
    creditScores?: CreditScores;
    personalAssets?: AssetInfo;
    companyAssets?: Record<string, AssetInfo>;
    personalFinancialStatement?: FinancialStatementStatus;
    businessDebtSchedule?: Record<string, DebtScheduleStatus>;
  };
  
  // Document Tracking
  requiredDocuments?: {
    personal: PersonalDocumentStatus;
    business: Record<string, BusinessDocumentStatus>;
  };
  
  // Profile Completion
  profileCompletion?: ProfileCompletion;
}
```

### CompanyProfile Interface

```typescript
interface CompanyProfile {
  id: string;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEin: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  isActive: boolean;
  documents?: string[];
}
```

### PersonalFinancialStatement Interface

```typescript
interface PersonalFinancialStatement {
  id?: string;
  userId: string;
  completed: boolean;
  lastUpdated: Timestamp;
  
  assets: {
    cashAndEquivalents: number;
    accountsReceivable: number;
    inventory: number;
    realEstate: number;
    vehicles: number;
    investments: number;
    otherAssets: number;
    totalAssets: number;
  };
  
  liabilities: {
    accountsPayable: number;
    creditCards: number;
    autoLoans: number;
    mortgages: number;
    studentLoans: number;
    otherLiabilities: number;
    totalLiabilities: number;
  };
  
  income: {
    salary: number;
    businessIncome: number;
    investmentIncome: number;
    rentalIncome: number;
    otherIncome: number;
    totalIncome: number;
  };
  
  expenses: {
    housing: number;
    utilities: number;
    food: number;
    transportation: number;
    insurance: number;
    healthcare: number;
    entertainment: number;
    otherExpenses: number;
    totalExpenses: number;
  };
  
  netWorth: number;
  monthlyCashFlow: number;
}
```

## API Endpoints

### GET /api/borrower-profile

Retrieve borrower profile by user ID.

**Query Parameters:**
- `uid` (string, required): User ID

**Response:**
```json
{
  "success": true,
  "data": {
    "uid": "user-id",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "borrower",
    "personalInfo": { ... },
    "contactInfo": { ... },
    "companies": [ ... ],
    "financialInfo": { ... },
    "requiredDocuments": { ... },
    "profileCompletion": { ... }
  }
}
```

### POST /api/borrower-profile

Perform various profile operations based on the `action` field.

**Available Actions:**

#### updatePersonalInfo
```json
{
  "action": "updatePersonalInfo",
  "uid": "user-id",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "ssn": "123-45-6789",
    "dateOfBirth": "1990-01-01"
  }
}
```

#### updateContactInfo
```json
{
  "action": "updateContactInfo",
  "uid": "user-id",
  "contactInfo": {
    "phone": "+1-555-123-4567",
    "address": {
      "street": "123 Main St",
      "city": "Austin",
      "state": "TX",
      "zipCode": "78701"
    }
  }
}
```

#### updateCompanyInfo
```json
{
  "action": "updateCompanyInfo",
  "uid": "user-id",
  "company": {
    "id": "company-id",
    "companyName": "Acme Inc",
    "companyAddress": "456 Business Ave",
    "companyPhone": "+1-555-987-6543",
    "companyEin": "12-3456789"
  }
}
```

#### removeCompany
```json
{
  "action": "removeCompany",
  "uid": "user-id",
  "companyId": "company-id"
}
```

#### updateCreditScores
```json
{
  "action": "updateCreditScores",
  "uid": "user-id",
  "creditScores": {
    "equifax": 750,
    "experian": 745,
    "transunion": 760
  }
}
```

#### updateAssetInfo
```json
{
  "action": "updateAssetInfo",
  "uid": "user-id",
  "assetType": "personal",
  "assetData": {
    "balance": 50000,
    "lastStatementDate": "2024-01-15"
  }
}
```

#### updateDocumentStatus
```json
{
  "action": "updateDocumentStatus",
  "uid": "user-id",
  "documentType": "idDriversLicense",
  "status": true
}
```

#### calculateProfileCompletion
```json
{
  "action": "calculateProfileCompletion",
  "uid": "user-id"
}
```

#### upsertFinancialStatement
```json
{
  "action": "upsertFinancialStatement",
  "userId": "user-id",
  "financialData": {
    "assets": { ... },
    "liabilities": { ... },
    "income": { ... },
    "expenses": { ... }
  }
}
```

#### upsertDebtSchedule
```json
{
  "action": "upsertDebtSchedule",
  "userId": "user-id",
  "companyId": "company-id",
  "debtData": {
    "debts": [ ... ],
    "totalDebt": 100000,
    "totalMonthlyPayments": 2500
  }
}
```

## React Hook Usage

### useBorrowerProfile Hook

The `useBorrowerProfile` hook provides easy access to all borrower profile operations.

```typescript
import { useBorrowerProfile } from '@/hooks/use-borrower-profile';

function BorrowerProfilePage() {
  const {
    profile,
    loading,
    error,
    profileCompletion,
    updatePersonalInfo,
    updateContactInfo,
    updateCompanyInfo,
    removeCompany,
    updateCreditScores,
    updateAssetInfo,
    updateDocumentStatus,
    saveFinancialStatement,
    saveDebtSchedule,
    hasProfile,
    isComplete
  } = useBorrowerProfile();

  // Example: Update personal information
  const handlePersonalInfoUpdate = async (data: any) => {
    await updatePersonalInfo({
      firstName: data.firstName,
      lastName: data.lastName,
      ssn: data.ssn,
      dateOfBirth: data.dateOfBirth
    });
  };

  // Example: Add company
  const handleAddCompany = async (companyData: any) => {
    const companyId = `company-${Date.now()}`;
    await updateCompanyInfo({
      id: companyId,
      companyName: companyData.name,
      companyAddress: companyData.address,
      companyPhone: companyData.phone,
      companyEin: companyData.ein,
      isActive: true
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Borrower Profile</h1>
      
      {/* Profile Completion Indicator */}
      <ProfileCompletionIndicator completion={profileCompletion} />
      
      {/* Personal Information Form */}
      <PersonalInfoForm 
        data={profile?.personalInfo}
        onSubmit={handlePersonalInfoUpdate}
      />
      
      {/* Company Information */}
      {profile?.companies?.map(company => (
        <CompanyCard 
          key={company.id}
          company={company}
          onUpdate={(data) => updateCompanyInfo({ ...company, ...data })}
          onRemove={() => removeCompany(company.id)}
        />
      ))}
      
      {/* Add Company Button */}
      <button onClick={() => handleAddCompany({})}>
        Add Company
      </button>
    </div>
  );
}
```

## Profile Completion Calculation

The system automatically calculates profile completion percentages for different sections:

### Personal Information (25%)
- First Name
- Last Name
- SSN
- Date of Birth

### Contact Information (15%)
- Phone Number
- Address (optional)

### Company Information (20%)
- Company Name
- Company Address
- Company Phone
- Company EIN

### Required Documents (25%)
- Personal Documents
- Business Documents (per company)

### Financial Information (15%)
- Credit Scores
- Personal Assets
- Company Assets

### Overall Completion
The overall completion is the average of all section percentages.

## Document Tracking

The system tracks the status of required documents:

### Personal Documents
- ID/Driver's License
- Credit Report
- Personal Asset Statement
- Personal Financial Statement

### Business Documents (per company)
- EIN Certificate
- Formation Documentation
- Operating Agreement/Bylaws
- Partnership/Officer List
- Business License
- Certificate of Good Standing
- Company Asset Statement
- Business Debt Schedule

## Error Handling

All API endpoints include comprehensive error handling:

- **Validation Errors**: Missing required fields
- **Authentication Errors**: Unauthorized access
- **Database Errors**: Firestore operation failures
- **Network Errors**: Request/response failures

Errors are returned in a consistent format:

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Performance Considerations

- **Real-time Updates**: Profile completion is recalculated after each update
- **Optimistic Updates**: Local state is updated immediately for better UX
- **Batch Operations**: Multiple updates can be batched for efficiency
- **Caching**: Profile data is cached in local state to reduce API calls

## Security

- **Authentication Required**: All endpoints require valid user authentication
- **User Isolation**: Users can only access their own profile data
- **Input Validation**: All input data is validated before processing
- **Role-based Access**: Only borrowers can access borrower profile endpoints

## Best Practices

1. **Always check loading states** before rendering forms
2. **Handle errors gracefully** with user-friendly messages
3. **Use the hook methods** instead of direct API calls
4. **Update local state** after successful operations
5. **Recalculate completion** after significant changes
6. **Validate data** before sending to the backend

## Example Integration

Here's a complete example of integrating the borrower profile system:

```typescript
import { useBorrowerProfile } from '@/hooks/use-borrower-profile';
import { ProfileCompletionIndicator } from '@/components/profile-completion-indicator';

function CompleteBorrowerProfile() {
  const {
    profile,
    loading,
    profileCompletion,
    updatePersonalInfo,
    updateCompanyInfo,
    updateDocumentStatus
  } = useBorrowerProfile();

  const handleSubmit = async (formData: any) => {
    // Update personal information
    await updatePersonalInfo({
      firstName: formData.firstName,
      lastName: formData.lastName,
      ssn: formData.ssn,
      dateOfBirth: formData.dateOfBirth
    });

    // Update company information
    await updateCompanyInfo({
      id: 'company-1',
      companyName: formData.companyName,
      companyAddress: formData.companyAddress,
      companyPhone: formData.companyPhone,
      companyEin: formData.companyEin,
      isActive: true
    });

    // Mark documents as uploaded
    await updateDocumentStatus('idDriversLicense', true);
    await updateDocumentStatus('einCertificate', true, 'company-1');
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <ProfileCompletionIndicator completion={profileCompletion} />
      
      <form onSubmit={handleSubmit}>
        {/* Form fields */}
        <button type="submit">Save Profile</button>
      </form>
      
      {profileCompletion?.overall === 100 && (
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="text-green-800 font-semibold">
            Profile Complete!
          </h3>
          <p className="text-green-600">
            You can now submit your loan application.
          </p>
        </div>
      )}
    </div>
  );
}
```

## Conclusion

The borrower profile backend provides a comprehensive, secure, and user-friendly system for managing all aspects of borrower information. The layered architecture ensures maintainability, while the React hooks provide easy integration with the frontend. The automatic completion tracking helps users understand their progress and ensures all required information is collected before loan applications can be submitted.
