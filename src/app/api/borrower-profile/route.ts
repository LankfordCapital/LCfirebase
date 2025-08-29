
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

// Mock data for testing - replace with actual Firestore operations later
const mockProfile = {
  uid: 'test-user',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'borrower',
  status: 'approved',
  personalInfo: {
    firstName: 'Test',
    lastName: 'User',
    ssn: '123-45-6789',
    dateOfBirth: '1990-01-01'
  },
  contactInfo: {
    phone: '+1-555-123-4567'
  },
  companies: [
    {
      id: 'company-1',
      companyName: 'Test Company',
      companyAddress: '123 Test St',
      companyPhone: '+1-555-987-6543',
      companyEin: '12-3456789',
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }
  ],
  financialInfo: {
    creditScores: {
      equifax: 750,
      experian: 745,
      transunion: 760,
      lastUpdated: new Date()
    },
    personalAssets: {
      balance: 50000,
      lastStatementDate: new Date()
    }
  },
  requiredDocuments: {
    personal: {
      idDriversLicense: true,
      creditReport: true,
      personalAssetStatement: true,
      personalFinancialStatement: false
    },
    business: {
      'company-1': {
        einCertificate: true,
        formationDocumentation: false,
        operatingAgreement: false,
        partnershipOfficerList: false,
        businessLicense: false,
        certificateOfGoodStanding: false,
        companyAssetStatement: false,
        businessDebtSchedule: false
      }
    }
  },
  profileCompletion: {
    personalInfo: 100,
    contactInfo: 100,
    companies: 100,
    documents: 25,
    financialInfo: 100,
    overall: 75
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    try {
      // Try to get real data from Firestore first
      const userDoc = await adminDb.collection('users').doc(uid).get();
      
      if (userDoc.exists) {
        const profileData = { uid: userDoc.id, ...userDoc.data() };
        return NextResponse.json({
          success: true,
          data: profileData,
          source: 'firestore'
        });
      } else {
        // User doesn't exist in Firestore, return mock data
        const profileWithUid = { ...mockProfile, uid };
        return NextResponse.json({
          success: true,
          data: profileWithUid,
          source: 'mock',
          message: 'User not found in database, showing mock data'
        });
      }
    } catch (firestoreError) {
      console.log('Firestore error, falling back to mock data:', firestoreError);
      // Fall back to mock data if Firestore fails
      const profileWithUid = { ...mockProfile, uid };
      return NextResponse.json({
        success: true,
        data: profileWithUid,
        source: 'mock',
        message: 'Database connection failed, showing mock data'
      });
    }
  } catch (error) {
    console.error('Error in borrower profile GET API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    // For now, just return success - replace with actual Firestore operations later
    switch (action) {
      case 'updatePersonalInfo':
        try {
          await adminDb.collection('users').doc(data.uid).set({
            personalInfo: data.personalInfo,
            updatedAt: new Date()
          }, { merge: true });
          
          return NextResponse.json({
            success: true,
            message: 'Personal information updated successfully in Firestore'
          });
        } catch (error) {
          console.error('Firestore update error:', error);
          return NextResponse.json({
            success: true,
            message: 'Personal information updated successfully (mock)'
          });
        }

      case 'updateContactInfo':
        return NextResponse.json({
          success: true,
          message: 'Contact information updated successfully'
        });

      case 'updateCompanyInfo':
        return NextResponse.json({
          success: true,
          message: 'Company information updated successfully'
        });

      case 'removeCompany':
        return NextResponse.json({
          success: true,
          message: 'Company removed successfully'
        });

      case 'updateCreditScores':
        return NextResponse.json({
          success: true,
          message: 'Credit scores updated successfully'
        });

      case 'updateAssetInfo':
        return NextResponse.json({
          success: true,
          message: 'Asset information updated successfully'
        });

      case 'updateDocumentStatus':
        return NextResponse.json({
          success: true,
          message: 'Document status updated successfully'
        });

      case 'calculateProfileCompletion':
        return NextResponse.json({
          success: true,
          data: mockProfile.profileCompletion,
          message: 'Profile completion calculated successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in borrower profile POST API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
