import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Borrower profile API is working!',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET /api/borrower-profile?uid={userId} - Get borrower profile',
      'POST /api/borrower-profile - Update profile data',
      'Available actions: updatePersonalInfo, updateContactInfo, updateCompanyInfo, removeCompany, updateCreditScores, updateAssetInfo, updateDocumentStatus, calculateProfileCompletion, upsertFinancialStatement, upsertDebtSchedule'
    ],
    status: 'Ready for integration'
  });
}
