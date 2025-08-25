import { NextRequest, NextResponse } from 'next/server';
import { LoanApplicationApiService } from '@/lib/api-services';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status') as any;
    const program = searchParams.get('program') || undefined;
    const userId = searchParams.get('userId') || undefined;
    const assignedTo = searchParams.get('assignedTo') || undefined;

    const result = await LoanApplicationApiService.getAllApplications(page, limit, {
      status,
      program,
      userId,
      assignedTo
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in loan applications API route:', error);
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

    switch (action) {
      case 'create':
        if (!data.userId || !data.program) {
          return NextResponse.json(
            { error: 'Missing required fields: userId and program' },
            { status: 400 }
          );
        }
        
        const createResult = await LoanApplicationApiService.createApplication(data);
        if (!createResult.success) {
          return NextResponse.json(
            { error: createResult.error },
            { status: 400 }
          );
        }
        
        return NextResponse.json(createResult);

      case 'submit':
        if (!data.applicationId) {
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }
        
        const submitResult = await LoanApplicationApiService.submitApplication(data.applicationId);
        if (!submitResult.success) {
          return NextResponse.json(
            { error: submitResult.error },
            { status: 400 }
          );
        }
        
        return NextResponse.json(submitResult);

      case 'assign':
        if (!data.applicationId || !data.workforceMemberId) {
          return NextResponse.json(
            { error: 'Missing required fields: applicationId and workforceMemberId' },
            { status: 400 }
          );
        }
        
        const assignResult = await LoanApplicationApiService.assignApplication(
          data.applicationId, 
          data.workforceMemberId
        );
        if (!assignResult.success) {
          return NextResponse.json(
            { error: assignResult.error },
            { status: 400 }
          );
        }
        
        return NextResponse.json(assignResult);

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in loan applications POST API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
