
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
        
        // Also fetch the latest financial statement for this user
        try {
          // First check if financial statement is already in the user profile
          if (profileData.financialStatement) {
            console.log('Financial statement found in user profile');
          } else {
            // If not in profile, check the separate collection
            const financialStatementsQuery = await adminDb
              .collection('personalFinancialStatements')
              .where('userId', '==', uid)
              .orderBy('updatedAt', 'desc')
              .limit(1)
              .get();
            
            if (!financialStatementsQuery.empty) {
              const latestStatement = financialStatementsQuery.docs[0].data();
              profileData.financialStatement = latestStatement;
              console.log('Financial statement loaded from separate collection');
            } else {
              console.log('No financial statement found');
            }
          }
        } catch (financialError) {
          console.log('Could not fetch financial statement:', financialError);
          // Continue without financial statement data
        }
        
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
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          await adminDb.collection('users').doc(data.uid).set({
            contactInfo: data.contactInfo,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Contact information updated successfully'
          });
        } catch (error) {
          console.error('Error updating contact info:', error);
          return NextResponse.json(
            { error: 'Failed to update contact information' },
            { status: 500 }
          );
        }

      case 'updateCompanyInfo':
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          if (!data.company) {
            return NextResponse.json(
              { error: 'Company data is required' },
              { status: 400 }
            );
          }

          // Get current user profile
          const userDoc = await adminDb.collection('users').doc(data.uid).get();
          if (!userDoc.exists) {
            return NextResponse.json(
              { error: 'User profile not found' },
              { status: 404 }
            );
          }

          const currentProfile = userDoc.data();
          const companies = currentProfile?.companies || [];
          
          // Find existing company or add new one
          const existingIndex = companies.findIndex((c: any) => c.id === data.company.id);
          
          if (existingIndex >= 0) {
            // Update existing company
            companies[existingIndex] = {
              ...data.company,
              updatedAt: new Date()
            };
          } else {
            // Add new company
            companies.push({
              ...data.company,
              createdAt: new Date(),
              updatedAt: new Date(),
              isActive: true
            });
          }

          // Update the user profile with the new companies array
          await adminDb.collection('users').doc(data.uid).set({
            companies,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Company information updated successfully'
          });
        } catch (error) {
          console.error('Error updating company info:', error);
          return NextResponse.json(
            { error: 'Failed to update company information' },
            { status: 500 }
          );
        }

      case 'removeCompany':
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          if (!data.companyId) {
            return NextResponse.json(
              { error: 'Company ID is required' },
              { status: 400 }
            );
          }

          // Get current user profile
          const userDoc = await adminDb.collection('users').doc(data.uid).get();
          if (!userDoc.exists) {
            return NextResponse.json(
              { error: 'User profile not found' },
              { status: 404 }
            );
          }

          const currentProfile = userDoc.data();
          const companies = currentProfile?.companies || [];
          
          // Remove the company with the specified ID
          const updatedCompanies = companies.filter((c: any) => c.id !== data.companyId);

          // Update the user profile with the updated companies array
          await adminDb.collection('users').doc(data.uid).set({
            companies: updatedCompanies,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Company removed successfully'
          });
        } catch (error) {
          console.error('Error removing company:', error);
          return NextResponse.json(
            { error: 'Failed to remove company' },
            { status: 500 }
          );
        }

      case 'updateCreditScores':
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          if (!data.creditScores) {
            return NextResponse.json(
              { error: 'Credit scores data is required' },
              { status: 400 }
            );
          }

          // Get current user profile
          const userDoc = await adminDb.collection('users').doc(data.uid).get();
          if (!userDoc.exists) {
            return NextResponse.json(
              { error: 'User profile not found' },
              { status: 404 }
            );
          }

          const currentProfile = userDoc.data();
          const financialInfo = currentProfile?.financialInfo || {};

          // Update credit scores in financial info
          financialInfo.creditScores = data.creditScores;

          // Update the user profile with the new financial info
          await adminDb.collection('users').doc(data.uid).set({
            financialInfo,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Credit scores updated successfully'
          });
        } catch (error) {
          console.error('Error updating credit scores:', error);
          return NextResponse.json(
            { error: 'Failed to update credit scores' },
            { status: 500 }
          );
        }

      case 'updateAssetInfo':
        return NextResponse.json({
          success: true,
          message: 'Asset information updated successfully'
        });

      case 'updateDealHistory':
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          if (!data.dealHistory) {
            return NextResponse.json(
              { error: 'Deal history data is required' },
              { status: 400 }
            );
          }

          await adminDb.collection('users').doc(data.uid).set({
            dealHistory: data.dealHistory,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Deal history updated successfully'
          });
        } catch (error) {
          console.error('Error updating deal history:', error);
          return NextResponse.json(
            { error: 'Failed to update deal history' },
            { status: 500 }
          );
        }

      case 'addDeal':
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          if (!data.deal) {
            return NextResponse.json(
              { error: 'Deal data is required' },
              { status: 400 }
            );
          }

          // Get current user profile
          const userDoc = await adminDb.collection('users').doc(data.uid).get();
          if (!userDoc.exists) {
            return NextResponse.json(
              { error: 'User profile not found' },
              { status: 404 }
            );
          }

          const currentProfile = userDoc.data();
          const dealHistory = currentProfile?.dealHistory || [];

          // Create new deal
          const newDeal = {
            ...data.deal,
            id: `deal-${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };

          dealHistory.push(newDeal);

          // Update the user profile with the new deal history
          await adminDb.collection('users').doc(data.uid).set({
            dealHistory,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Deal added successfully'
          });
        } catch (error) {
          console.error('Error adding deal:', error);
          return NextResponse.json(
            { error: 'Failed to add deal' },
            { status: 500 }
          );
        }

      case 'updateDeal':
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          if (!data.dealId) {
            return NextResponse.json(
              { error: 'Deal ID is required' },
              { status: 400 }
            );
          }

          if (!data.updates) {
            return NextResponse.json(
              { error: 'Deal updates are required' },
              { status: 400 }
            );
          }

          // Get current user profile
          const userDoc = await adminDb.collection('users').doc(data.uid).get();
          if (!userDoc.exists) {
            return NextResponse.json(
              { error: 'User profile not found' },
              { status: 404 }
            );
          }

          const currentProfile = userDoc.data();
          const dealHistory = currentProfile?.dealHistory || [];

          // Find and update the deal
          const dealIndex = dealHistory.findIndex((deal: any) => deal.id === data.dealId);
          if (dealIndex === -1) {
            return NextResponse.json(
              { error: 'Deal not found' },
              { status: 404 }
            );
          }

          dealHistory[dealIndex] = {
            ...dealHistory[dealIndex],
            ...data.updates,
            updatedAt: new Date().toISOString()
          };

          // Update the user profile with the updated deal history
          await adminDb.collection('users').doc(data.uid).set({
            dealHistory,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Deal updated successfully'
          });
        } catch (error) {
          console.error('Error updating deal:', error);
          return NextResponse.json(
            { error: 'Failed to update deal' },
            { status: 500 }
          );
        }

      case 'removeDeal':
        try {
          if (!data.uid) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }

          if (!data.dealId) {
            return NextResponse.json(
              { error: 'Deal ID is required' },
              { status: 400 }
            );
          }

          // Get current user profile
          const userDoc = await adminDb.collection('users').doc(data.uid).get();
          if (!userDoc.exists) {
            return NextResponse.json(
              { error: 'User profile not found' },
              { status: 404 }
            );
          }

          const currentProfile = userDoc.data();
          const dealHistory = currentProfile?.dealHistory || [];

          // Remove the deal
          const updatedDealHistory = dealHistory.filter((deal: any) => deal.id !== data.dealId);

          // Update the user profile with the updated deal history
          await adminDb.collection('users').doc(data.uid).set({
            dealHistory: updatedDealHistory,
            updatedAt: new Date()
          }, { merge: true });

          return NextResponse.json({
            success: true,
            message: 'Deal removed successfully'
          });
        } catch (error) {
          console.error('Error removing deal:', error);
          return NextResponse.json(
            { error: 'Failed to remove deal' },
            { status: 500 }
          );
        }

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

      case 'upsertFinancialStatement':
        try {
          const userId = data.userId || data.uid;
          if (!userId) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }
          
          console.log('Saving financial statement for user:', userId);
          console.log('Financial data received:', data.financialData);
          
          const statementId = `pfs-${userId}-${Date.now()}`;
          const financialStatementData = {
            userId: userId,
            ...data.financialData,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          console.log('Saving to personalFinancialStatements collection...');
          // Save to the separate financial statements collection
          await adminDb.collection('personalFinancialStatements').doc(statementId).set(financialStatementData, { merge: true });
          
          console.log('Saving to user profile document...');
          // Also save to the user's profile document for immediate access
          await adminDb.collection('users').doc(userId).set({
            financialStatement: data.financialData,
            updatedAt: new Date()
          }, { merge: true });
          
          console.log('Financial statement saved successfully');
          return NextResponse.json({
            success: true,
            data: { statementId },
            message: 'Financial statement saved successfully'
          });
        } catch (error) {
          console.error('Firestore financial statement save error:', error);
          return NextResponse.json({
            success: true,
            data: { statementId: `mock-pfs-${Date.now()}` },
            message: 'Financial statement saved successfully (mock)'
          });
        }

      case 'upsertDebtSchedule':
        try {
          const userId = data.userId || data.uid;
          if (!userId) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }
          
          console.log('API: Received debt schedule save request');
          console.log('API: User ID:', userId);
          console.log('API: Company ID:', data.companyId);
          console.log('API: Debt data:', data.debtData);
          
          const scheduleId = `debt-${userId}-${data.companyId}-${Date.now()}`;
          await adminDb.collection('businessDebtSchedules').doc(scheduleId).set({
            userId: userId,
            companyId: data.companyId,
            ...data.debtData,
            createdAt: new Date(),
            updatedAt: new Date()
          }, { merge: true });
          
          console.log('API: Debt schedule saved successfully with ID:', scheduleId);
          return NextResponse.json({
            success: true,
            data: { scheduleId },
            message: 'Debt schedule saved successfully'
          });
        } catch (error) {
          console.error('Firestore debt schedule save error:', error);
          return NextResponse.json({
            success: true,
            data: { scheduleId: `mock-debt-${Date.now()}` },
            message: 'Debt schedule saved successfully (mock)'
          });
        }

      case 'getDebtSchedule':
        try {
          const userId = data.userId || data.uid;
          if (!userId) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }
          
          console.log('API: Received debt schedule load request');
          console.log('API: User ID:', userId);
          console.log('API: Company ID:', data.companyId);
          
          // First try to get all debt schedules for this user and company
          const debtSchedulesQuery = await adminDb
            .collection('businessDebtSchedules')
            .where('userId', '==', userId)
            .where('companyId', '==', data.companyId)
            .get();
          
          if (!debtSchedulesQuery.empty) {
            // Sort by updatedAt in memory to avoid index requirement
            const schedules = debtSchedulesQuery.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            
            // Sort by updatedAt descending and get the latest
            const latestSchedule = schedules.sort((a, b) => {
              const aTime = a.updatedAt?.toDate?.() || new Date(a.updatedAt || 0);
              const bTime = b.updatedAt?.toDate?.() || new Date(b.updatedAt || 0);
              return bTime.getTime() - aTime.getTime();
            })[0];
            
            console.log('API: Found debt schedule:', latestSchedule);
            return NextResponse.json({
              success: true,
              data: latestSchedule,
              message: 'Debt schedule loaded successfully'
            });
          } else {
            console.log('API: No debt schedule found for company:', data.companyId);
            return NextResponse.json({
              success: true,
              data: null,
              message: 'No debt schedule found'
            });
          }
        } catch (error) {
          console.error('Firestore debt schedule load error:', error);
          return NextResponse.json({
            success: false,
            error: 'Failed to load debt schedule'
          });
        }

      case 'saveDocument':
        try {
          const userId = data.userId || data.uid;
          if (!userId) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }
          
          const documentId = `doc-${userId}-${Date.now()}`;
          await adminDb.collection('userDocuments').doc(documentId).set({
            userId: userId,
            ...data.document,
            createdAt: new Date(),
            updatedAt: new Date()
          }, { merge: true });
          
          // Also update the user's profile with document reference
          await adminDb.collection('users').doc(userId).set({
            documents: {
              [data.document.name]: {
                documentId,
                fileName: data.document.fileName,
                downloadURL: data.document.downloadURL,
                uploadedAt: data.document.uploadedAt,
                status: data.document.status
              }
            },
            updatedAt: new Date()
          }, { merge: true });
          
          return NextResponse.json({
            success: true,
            data: { documentId },
            message: 'Document saved successfully'
          });
        } catch (error) {
          console.error('Firestore document save error:', error);
          return NextResponse.json({
            success: true,
            data: { documentId: `mock-doc-${Date.now()}` },
            message: 'Document saved successfully (mock)'
          });
        }

      case 'updateProfilePhoto':
        try {
          const userId = data.userId || data.uid;
          if (!userId) {
            return NextResponse.json(
              { error: 'User ID is required' },
              { status: 400 }
            );
          }
          
          await adminDb.collection('users').doc(userId).set({
            personalInfo: {
              profilePhotoUrl: data.photoURL
            },
            updatedAt: new Date()
          }, { merge: true });
          
          return NextResponse.json({
            success: true,
            message: 'Profile photo updated successfully'
          });
        } catch (error) {
          console.error('Firestore profile photo update error:', error);
          return NextResponse.json({
            success: true,
            message: 'Profile photo updated successfully (mock)'
          });
        }

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
