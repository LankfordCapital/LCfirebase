# Auto-Save Implementation Guide for Loan Application Pages

## 🎯 Overview
This guide shows you how to implement the auto-save functionality across all your loan application pages (Page 1-12).

## ✅ What's Already Working
- **Page 2** - Fully implemented with auto-save ✅
- **API endpoints** - Working correctly ✅
- **Database structure** - Saving data properly ✅
- **Progress tracking** - Calculating completion ✅

## 🔧 Implementation Pattern for Each Page

### Step 1: Import Required Hooks
```typescript
import { useLoanApplication } from '@/hooks/use-loan-application';
```

### Step 2: Add Hook to Component
```typescript
export function LoanApplicationClientPageX({ 
  loanProgram, 
  officeContext = 'borrower',
  applicationId 
}: { 
  loanProgram: string, 
  officeContext?: 'borrower' | 'broker' | 'workforce',
  applicationId?: string 
}) {
  // Use the loan application hook for auto-save functionality
  const { 
    application, 
    loading, 
    saving, 
    updateField, 
    updateFields 
  } = useLoanApplication(applicationId);
  
  // ... rest of component
}
```

### Step 3: Add Auto-Save to Form Fields
```typescript
// For text inputs
<Input 
  value={fieldValue} 
  onChange={(e) => {
    setFieldValue(e.target.value);
    // Auto-save to database
    if (applicationId) {
      updateField('fieldPath.in.database', e.target.value);
    }
  }} 
/>

// For number inputs
<Input 
  type="number"
  value={fieldValue} 
  onChange={(e) => {
    setFieldValue(e.target.value);
    // Auto-save to database
    if (applicationId) {
      updateField('fieldPath.in.database', parseFloat(e.target.value) || 0);
    }
  }} 
/>

// For selects
<Select 
  onValueChange={(value) => {
    setFieldValue(value);
    // Auto-save to database
    if (applicationId) {
      updateField('fieldPath.in.database', value);
    }
  }} 
  value={fieldValue}
>
```

### Step 4: Add Navigation Save Function
```typescript
const handleNextPage = async () => {
  if (applicationId) {
    try {
      // Save all form data to database immediately before navigation
      await updateFields({
        'field1.path': field1Value,
        'field2.path': field2Value,
        'field3.path': field3Value,
        // ... all other fields
      }, true); // Set immediate flag to true for immediate saving

      console.log('Data saved successfully');
    } catch (error) {
      console.error('Error saving data:', error);
      return; // Don't navigate if save fails
    }
  }

  // Navigate to next page
  const programSlug = loanProgram.toLowerCase().replace(/ /g, '-').replace(/&/g, 'and');
  const currentOfficeContext = getOfficeContextFromUrl();
  const basePath = getOfficeBasePath(currentOfficeContext);
  
  router.push(`${basePath}/${programSlug}/page-X`);
};
```

### Step 5: Add Loading and Save States
```typescript
{/* Loading State */}
{applicationId && loading && (
  <Card className="bg-muted/50">
    <CardContent className="pt-6">
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
        <span>Loading your application...</span>
      </div>
    </CardContent>
  </Card>
)}

{/* Save Status Indicator */}
{applicationId && saving && (
  <Card className="bg-blue-50 border-blue-200">
    <CardContent className="pt-6">
      <div className="flex items-center justify-center py-2">
        <Loader2 className="h-4 w-4 animate-spin mr-2 text-blue-600" />
        <span className="text-blue-700 text-sm">Saving your progress...</span>
      </div>
    </CardContent>
  </Card>
)}
```

## 📋 Page-by-Page Implementation Checklist

### Page 1 (Main Application) ✅
- [x] Auto-save on field changes
- [x] Save all data before navigation
- [x] Loading and save states

### Page 2 (Financial Information) ✅
- [x] Auto-save on field changes
- [x] Save all data before navigation
- [x] Loading and save states

### Page 3 (Unit Mix & Rents) ✅
- [x] Auto-save on field changes
- [x] Save all data before navigation
- [x] Loading and save states

### Page 4-12 (Remaining Pages)
- [ ] Import required hooks
- [ ] Add useLoanApplication hook
- [ ] Add auto-save to form fields
- [ ] Add navigation save function
- [ ] Add loading and save states
- [ ] Test auto-save functionality

## 🚀 Quick Implementation Script

For each page, follow this pattern:

1. **Add imports** at the top
2. **Add hook** in component
3. **Update form fields** to call `updateField`
4. **Add navigation save** to `handleNextPage`
5. **Add loading states** for better UX

## 🧪 Testing Your Implementation

1. **Create a new application** using the test page
2. **Navigate to your page** with the application ID
3. **Fill out form fields** - data should auto-save
4. **Click "Continue"** - all data should save immediately
5. **Return to the page** - data should load automatically

## 🔍 Common Issues and Solutions

### Issue: Fields not saving
**Solution**: Make sure `applicationId` is passed correctly and `updateField` is called

### Issue: Navigation not working
**Solution**: Check that `handleNextPage` is async and calls `updateFields` with immediate flag

### Issue: Data not loading
**Solution**: Verify the `useEffect` loads data when `application` changes

## 📞 Need Help?

If you encounter issues implementing auto-save on any specific page, the pattern is:
1. **Auto-save on field changes** using `updateField`
2. **Save all data before navigation** using `updateFields(..., true)`
3. **Show loading states** for better user experience

The system is already working on Pages 1-3, so use those as your reference implementation!
