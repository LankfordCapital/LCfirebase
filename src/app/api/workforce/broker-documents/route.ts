import { NextRequest, NextResponse } from 'next/server';
import { brokerDocumentAdminService } from '@/lib/broker-document-service-admin';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-utils-server';

// GET - Get all broker documents for workforce review
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only workforce members can access this endpoint
    if (user.role !== 'workforce' && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Only workforce members can access this endpoint' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId');
    const status = searchParams.get('status'); // Filter by status if provided

    console.log('Workforce API - Broker ID:', brokerId, 'Status filter:', status, 'User role:', user.role);

    let result;
    if (brokerId) {
      // Get documents for specific broker
      console.log('Fetching documents for broker:', brokerId);
      result = await brokerDocumentAdminService.getBrokerDocuments(brokerId);
      console.log('Broker documents result:', result);
    } else {
      // Get all documents across all brokers
      console.log('Fetching all documents with status filter:', status);
      result = await brokerDocumentAdminService.getAllDocuments(status as any);
      console.log('All documents result:', result);
    }
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        documents: result.documents 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to get documents' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in GET /api/workforce/broker-documents:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// PUT - Update document status (approve/deny)
export async function PUT(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only workforce members can approve/deny documents
    if (user.role !== 'workforce' && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Only workforce members can approve/deny documents' 
      }, { status: 403 });
    }

    const { documentId, status, notes } = await request.json();

    if (!documentId || !status) {
      return NextResponse.json({ 
        error: 'Missing required fields: documentId, status' 
      }, { status: 400 });
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ 
        error: 'Status must be either "approved" or "rejected"' 
      }, { status: 400 });
    }

    const result = await brokerDocumentAdminService.updateDocumentStatus(
      documentId, 
      status, 
      user.uid, // reviewedBy
      notes
    );
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: `Document ${status} successfully` 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to update document status' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in PUT /api/workforce/broker-documents:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// POST - Bulk approve/deny documents
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only workforce members can bulk approve/deny documents
    if (user.role !== 'workforce' && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Only workforce members can bulk approve/deny documents' 
      }, { status: 403 });
    }

    const { documentIds, status, notes } = await request.json();

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return NextResponse.json({ 
        error: 'Missing or invalid documentIds array' 
      }, { status: 400 });
    }

    if (!status || !['approved', 'rejected'].includes(status)) {
      return NextResponse.json({ 
        error: 'Status must be either "approved" or "rejected"' 
      }, { status: 400 });
    }

    // Update all documents in parallel
    const updatePromises = documentIds.map((documentId: string) =>
      brokerDocumentAdminService.updateDocumentStatus(
        documentId, 
        status, 
        user.uid, // reviewedBy
        notes
      )
    );

    const results = await Promise.all(updatePromises);
    
    // Check if all updates were successful
    const failedUpdates = results.filter(result => !result.success);
    
    if (failedUpdates.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: `${documentIds.length} documents ${status} successfully` 
      });
    } else {
      return NextResponse.json({ 
        error: `${failedUpdates.length} documents failed to update`, 
        details: failedUpdates.map(f => f.error)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST /api/workforce/broker-documents:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
