import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-utils-server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only workforce members and admins can update broker info
    if (user.role !== 'workforce' && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Only workforce members can update broker information' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { brokerId, updates } = body;

    if (!brokerId) {
      return NextResponse.json({ 
        error: 'Broker ID is required' 
      }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ 
        error: 'Updates object is required' 
      }, { status: 400 });
    }

    // Get the broker document
    const brokerDoc = await adminDb.collection('users').doc(brokerId).get();
    
    if (!brokerDoc.exists) {
      return NextResponse.json({ 
        error: 'Broker not found' 
      }, { status: 404 });
    }

    const brokerData = brokerDoc.data();
    
    // Ensure this is actually a broker
    if (brokerData?.role !== 'broker') {
      return NextResponse.json({ 
        error: 'User is not a broker' 
      }, { status: 400 });
    }

    // Prepare update data
    const updateData: any = {
      ...updates,
      updatedAt: new Date(),
      updatedBy: user.uid
    };

    // Update the broker document
    await adminDb.collection('users').doc(brokerId).update(updateData);

    return NextResponse.json({ 
      success: true, 
      message: 'Broker updated successfully' 
    });

  } catch (error) {
    console.error('Error in POST /api/workforce/update-broker:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
