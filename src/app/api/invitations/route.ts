import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email-service';
import { requireAuth, requireRole } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
    try {
        // Require authentication and workforce/admin role
        const authError = await requireRole(request, ['workforce', 'admin']);
        if (authError) return authError;

        // Get all invitations
        const invitationsSnapshot = await adminDb.collection('invitations')
            .orderBy('createdAt', 'desc')
            .get();

        const invitations = invitationsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date(doc.data().createdAt),
            expiresAt: doc.data().expiresAt?.toDate?.() || new Date(doc.data().expiresAt),
            acceptedAt: doc.data().acceptedAt?.toDate?.() || (doc.data().acceptedAt ? new Date(doc.data().acceptedAt) : null),
        }));

        return NextResponse.json({
            success: true,
            invitations
        });

    } catch (error) {
        console.error('Error fetching invitations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch invitations' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Require authentication and workforce/admin role
        const authError = await requireRole(request, ['workforce', 'admin']);
        if (authError) return authError;

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

        // Send email via Resend with enhanced branding
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Chat Invitation - Lankford Capital</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Lankford Capital</h1>
                        <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 16px;">Your Partner in Financial Growth</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 32px 24px;">
                        <div style="text-align: center; margin-bottom: 32px;">
                            <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #3b82f6, #1d4ed8); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
                                <span style="color: #ffffff; font-size: 24px; font-weight: bold;">💬</span>
                            </div>
                            <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">You've been invited!</h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px;">Join our secure chat room for seamless communication</p>
                        </div>
                        
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                            <p style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px; font-weight: 500;">Hello ${fullName},</p>
                            <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">
                                You've been invited by <strong style="color: #1e293b;">${invitedBy}</strong> to join the 
                                <strong style="color: #3b82f6;">${roomName}</strong> chat room.
                            </p>
                            <p style="color: #475569; margin: 0; font-size: 16px; line-height: 1.5;">
                                This secure chat room will allow you to communicate directly with our team and other participants.
                            </p>
                        </div>
                        
                        <div style="margin-bottom: 32px; text-align: center;">
                            <h3 style="color: #1e293b; margin: 0 0 24px 0; font-size: 18px; font-weight: 600;">Ready to join?</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <a href="${signupUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 8px;">Create Account</a>
                            </div>
                            
                            <div style="margin-bottom: 16px;">
                                <a href="${signinUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; margin: 0 8px;">Sign In</a>
                            </div>
                            
                            <p style="color: #64748b; margin: 16px 0 0 0; font-size: 14px;">
                                Choose the option that applies to you
                            </p>
                        </div>
                        
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 6px 6px 0;">
                            <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                                ⏰ This invitation will expire in 7 days
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Best regards,</p>
                        <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600;">Lankford Capital Team</p>
                        <p style="color: #64748b; margin: 16px 0 0 0; font-size: 12px;">
                            This is an automated message. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const emailText = `
            🏦 LANKFORD CAPITAL - CHAT INVITATION
            ======================================
            
            Hello ${fullName},
            
            You've been invited by ${invitedBy} to join the "${roomName}" chat room.
            
            This secure chat room will allow you to communicate directly with our team and other participants.
            
            READY TO JOIN?
            ==============
            
            Create Account: ${signupUrl}
            Sign In: ${signinUrl}
            
            ⏰ IMPORTANT: This invitation will expire in 7 days.
            
            Best regards,
            Lankford Capital Team
            Your Partner in Financial Growth
            
            ---
            This is an automated message. Please do not reply to this email.
        `;

        // Send email using the new Resend-based service
        await sendEmail({
            to: [email],
            subject: `You've been invited to join ${roomName} chat room`,
            html: emailHtml,
            text: emailText,
            from: 'Lankford Lending <noreply@lankfordcapital.com>'
        });

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
