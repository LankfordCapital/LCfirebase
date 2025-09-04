# Loan Application Persistence System

## Overview

This system provides comprehensive data persistence for loan applications, allowing users to save all their information as they progress through the multi-page application process. The system automatically saves data in real-time and provides the ability to resume applications exactly where they left off.

## Key Features

- **Real-time Auto-save**: Data is automatically saved as users type (with 2-second debouncing)
- **Comprehensive Data Capture**: All form fields, calculations, and user inputs are saved
- **Progress Tracking**: Automatic calculation of completion percentage across all sections
- **Resume Capability**: Users can return to their applications with all data intact
- **Multi-user Support**: Brokers, borrowers, and workforce members can all access appropriate data
- **Audit Trail**: Complete history of all changes and actions taken on applications

## Architecture

### 1. Enhanced Loan Application Service (`src/lib/enhanced-loan-application-service.ts`)

The core service that handles all database operations:

```typescript
import { enhancedLoanApplicationService } from '@/lib/enhanced-loan-application-service';

// Create new application
const applicationId = await enhancedLoanApplicationService.createLoanApplication(
  userId,
  brokerId,
  loanProgram,
  initialData
);

// Update specific section
await enhancedLoanApplicationService.updateApplicationSection(
  applicationId,
  'borrowerInfo',
  borrowerData
);

// Update specific field
await enhancedLoanApplicationService.updateApplicationField(
  applicationId,
  'borrowerInfo.fullName',
  'John Doe'
);

// Get application data
const application = await enhancedLoanApplicationService.getLoanApplication(applicationId);
```

### 2. React Hooks (`src/hooks/use-loan-application.ts`)

Specialized hooks for different parts of the application:

```typescript
// Main hook for the entire application
const { 
  application, 
  loading, 
  saving, 
  updateSection, 
  updateField, 
  submitApplication 
} = useLoanApplication(applicationId);

// Specialized hooks for specific sections
const { 
  borrowerInfo, 
  updateBorrowerInfo, 
  updateBorrowerField 
} = useBorrowerInfo(applicationId);

const { 
  financialAssets, 
  updateFinancialAssets, 
  updateFinancialField 
} = useFinancialInfo(applicationId);
```

### 3. API Routes (`src/app/api/enhanced-loan-applications/route.ts`)

RESTful API endpoints for all loan application operations:

```typescript
// Create application
POST /api/enhanced-loan-applications
{
  "action": "create",
  "userId": "user123",
  "brokerId": "broker456",
  "loanProgram": "residential-fix-and-flip"
}

// Update section
POST /api/enhanced-loan-applications
{
  "action": "updateSection",
  "applicationId": "app789",
  "section": "borrowerInfo",
  "data": { ... }
}

// Get application
GET /api/enhanced-loan-applications?id=app789
```

## Implementation Guide

### Step 1: Update Your Loan Application Pages

Replace your existing loan application page components with enhanced versions that use the persistence system:

```typescript
// Before (old way)
export function LoanApplicationPage({ loanProgram }: { loanProgram: string }) {
  const [formData, setFormData] = useState({});
  // Data is lost when user navigates away
  
  return (
    <form>
      <input 
        value={formData.field} 
        onChange={(e) => setFormData({...formData, field: e.target.value})}
      />
    </form>
  );
}

// After (new way)
export function LoanApplicationPage({ 
  loanProgram, 
  applicationId 
}: { 
  loanProgram: string;
  applicationId: string;
}) {
  const { application, updateField } = useLoanApplication(applicationId);
  
  return (
    <form>
      <input 
        value={application?.borrowerInfo?.fullName || ''} 
        onChange={(e) => updateField('borrowerInfo.fullName', e.target.value)}
      />
    </form>
  );
}
```

### Step 2: Add Application ID to Your Routes

Ensure your loan application pages receive the `applicationId` prop:

```typescript
// In your page component
export default function LoanApplicationPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string };
  searchParams: { applicationId?: string };
}) {
  return (
    <LoanApplicationPage2Enhanced 
      loanProgram="Residential Fix & Flip"
      applicationId={searchParams.applicationId}
    />
  );
}
```

### Step 3: Handle Application Creation

When starting a new loan application, create it first and then redirect:

```typescript
const handleStartApplication = async () => {
  try {
    const applicationId = await createApplication(
      userId,
      brokerId,
      loanProgram,
      initialData
    );
    
    // Redirect to the first page with the application ID
    router.push(`/loan-application/${loanProgram}/page-1?applicationId=${applicationId}`);
  } catch (error) {
    console.error('Failed to create application:', error);
  }
};
```

### Step 4: Implement Auto-save

The system automatically saves data as users type. For manual save buttons:

```typescript
const handleSave = async () => {
  try {
    await updateSection('borrowerInfo', {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone
    });
    
    toast({
      title: 'Saved',
      description: 'Your progress has been saved.',
    });
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Save Failed',
      description: 'Please try again.',
    });
  }
};
```

## Data Structure

### Application Sections

Each loan application is organized into logical sections:

1. **borrowerInfo**: Personal information, contact details, employment
2. **businessInfo**: Business details, EIN, business address
3. **loanDetails**: Loan amount, purpose, terms, property type
4. **financialAssets**: Checking accounts, investments, real estate, vehicles
5. **financialLiabilities**: Credit cards, loans, mortgages, student debt
6. **incomeInformation**: Employment, business, investment, other income
7. **propertyInfo**: Property address, type, value, taxes, insurance
8. **constructionInfo**: Construction budget, timeline, contractor info
9. **documents**: All uploaded documents and their status

### Progress Tracking

The system automatically tracks completion:

```typescript
progress: {
  borrowerInfoCompleted: true,
  businessInfoCompleted: false,
  loanDetailsCompleted: true,
  financialInfoCompleted: false,
  propertyInfoCompleted: false,
  employmentInfoCompleted: true,
  documentsUploaded: false,
  overallProgress: 43 // Percentage complete
}
```

## Best Practices

### 1. Always Use the Hooks

```typescript
// ✅ Good - Uses the persistence system
const { application, updateField } = useLoanApplication(applicationId);

// ❌ Bad - Local state only, data will be lost
const [formData, setFormData] = useState({});
```

### 2. Handle Loading States

```typescript
const { application, loading, saving } = useLoanApplication(applicationId);

if (loading) {
  return <div>Loading your application...</div>;
}

if (saving) {
  return <div>Saving your progress...</div>;
}
```

### 3. Provide User Feedback

```typescript
const handleFieldUpdate = async (field: string, value: any) => {
  try {
    await updateField(field, value);
    // Field is automatically saved
  } catch (error) {
    toast({
      variant: 'destructive',
      title: 'Save Failed',
      description: 'Please try again.',
    });
  }
};
```

### 4. Validate Before Saving

```typescript
const handleSaveSection = async () => {
  if (!formData.fullName || !formData.email) {
    toast({
      variant: 'destructive',
      title: 'Missing Information',
      description: 'Please fill in all required fields.',
    });
    return;
  }
  
  await updateSection('borrowerInfo', formData);
};
```

## Migration from Existing System

### 1. Update Import Statements

```typescript
// Old
import { loanApplicationService } from '@/lib/firestore-services';

// New
import { enhancedLoanApplicationService } from '@/lib/enhanced-loan-application-service';
```

### 2. Replace Service Calls

```typescript
// Old
await loanApplicationService.update(applicationId, updates);

// New
await enhancedLoanApplicationService.updateApplicationFields(applicationId, updates);
```

### 3. Update Component Props

```typescript
// Old
<LoanApplicationPage loanProgram={loanProgram} />

// New
<LoanApplicationPage 
  loanProgram={loanProgram} 
  applicationId={applicationId} 
/>
```

## Troubleshooting

### Common Issues

1. **Application Not Loading**
   - Check that `applicationId` is being passed correctly
   - Verify Firestore rules allow access to the collection
   - Check browser console for errors

2. **Data Not Saving**
   - Ensure the user is authenticated
   - Check that the field path is correct (e.g., `borrowerInfo.fullName`)
   - Verify the API endpoint is accessible

3. **Performance Issues**
   - The system uses debounced auto-save (2 seconds)
   - Large forms may take time to save all fields
   - Consider using `updateSection` for bulk updates

### Debug Mode

Enable debug logging:

```typescript
// In your component
const { application, updateField } = useLoanApplication(applicationId);

// Add logging
useEffect(() => {
  console.log('Application data:', application);
}, [application]);
```

## Security Considerations

- All data is protected by Firestore security rules
- Users can only access their own applications
- Brokers can access applications they created
- Workforce members can read all applications for underwriting
- Admins have full access to all applications

## Performance Optimization

- Data is cached locally and synced with the database
- Auto-save is debounced to prevent excessive API calls
- Large updates use `updateSection` instead of individual field updates
- Progress calculation is done server-side to reduce client load

## Future Enhancements

- Offline support with local storage fallback
- Real-time collaboration between users
- Advanced progress analytics and reporting
- Integration with document management systems
- Automated validation and error checking

## Support

For questions or issues with the loan application persistence system:

1. Check this README for common solutions
2. Review the Firestore rules and security configuration
3. Check the browser console for error messages
4. Verify API endpoints are accessible and responding
5. Contact the development team for complex issues

