import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';
import { getDownloadURL } from 'firebase-admin/storage';
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
    const borrowerId = formData.get('borrowerId') as string;
    const documentType = formData.get('documentType') as string;
    const documentName = formData.get('documentName') as string;

    if (!file || !borrowerId || !documentType || !documentName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Users can only upload documents for themselves, admins can upload for anyone
    if (user.role !== 'admin' && user.uid !== borrowerId) {
      return NextResponse.json({ 
        error: 'Forbidden - Can only upload documents for yourself' 
      }, { status: 403 });
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'File type not supported. Please upload PDF, DOC, DOCX, or image files.' },
        { status: 400 }
      );
    }

    try {
      console.log('Uploading document:', { borrowerId, documentType, fileName: file.name, fileSize: file.size });
      
      // Upload to Firebase Storage using Admin SDK
      const fileName = `${documentType}-${Date.now()}-${file.name}`;
      const storagePath = `borrower-documents/${borrowerId}/${fileName}`;
      
      const bucket = adminStorage.bucket('lankford-lending.firebasestorage.app');
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      
      console.log('Uploading to storage path:', storagePath);
      console.log('Bucket name:', bucket.name);
      
      const fileUpload = bucket.file(storagePath);
      await fileUpload.save(fileBuffer, {
        metadata: {
          contentType: file.type,
        },
      });

          console.log('File saved to storage, generating download URL...');

    // Generate download URL using signed URL
    const [downloadURL] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 365 * 24 * 60 * 60 * 1000, // 1 year from now
    });
    
    console.log('Upload successful, download URL generated:', downloadURL);

      return NextResponse.json({
        success: true,
        url: downloadURL,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      });
    } catch (error) {
      console.error('Error uploading document:', error);
      return NextResponse.json(
        { error: `Failed to upload document: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in borrower documents upload API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
