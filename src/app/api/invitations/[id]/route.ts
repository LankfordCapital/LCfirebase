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

        // Get the invitation
        const invitationRef = doc(db, 'invitations', invitationId);
        const invitationSnap = await getDoc(invitationRef);

        if (!invitationSnap.exists) {
            return NextResponse.json(
                { error: 'Invitation not found' },
                { status: 404 }
            );
        }

        const invitation = invitationSnap.data();

        // Check if invitation has expired
        if (invitation.expiresAt.toDate() < new Date()) {
            return NextResponse.json({
                ...invitation,
                id: invitationId,
                isExpired: true
            });
        }

        return NextResponse.json({
            ...invitation,
            id: invitationId,
            isExpired: false
        });

    } catch (error) {
        console.error('Error getting invitation:', error);
        return NextResponse.json(
            { error: 'Failed to get invitation' },
            { status: 500 }
        );
    }
}
