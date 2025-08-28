import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
        const { fullName, email, roomId, roomName, invitedBy } = await request.json();

        // Validate required fields
        if (!fullName || !email || !roomId || !roomName || !invitedBy) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create invitation record
        const invitationData = {
            fullName,
            email: email.toLowerCase(),
            roomId,
            roomName,
            invitedBy,
            status: 'pending',
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        };

        const invitationRef = await adminDb.collection('invitations').add(invitationData);
        const invitationId = invitationRef.id;

        // Generate signup/signin URLs
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const signupUrl = `${baseUrl}/auth/signup?invitationId=${invitationId}`;
        const signinUrl = `${baseUrl}/auth/signin?invitationId=${invitationId}`;

        // Send email via Resend
        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">You've been invited!</h2>
                <p>Hello ${fullName},</p>
                <p>You've been invited by <strong>${invitedBy}</strong> to join the <strong>${roomName}</strong> chat room.</p>
                <p>To accept this invitation:</p>
                <ul>
                    <li>If you don't have an account: <a href="${signupUrl}" style="color: #007bff;">Sign up here</a></li>
                    <li>If you already have an account: <a href="${signinUrl}" style="color: #007bff;">Sign in here</a></li>
                </ul>
                <p>This invitation will expire in 7 days.</p>
                <p>Best regards,<br>Lankford Lending Team</p>
            </div>
        `;

        const emailText = `
            You've been invited!
            
            Hello ${fullName},
            
            You've been invited by ${invitedBy} to join the ${roomName} chat room.
            
            To accept this invitation:
            - If you don't have an account: Sign up at ${signupUrl}
            - If you already have an account: Sign in at ${signinUrl}
            
            This invitation will expire in 7 days.
            
            Best regards,
            Lankford Lending Team
        `;

        await sendEmail(
            email,
            `You've been invited to join ${roomName} chat room`,
            emailHtml,
            emailText
        );

        return NextResponse.json({
            success: true,
            invitationId,
            message: 'Invitation sent successfully'
        });

    } catch (error) {
        console.error('Error sending invitation:', error);
        return NextResponse.json(
            { error: 'Failed to send invitation' },
            { status: 500 }
        );
    }
}
