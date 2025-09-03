import { NextRequest, NextResponse } from 'next/server';
import { enhancedLoanApplicationServiceAdmin } from '@/lib/enhanced-loan-application-service-admin';

export async function GET(request: NextRequest) {
  try {
    console.log('GET request to enhanced-loan-applications API');
    
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');
    const userId = searchParams.get('userId');
    const brokerId = searchParams.get('brokerId');
    const action = searchParams.get('action');

    console.log('Request parameters:', { applicationId, userId, brokerId, action });

    if (action === 'getByUser' && userId) {
      console.log('Getting applications by user:', userId);
      const applications = await enhancedLoanApplicationServiceAdmin.getLoanApplicationsByUser(userId);
      console.log(`Found ${applications.length} applications for user`);
      return NextResponse.json({ success: true, data: applications });
    }

    if (action === 'getByBroker' && brokerId) {
      console.log('Getting applications by broker:', brokerId);
      const applications = await enhancedLoanApplicationServiceAdmin.getLoanApplicationsByBroker(brokerId);
      console.log(`Found ${applications.length} applications for broker`);
      return NextResponse.json({ success: true, data: applications });
    }

    if (applicationId) {
      console.log('Getting application by ID:', applicationId);
      const application = await enhancedLoanApplicationServiceAdmin.getLoanApplication(applicationId);
      if (!application) {
        console.log('Application not found');
        return NextResponse.json(
          { error: 'Application not found' },
          { status: 404 }
        );
      }
      console.log('Application retrieved successfully');
      return NextResponse.json({ success: true, data: application });
    }

    console.log('Missing required parameters');
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in GET enhanced loan applications endpoint:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to get loan application', 
        details: errorMessage,
        stack: errorStack 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST request to enhanced-loan-applications API');
    
    const body = await request.json();
    const { action, ...data } = body;

    console.log('Request body:', { action, data });

    switch (action) {
      case 'create':
        if (!data.userId || !data.brokerId || !data.loanProgram) {
          console.log('Missing required fields for create action');
          return NextResponse.json(
            { error: 'Missing required fields: userId, brokerId, loanProgram' },
            { status: 400 }
          );
        }

        console.log('Creating new loan application');
        const applicationId = await enhancedLoanApplicationServiceAdmin.createLoanApplication(
          data.userId,
          data.brokerId,
          data.loanProgram,
          data.initialData || {}
        );

        console.log('Loan application created successfully with ID:', applicationId);
        return NextResponse.json({
          success: true,
          data: { applicationId },
          message: 'Loan application created successfully'
        });

      case 'updateSection':
        if (!data.applicationId || !data.section || !data.data) {
          console.log('Missing required fields for updateSection action');
          return NextResponse.json(
            { error: 'Missing required fields: applicationId, section, data' },
            { status: 400 }
          );
        }

        console.log('Updating application section');
        await enhancedLoanApplicationServiceAdmin.updateApplicationSection(
          data.applicationId,
          data.section,
          data.data
        );

        console.log('Application section updated successfully');
        return NextResponse.json({
          success: true,
          message: 'Application section updated successfully'
        });

      case 'updateField':
        if (!data.applicationId || !data.fieldPath || data.value === undefined) {
          console.log('Missing required fields for updateField action');
          return NextResponse.json(
            { error: 'Missing required fields: applicationId, fieldPath, value' },
            { status: 400 }
          );
        }

        console.log('Updating application field');
        await enhancedLoanApplicationServiceAdmin.updateApplicationField(
          data.applicationId,
          data.fieldPath,
          data.value
        );

        console.log('Application field updated successfully');
        return NextResponse.json({
          success: true,
          message: 'Application field updated successfully'
        });

      case 'updateFields':
        if (!data.applicationId || !data.updates) {
          console.log('Missing required fields for updateFields action');
          return NextResponse.json(
            { error: 'Missing required fields: applicationId, updates' },
            { status: 400 }
          );
        }

        console.log('Updating multiple application fields');
        await enhancedLoanApplicationServiceAdmin.updateApplicationFields(
          data.applicationId,
          data.updates
        );

        console.log('Application fields updated successfully');
        return NextResponse.json({
          success: true,
          message: 'Application fields updated successfully'
        });

      case 'submit':
        if (!data.applicationId) {
          console.log('Missing required field for submit action');
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }

        console.log('Submitting application');
        await enhancedLoanApplicationServiceAdmin.submitApplication(data.applicationId);

        console.log('Application submitted successfully');
        return NextResponse.json({
          success: true,
          message: 'Application submitted successfully'
        });

      case 'assign':
        if (!data.applicationId || !data.workforceMemberId) {
          console.log('Missing required fields for assign action');
          return NextResponse.json(
            { error: 'Missing required fields: applicationId, workforceMemberId' },
            { status: 400 }
          );
        }

        console.log('Assigning application');
        await enhancedLoanApplicationServiceAdmin.assignApplication(
          data.applicationId,
          data.workforceMemberId
        );

        console.log('Application assigned successfully');
        return NextResponse.json({
          success: true,
          message: 'Application assigned successfully'
        });

      case 'calculateProgress':
        if (!data.applicationId) {
          console.log('Missing required field for calculateProgress action');
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }

        console.log('Calculating application progress');
        const progress = await enhancedLoanApplicationServiceAdmin.calculateProgress(data.applicationId);

        console.log('Progress calculated successfully');
        return NextResponse.json({
          success: true,
          data: progress,
          message: 'Progress calculated successfully'
        });

      case 'addHistoryEntry':
        if (!data.applicationId || !data.action || !data.description || !data.performedBy) {
          console.log('Missing required fields for addHistoryEntry action');
          return NextResponse.json(
            { error: 'Missing required fields: applicationId, action, description, performedBy' },
            { status: 400 }
          );
        }

        console.log('Adding history entry');
        await enhancedLoanApplicationServiceAdmin.addHistoryEntry(
          data.applicationId,
          data.action,
          data.description,
          data.performedBy,
          data.details
        );

        console.log('History entry added successfully');
        return NextResponse.json({
          success: true,
          message: 'History entry added successfully'
        });

      case 'delete':
        if (!data.applicationId) {
          console.log('Missing required field for delete action');
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }

        console.log('Deleting application');
        await enhancedLoanApplicationServiceAdmin.deleteApplication(data.applicationId);

        console.log('Application deleted successfully');
        return NextResponse.json({
          success: true,
          message: 'Application deleted successfully'
        });

      case 'restore':
        if (!data.applicationId) {
          console.log('Missing required field for restore action');
          return NextResponse.json(
            { error: 'Missing required field: applicationId' },
            { status: 400 }
          );
        }

        console.log('Restoring application');
        await enhancedLoanApplicationServiceAdmin.restoreApplication(data.applicationId);

        console.log('Application restored successfully');
        return NextResponse.json({
          success: true,
          message: 'Application restored successfully'
        });

      default:
        console.log('Invalid action specified:', action);
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in POST enhanced loan applications endpoint:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to process request', 
        details: errorMessage,
        stack: errorStack 
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('PUT request to enhanced-loan-applications API');
    
    const body = await request.json();
    const { applicationId, updates } = body;

    if (!applicationId || !updates) {
      console.log('Missing required fields for PUT request');
      return NextResponse.json(
        { error: 'Missing required fields: applicationId, updates' },
        { status: 400 }
      );
    }

    console.log('Updating application fields via PUT');
            await enhancedLoanApplicationServiceAdmin.updateApplicationFields(applicationId, updates);

    console.log('Application updated successfully via PUT');
    return NextResponse.json({
      success: true,
      message: 'Application updated successfully'
    });
  } catch (error) {
    console.error('Error in PUT enhanced loan applications endpoint:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to update application', 
        details: errorMessage,
        stack: errorStack 
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE request to enhanced-loan-applications API');
    
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get('id');

    if (!applicationId) {
      console.log('Missing required parameter for DELETE request');
      return NextResponse.json(
        { error: 'Missing required parameter: id' },
        { status: 400 }
      );
    }

    console.log('Deleting application');
            await enhancedLoanApplicationServiceAdmin.deleteApplication(applicationId);

    console.log('Application deleted successfully');
    return NextResponse.json({
      success: true,
      message: 'Application deleted successfully'
    });
  } catch (error) {
    console.error('Error in DELETE enhanced loan applications endpoint:', error);
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Failed to delete application', 
        details: errorMessage,
        stack: errorStack 
      },
      { status: 500 }
    );
  }
}
