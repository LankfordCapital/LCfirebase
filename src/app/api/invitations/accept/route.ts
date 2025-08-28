import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
    try {
        const { invitationId, userId, userEmail } = await request.json();

        // Validate required fields
        if (!invitationId || !userId || !userEmail) {
            return NextResponse.json(
                { error: 'Missing required fields' },
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
            return NextResponse.json(
                { error: 'Invitation has expired' },
                { status: 400 }
            );
        }

        // Check if email matches
        if (invitation.email.toLowerCase() !== userEmail.toLowerCase()) {
            return NextResponse.json(
                { error: 'Email does not match invitation' },
                { status: 400 }
            );
        }

        // Add user to the chat room
        const chatRoomRef = doc(db, 'chatRooms', invitation.roomId);
        await updateDoc(chatRoomRef, {
            members: arrayUnion(userId),
            updatedAt: new Date()
        });

        // Update invitation status
        await updateDoc(invitationRef, {
            status: 'accepted',
            acceptedAt: new Date(),
            acceptedBy: userId
        });

        return NextResponse.json({
            success: true,
            message: 'Invitation accepted successfully',
            roomId: invitation.roomId,
            roomName: invitation.roomName
        });

    } catch (error) {
        console.error('Error accepting invitation:', error);
        return NextResponse.json(
            { error: 'Failed to accept invitation' },
            { status: 500 }
        );
    }
}
