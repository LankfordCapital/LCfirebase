import { NextRequest, NextResponse } from 'next/server';
import { brokerDocumentAdminService } from '@/lib/broker-document-service-admin';

// GET - Get all documents for a broker
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId');

    if (!brokerId) {
      return NextResponse.json({ error: 'Broker ID is required' }, { status: 400 });
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
    const { brokerId, type, name, fileName, fileUrl, fileSize, mimeType } = await request.json();

    if (!brokerId || !type || !name || !fileName || !fileUrl) {
      return NextResponse.json({ 
        error: 'Missing required fields: brokerId, type, name, fileName, fileUrl' 
      }, { status: 400 });
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
