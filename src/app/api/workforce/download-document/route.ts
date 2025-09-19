import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-utils-server';
import { brokerDocumentAdminService } from '@/lib/broker-document-service-admin';
import { adminStorage } from '@/lib/firebase-admin';

// Helper function to get content type from filename
function getContentTypeFromFileName(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'webp':
      return 'image/webp';
    case 'doc':
      return 'application/msword';
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
      return 'application/vnd.ms-excel';
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'txt':
      return 'text/plain';
    case 'csv':
      return 'text/csv';
    default:
      return 'application/octet-stream';
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only workforce members can download documents
    if (user.role !== 'workforce' && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Only workforce members can download documents' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ 
        error: 'Document ID is required' 
      }, { status: 400 });
    }

    // Get the document details
    const result = await brokerDocumentAdminService.getDocument(documentId);
    
    if (!result.success || !result.document) {
      return NextResponse.json({ 
        error: 'Document not found' 
      }, { status: 404 });
    }

    const document = result.document;

    try {
      console.log('Document data:', {
        id: document.id,
        fileName: document.fileName,
        filePath: document.filePath,
        fileUrl: document.fileUrl,
        mimeType: document.mimeType
      });

      // Try multiple approaches to download the file
      let fileBuffer: Buffer;
      let contentType: string;

      // Approach 1: Try using filePath if available
      if (document.filePath) {
        try {
          console.log('Attempting download using filePath:', document.filePath);
          const bucket = adminStorage.bucket('lankford-lending.firebasestorage.app');
          const fileRef = bucket.file(document.filePath);
          
          // Check if file exists
          const [exists] = await fileRef.exists();
          if (exists) {
            const [buffer] = await fileRef.download();
            const [metadata] = await fileRef.getMetadata();
            
            fileBuffer = buffer;
            contentType = metadata.contentType || document.mimeType || getContentTypeFromFileName(document.fileName);
            console.log('Successfully downloaded using filePath, content type:', contentType);
          } else {
            console.log('File not found at filePath, trying URL extraction');
            throw new Error('File not found at filePath');
          }
        } catch (filePathError) {
          console.log('filePath download failed:', filePathError);
          // Continue to URL extraction
        }
      }

      // Approach 2: Try extracting path from URL if filePath failed or not available
      if (!fileBuffer) {
        try {
          console.log('Attempting download using URL path extraction');
          // Extract the path from the Firebase Storage URL
          const url = new URL(document.fileUrl);
          const pathMatch = url.pathname.match(/\/o\/(.+?)\?/);
          
          if (pathMatch) {
            const encodedPath = pathMatch[1];
            const decodedPath = decodeURIComponent(encodedPath);
            console.log('Extracted path from URL:', decodedPath);
            
            const bucket = adminStorage.bucket('lankford-lending.firebasestorage.app');
            const fileRef = bucket.file(decodedPath);
            
            // Check if file exists
            const [exists] = await fileRef.exists();
            if (exists) {
              const [buffer] = await fileRef.download();
              const [metadata] = await fileRef.getMetadata();
              
              fileBuffer = buffer;
              contentType = metadata.contentType || document.mimeType || getContentTypeFromFileName(document.fileName);
              console.log('Successfully downloaded using URL path extraction, content type:', contentType);
            } else {
              throw new Error('File not found at extracted path');
            }
          } else {
            throw new Error('Could not extract path from URL');
          }
        } catch (urlExtractionError) {
          console.log('URL path extraction failed:', urlExtractionError);
          throw urlExtractionError;
        }
      }

      // Ensure we have a buffer
      if (!fileBuffer) {
        throw new Error('Failed to download file from all methods');
      }

      // Log buffer details for debugging
      console.log('File buffer details:', {
        length: fileBuffer.length,
        contentType,
        fileName: document.fileName,
        isBuffer: Buffer.isBuffer(fileBuffer),
        firstBytes: fileBuffer.slice(0, 10).toString('hex')
      });

      // Ensure the buffer is properly formatted for PDF files
      if (contentType === 'application/pdf') {
        // Verify PDF header
        const pdfHeader = fileBuffer.slice(0, 4).toString();
        if (pdfHeader !== '%PDF') {
          console.warn('Warning: File does not appear to be a valid PDF (missing %PDF header)');
        }
      }

      // Return the file as a download with proper headers to force download
      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType, // Use original content type to preserve file integrity
          'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(document.fileName)}`, // Properly encoded filename
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Content-Type-Options': 'nosniff',
          'Accept-Ranges': 'bytes',
        },
      });

    } catch (error) {
      console.error('All download methods failed:', error);
      
      // Final fallback: return a redirect to the original URL
      return NextResponse.redirect(document.fileUrl, 302);
    }

  } catch (error) {
    console.error('Error in GET /api/workforce/download-document:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
