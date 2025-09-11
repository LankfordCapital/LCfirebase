import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workforceMemberId = searchParams.get('workforceMemberId');

    if (!workforceMemberId) {
      return NextResponse.json(
        { error: 'workforceMemberId is required' },
        { status: 400 }
      );
    }

    // Get appointments for the workforce member
    const appointmentsSnapshot = await adminDb
      .collection('appointments')
      .where('workforceMemberId', '==', workforceMemberId)
      .get();

    const appointments = appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, start, end, type, description, workforceMemberId } = body;

    if (!title || !start || !workforceMemberId) {
      return NextResponse.json(
        { error: 'title, start, and workforceMemberId are required' },
        { status: 400 }
      );
    }

    // Add appointment to Firestore
    const docRef = await adminDb.collection('appointments').add({
      title,
      start,
      end: end || null,
      type: type || 'appointment',
      description: description || '',
      workforceMemberId,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({ 
      success: true, 
      id: docRef.id 
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}