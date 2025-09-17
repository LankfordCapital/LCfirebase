import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-utils-server';

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
    const borrowerId = searchParams.get('borrowerId');

    if (!borrowerId) {
      return NextResponse.json(
        { error: 'Borrower ID is required' },
        { status: 400 }
      );
    }

    // Users can only access their own documents, admins can access any
    if (user.role !== 'admin' && user.uid !== borrowerId) {
      return NextResponse.json({ 
        error: 'Forbidden - Can only access your own documents' 
      }, { status: 403 });
    }

    try {
      console.log('Getting documents for borrower:', borrowerId);
      
      // Get documents from Firestore
      const documentsSnapshot = await adminDb
        .collection('borrower-documents')
        .where('borrowerId', '==', borrowerId)
        .get();

      console.log('Found documents:', documentsSnapshot.docs.length);

      const documents = documentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json({
        success: true,
        documents
      });
    } catch (error) {
      console.error('Error getting borrower documents:', error);
      return NextResponse.json(
        { error: `Failed to get documents: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in borrower documents GET API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const body = await request.json();
    const { action, ...data } = body;

    switch (action) {
      case 'addDocument':
        try {
          const docRef = await adminDb.collection('borrower-documents').add({
            ...data.documentData,
            uploadedAt: new Date()
          });

          return NextResponse.json({
            success: true,
            documentId: docRef.id
          });
        } catch (error) {
          console.error('Error adding document:', error);
          return NextResponse.json(
            { error: 'Failed to add document' },
            { status: 500 }
          );
        }

      case 'updateDocumentStatus':
        try {
          await adminDb.collection('borrower-documents').doc(data.documentId).update({
            status: data.status,
            reviewedBy: data.reviewedBy,
            reviewedAt: new Date(),
            notes: data.notes
          });

          return NextResponse.json({
            success: true
          });
        } catch (error) {
          console.error('Error updating document status:', error);
          return NextResponse.json(
            { error: 'Failed to update document status' },
            { status: 500 }
          );
        }

      case 'deleteDocument':
        try {
          await adminDb.collection('borrower-documents').doc(data.documentId).delete();
          return NextResponse.json({
            success: true
          });
        } catch (error) {
          console.error('Error deleting document:', error);
          return NextResponse.json(
            { error: 'Failed to delete document' },
            { status: 500 }
          );
        }

      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in borrower documents POST API route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
