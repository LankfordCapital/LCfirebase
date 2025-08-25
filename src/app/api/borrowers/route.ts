import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, phoneNumber, email, propertyAddress, companyName, createdBy } = body;

    // Validate required fields
    if (!fullName || !phoneNumber || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, phoneNumber, email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create borrower document
    const borrowerData = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.toLowerCase().trim(),
      propertyAddress: propertyAddress?.trim() || null,
      companyName: companyName?.trim() || null,
      createdBy: createdBy || 'system',
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active'
    };

    // Add to Firestore
    const borrowerRef = await adminDb.collection('borrowers').add(borrowerData);

    return NextResponse.json({
      success: true,
      borrowerId: borrowerRef.id,
      borrower: {
        id: borrowerRef.id,
        ...borrowerData
      }
    });

  } catch (error) {
    console.error('Error creating borrower:', error);
    return NextResponse.json(
      { error: 'Failed to create borrower' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const phoneNumber = searchParams.get('phoneNumber');

    let query = adminDb.collection('borrowers');

    // If email is provided, search by email
    if (email) {
      query = query.where('email', '==', email.toLowerCase());
    }
    // If phone number is provided, search by phone number
    else if (phoneNumber) {
      query = query.where('phoneNumber', '==', phoneNumber);
    }

    const snapshot = await query.get();
    const borrowers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({
      success: true,
      borrowers
    });

  } catch (error) {
    console.error('Error fetching borrowers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch borrowers' },
      { status: 500 }
    );
  }
}
