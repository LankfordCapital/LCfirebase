import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, getAuthenticatedUser } from '@/lib/auth-utils-server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    // Require authentication
    const authError = await requireAuth(request);
    if (authError) return authError;

    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Only workforce members and admins can access broker info
    if (user.role !== 'workforce' && user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'Forbidden - Only workforce members can access broker information' 
      }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const brokerId = searchParams.get('brokerId');

    if (!brokerId) {
      return NextResponse.json({ 
        error: 'Broker ID is required' 
      }, { status: 400 });
    }

    // Get broker information from Firestore
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

    const broker = {
      id: brokerDoc.id,
      uid: brokerDoc.id,
      fullName: brokerData.fullName || brokerData.name || 'Unknown Broker',
      name: brokerData.fullName || brokerData.name || 'Unknown Broker',
      company: brokerData.company || 'No company',
      email: brokerData.email || 'No email',
      phone: brokerData.phone || 'No phone',
      status: brokerData.status || 'Active',
      role: brokerData.role,
      createdAt: brokerData.createdAt,
      lastLoginAt: brokerData.lastLoginAt
    };

    return NextResponse.json({ 
      success: true, 
      broker 
    });

  } catch (error) {
    console.error('Error in GET /api/workforce/broker-info:', error);
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
}
