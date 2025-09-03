import { NextRequest, NextResponse } from 'next/server';
import { LoanApplicationApiService } from '@/lib/api-services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') || undefined;
    const program = searchParams.get('program') || undefined;
    const brokerId = searchParams.get('brokerId') || undefined;
    const userId = searchParams.get('userId') || undefined;

    const result = await LoanApplicationApiService.getAllApplications(
      page,
      limit,
      status as any,
      program,
      brokerId,
      userId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error getting loan applications:', error);
    return NextResponse.json(
      { error: 'Failed to get loan applications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'create':
        if (!data.userId || !data.program) {
          return NextResponse.json(
            { error: 'Missing required fields: userId, program' },
            { status: 400 }
          );
        }
        // Create a basic loan application structure
        const applicationData = {
          userId: data.userId,
          brokerId: data.brokerId || 'default-broker', // TODO: Get from auth context
          loanType: 'residential' as const, // Default type
          program: data.program,
          status: 'draft' as const,
          borrowerInfo: {
            fullName: '',
            email: '',
            phone: '',
            dateOfBirth: '',
            ssn: '',
            maritalStatus: 'single' as const,
            dependents: 0,
            currentAddress: {
              street: '',
              city: '',
              state: '',
              zipCode: '',
              yearsAtAddress: 0,
              rentOrOwn: 'rent' as const
            },
            previousAddresses: [],
            employmentStatus: 'employed' as const,
            annualIncome: 0,
            citizenship: 'us_citizen' as const
          },
          loanDetails: {
            loanAmount: 0,
            loanPurpose: '',
            term: 0,
            propertyType: '',
            downPayment: 0,
            downPaymentPercentage: 0
          },
          documents: {
            additionalDocuments: []
          },
          progress: {
            borrowerInfoCompleted: false,
            businessInfoCompleted: false,
            loanDetailsCompleted: false,
            financialInfoCompleted: false,
            propertyInfoCompleted: false,
            employmentInfoCompleted: false,
            documentsUploaded: false,
            overallProgress: 0,
            sectionsCompleted: 0,
            totalSections: 6,
            documentsRequired: 0,
            documentsApproved: 0,
            documentsRejected: 0,
            applicationStarted: new Date(),
            lastUpdated: new Date()
          },
          history: [],
          notes: {
            noteHistory: []
          }
        };
        const result = await LoanApplicationApiService.createApplication(applicationData);
        return NextResponse.json(result);

      case 'submit':
        if (!data.applicationId) {
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }
        const submitResult = await LoanApplicationApiService.submitApplication(data.applicationId);
        return NextResponse.json(submitResult);

      case 'assign':
        if (!data.applicationId || !data.workforceMemberId) {
          return NextResponse.json(
            { error: 'Missing required fields: applicationId, workforceMemberId' },
            { status: 400 }
          );
        }
        await LoanApplicationApiService.assignApplication(data.applicationId, data.workforceMemberId);
        return NextResponse.json({ success: true, message: 'Application assigned successfully' });

      case 'createInitial':
        if (!data.brokerId || !data.borrowerInfo || !data.program) {
          return NextResponse.json(
            { error: 'Missing required fields: brokerId, borrowerInfo, program' },
            { status: 400 }
          );
        }
        const initialAppId = await LoanApplicationApiService.createInitialApplication(
          data.brokerId,
          data.loanType || 'residential',
          data.borrowerInfo,
          data.program
        );
        return NextResponse.json(initialAppId);

      case 'linkToBorrower':
        if (!data.applicationId || !data.borrowerUserId) {
          return NextResponse.json(
            { error: 'Missing required fields: applicationId, borrowerUserId' },
            { status: 400 }
          );
        }
        await LoanApplicationApiService.linkToBorrower(data.applicationId, data.borrowerUserId);
        return NextResponse.json({ success: true, message: 'Application linked to borrower successfully' });

      case 'calculateProgress':
        if (!data.applicationId) {
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }
        const progress = await LoanApplicationApiService.calculateProgress(data.applicationId);
        return NextResponse.json(progress);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in loan applications endpoint:', error);
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
