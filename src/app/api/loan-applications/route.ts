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
        const applicationId = await LoanApplicationApiService.createApplication(data);
        return NextResponse.json(applicationId);

      case 'submit':
        if (!data.applicationId) {
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }
        await LoanApplicationApiService.submitApplication(data.applicationId);
        return NextResponse.json({ success: true, message: 'Application submitted successfully' });

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
