import { NextRequest, NextResponse } from 'next/server';
import { brokerDocumentAdminService } from '@/lib/broker-document-service-admin';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-utils-server';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const brokerId = formData.get('brokerId') as string;
    const documentType = formData.get('documentType') as string;
    const documentName = formData.get('documentName') as string;

    if (!file || !brokerId || !documentType || !documentName) {
      return NextResponse.json({ 
        error: 'Missing required fields: file, brokerId, documentType, documentName' 
      }, { status: 400 });
    }

    // Users can only upload documents for themselves, admins can upload for anyone
    if (user.role !== 'admin' && user.uid !== brokerId) {
      return NextResponse.json({ 
        error: 'Forbidden - Can only upload documents for yourself' 
      }, { status: 403 });
    }

    // Validate file
    const validation = brokerDocumentAdminService.validateFile(file);
    if (!validation.valid) {
      return NextResponse.json({ 
        error: validation.error || 'Invalid file' 
      }, { status: 400 });
    }

    // Upload file to storage
    const uploadResult = await brokerDocumentAdminService.uploadDocument(file, brokerId, documentType);
    
    if (!uploadResult.success || !uploadResult.url) {
      return NextResponse.json({ 
        error: uploadResult.error || 'Failed to upload file' 
      }, { status: 500 });
    }

    // Add document to database
    const addResult = await brokerDocumentAdminService.addDocument({
      brokerId,
      type: documentType as any,
      name: documentName,
      fileName: file.name,
      fileUrl: uploadResult.url,
      filePath: uploadResult.path!,
      fileSize: file.size,
      mimeType: file.type,
      status: 'pending'
    });

    if (!addResult.success) {
      return NextResponse.json({ 
        error: addResult.error || 'Failed to save document record' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      documentId: addResult.id,
      fileUrl: uploadResult.url,
      message: 'Document uploaded successfully' 
    });

  } catch (error) {
    console.error('Error in POST /api/broker-documents/upload:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
