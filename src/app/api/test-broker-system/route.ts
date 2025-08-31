import { NextRequest, NextResponse } from 'next/server';
import { LoanApplicationApiService } from '@/lib/api-services';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'createInitialApplication':
        const applicationId = await LoanApplicationApiService.createInitialApplication(
          data.brokerId,
          data.loanType,
          data.borrowerInfo,
          data.program
        );
        return NextResponse.json({ 
          success: true, 
          message: 'Initial application created successfully', 
          applicationId: applicationId.data,
          note: 'This application is now linked to the broker but not yet linked to a borrower account'
        });

      case 'linkToBorrower':
        await LoanApplicationApiService.linkToBorrower(data.applicationId, data.borrowerUserId);
        return NextResponse.json({ 
          success: true, 
          message: 'Application linked to borrower successfully',
          note: 'The application is now fully linked to both broker and borrower'
        });

      case 'getBrokerApplications':
        const brokerApps = await LoanApplicationApiService.getApplicationsByBroker(data.brokerId);
        return NextResponse.json({ 
          success: true, 
          message: 'Broker applications retrieved successfully', 
          applications: brokerApps.data,
          count: brokerApps.data?.length || 0
        });

      case 'calculateProgress':
        const progress = await LoanApplicationApiService.calculateProgress(data.applicationId);
        return NextResponse.json({ 
          success: true, 
          message: 'Progress calculated successfully', 
          progress: progress.data,
          note: 'Progress is automatically calculated based on completed sections'
        });

      case 'uploadDocument':
        await LoanApplicationApiService.uploadDocument(
          data.applicationId,
          data.documentType,
          data.documentData
        );
        return NextResponse.json({ 
          success: true, 
          message: 'Document uploaded successfully',
          note: 'Document has been linked to the application and progress recalculated'
        });

      default:
        return NextResponse.json({ error: 'Invalid action specified' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in test broker system endpoint:', error);
    return NextResponse.json({ 
      error: 'Failed to process request', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Broker System Test Endpoint',
    availableActions: [
      'createInitialApplication',
      'linkToBorrower', 
      'getBrokerApplications',
      'calculateProgress',
      'uploadDocument'
    ],
    examples: {
      createInitialApplication: {
        action: 'createInitialApplication',
        brokerId: 'broker-user-123',
        loanType: 'residential',
        borrowerInfo: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phone: '555-1234',
          dateOfBirth: '1990-01-01',
          ssn: '123-45-6789',
          address: {
            street: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            zipCode: '12345'
          },
          employmentStatus: 'employed',
          annualIncome: 75000
        },
        program: 'Conventional 30-Year Fixed'
      },
      uploadDocument: {
        action: 'uploadDocument',
        applicationId: 'application-id-here',
        documentType: 'governmentId',
        documentData: {
          name: 'Drivers License',
          fileUrl: 'https://example.com/drivers-license.pdf',
          fileSize: 1024000,
          mimeType: 'application/pdf',
          uploadedBy: 'broker-user-123'
        }
      }
    }
  });
}
