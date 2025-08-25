import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const borrowerId = params.id;

    if (!borrowerId) {
      return NextResponse.json(
        { error: 'Borrower ID is required' },
        { status: 400 }
      );
    }

    const borrowerDoc = await adminDb.collection('borrowers').doc(borrowerId).get();

    if (!borrowerDoc.exists) {
      return NextResponse.json(
        { error: 'Borrower not found' },
        { status: 404 }
      );
    }

    const borrowerData = borrowerDoc.data();

    return NextResponse.json({
      success: true,
      borrower: {
        id: borrowerDoc.id,
        ...borrowerData
      }
    });

  } catch (error) {
    console.error('Error fetching borrower:', error);
    return NextResponse.json(
      { error: 'Failed to fetch borrower' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const borrowerId = params.id;
    const body = await request.json();
    const { fullName, phoneNumber, email, propertyAddress, companyName } = body;

    if (!borrowerId) {
      return NextResponse.json(
        { error: 'Borrower ID is required' },
        { status: 400 }
      );
    }

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

    const updateData = {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email.toLowerCase().trim(),
      propertyAddress: propertyAddress?.trim() || null,
      companyName: companyName?.trim() || null,
      updatedAt: new Date()
    };

    await adminDb.collection('borrowers').doc(borrowerId).update(updateData);

    return NextResponse.json({
      success: true,
      message: 'Borrower updated successfully'
    });

  } catch (error) {
    console.error('Error updating borrower:', error);
    return NextResponse.json(
      { error: 'Failed to update borrower' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const borrowerId = params.id;

    if (!borrowerId) {
      return NextResponse.json(
        { error: 'Borrower ID is required' },
        { status: 400 }
      );
    }

    // Soft delete - mark as inactive instead of actually deleting
    await adminDb.collection('borrowers').doc(borrowerId).update({
      status: 'inactive',
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      message: 'Borrower deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting borrower:', error);
    return NextResponse.json(
      { error: 'Failed to delete borrower' },
      { status: 500 }
    );
  }
}
