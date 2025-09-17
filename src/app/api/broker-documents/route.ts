import { NextRequest, NextResponse } from 'next/server';
import { brokerDocumentAdminService } from '@/lib/broker-document-service-admin';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-utils-server';

// GET - Get all documents for a broker
export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId');

    if (!brokerId) {
      return NextResponse.json({ error: 'Broker ID is required' }, { status: 400 });
    }

    // Users can only access their own documents, admins can access any
    if (user.role !== 'admin' && user.uid !== brokerId) {
      return NextResponse.json({ 
        error: 'Forbidden - Can only access your own documents' 
      }, { status: 403 });
    }

    const result = await brokerDocumentAdminService.getBrokerDocuments(brokerId);
    
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
    console.error('Error in GET /api/broker-documents:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// POST - Add a new broker document
export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const { brokerId, type, name, fileName, fileUrl, fileSize, mimeType } = await request.json();

    if (!brokerId || !type || !name || !fileName || !fileUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields: brokerId, type, name, fileName, fileUrl' 
      }, { status: 400 });
    }

    // Users can only add documents for themselves, admins can add for anyone
    if (user.role !== 'admin' && user.uid !== brokerId) {
      return NextResponse.json({ 
        error: 'Forbidden - Can only add documents for yourself' 
      }, { status: 403 });
    }

    const documentData = {
      brokerId,
      type,
      name,
      fileName,
      fileUrl,
      fileSize: fileSize || 0,
      mimeType: mimeType || 'application/octet-stream',
      status: 'pending' as const
    };

    const result = await brokerDocumentAdminService.addDocument(documentData);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        documentId: result.id,
        message: 'Document added successfully' 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to add document' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in POST /api/broker-documents:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// PUT - Update document status
export async function PUT(request: NextRequest) {
  try {
    const { documentId, status, reviewedBy, notes } = await request.json();

    if (!documentId || !status) {
      return NextResponse.json({ 
        error: 'Missing required fields: documentId, status' 
      }, { status: 400 });
    }

    const result = await brokerDocumentAdminService.updateDocumentStatus(
      documentId, 
      status, 
      reviewedBy, 
      notes
    );
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Document status updated successfully' 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to update document' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in PUT /api/broker-documents:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}

// DELETE - Delete a document
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');
    const filePath = searchParams.get('filePath');

    if (!documentId || !filePath) {
      return NextResponse.json({ 
        error: 'Missing required parameters: documentId, filePath' 
      }, { status: 400 });
    }

    const result = await brokerDocumentAdminService.deleteDocument(documentId, filePath);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Document deleted successfully' 
      });
    } else {
      return NextResponse.json({ 
        error: result.error || 'Failed to delete document' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in DELETE /api/broker-documents:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
