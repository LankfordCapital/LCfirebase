import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const invitationId = params.id;

        if (!invitationId) {
            return NextResponse.json(
                { error: 'Invitation ID is required' },
                { status: 400 }
            );
        }

        // Get invitation details
        const invitationDoc = await adminDb.collection('user-invitations').doc(invitationId).get();

        if (!invitationDoc.exists) {
            return NextResponse.json(
                { error: 'Invitation not found' },
                { status: 404 }
            );
        }

        const invitationData = invitationDoc.data();

        // Check if invitation is expired
        const now = new Date();
        const expiresAt = invitationData?.expiresAt?.toDate?.() || new Date(invitationData?.expiresAt);
        
        if (now > expiresAt) {
            return NextResponse.json(
                { error: 'Invitation has expired' },
                { status: 410 }
            );
        }

        // Check if invitation is already accepted
        if (invitationData?.status === 'accepted') {
            return NextResponse.json(
                { error: 'Invitation has already been accepted' },
                { status: 410 }
            );
        }

        return NextResponse.json({
            success: true,
            invitation: {
                id: invitationDoc.id,
                fullName: invitationData?.fullName,
                email: invitationData?.email,
                role: invitationData?.role,
                invitedBy: invitationData?.invitedBy,
                status: invitationData?.status,
                createdAt: invitationData?.createdAt?.toDate?.() || new Date(invitationData?.createdAt),
                expiresAt: invitationData?.expiresAt?.toDate?.() || new Date(invitationData?.expiresAt),
            }
        });

    } catch (error) {
        console.error('Error fetching user invitation:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invitation' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const invitationId = params.id;
        const { status } = await request.json();

        if (!invitationId) {
            return NextResponse.json(
                { error: 'Invitation ID is required' },
                { status: 400 }
            );
        }

        if (!status || !['accepted', 'declined'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be accepted or declined' },
                { status: 400 }
            );
        }

        // Update invitation status
        const updateData: any = {
            status,
            updatedAt: new Date(),
        };

        if (status === 'accepted') {
            updateData.acceptedAt = new Date();
        }

        await adminDb.collection('user-invitations').doc(invitationId).update(updateData);

        return NextResponse.json({
            success: true,
            message: `Invitation ${status} successfully`
        });

    } catch (error) {
        console.error('Error updating user invitation:', error);
        return NextResponse.json(
            { error: 'Failed to update invitation' },
            { status: 500 }
        );
    }
}
