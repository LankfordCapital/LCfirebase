import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendEmail } from '@/lib/email-service';
import { Timestamp } from 'firebase-admin/firestore';

export async function GET(request: NextRequest) {
    try {
        // Get all user invitations
        const invitationsSnapshot = await adminDb.collection('user-invitations')
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
        console.error('Error fetching user invitations:', error);
        return NextResponse.json(
            { error: 'Failed to fetch user invitations' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const { fullName, email, role, invitedBy } = await request.json();

        // Validate required fields
        if (!fullName || !email || !role || !invitedBy) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Validate role
        if (!['borrower', 'broker'].includes(role)) {
            return NextResponse.json(
                { error: 'Invalid role. Must be borrower or broker' },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUserSnapshot = await adminDb.collection('users')
            .where('email', '==', email.toLowerCase())
            .get();

        if (!existingUserSnapshot.empty) {
            return NextResponse.json(
                { error: 'User with this email already exists' },
                { status: 400 }
            );
        }

        // Check if invitation already exists and is pending
        const existingInvitationSnapshot = await adminDb.collection('user-invitations')
            .where('email', '==', email.toLowerCase())
            .where('status', '==', 'pending')
            .get();

        if (!existingInvitationSnapshot.empty) {
            return NextResponse.json(
                { error: 'Pending invitation already exists for this email' },
                { status: 400 }
            );
        }

        // Create invitation record
        const invitationData = {
            fullName,
            email: email.toLowerCase(),
            role,
            invitedBy,
            status: 'pending',
            createdAt: Timestamp.now(),
            expiresAt: Timestamp.fromDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)), // 7 days from now
        };

        const invitationRef = await adminDb.collection('user-invitations').add(invitationData);
        const invitationId = invitationRef.id;

        // Generate signup URL
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
        const signupUrl = `${baseUrl}/auth/signup?invitationId=${invitationId}&role=${role}`;

        // Send email via Resend with enhanced branding
        const roleDisplayName = role === 'broker' ? 'Broker' : 'Borrower';
        const roleDescription = role === 'broker' 
            ? 'access to our broker portal and loan management tools'
            : 'access to our borrower portal and loan application system';

        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Platform Invitation - Lankford Capital</title>
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
                                <span style="color: #ffffff; font-size: 24px; font-weight: bold;">🏦</span>
                            </div>
                            <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">You've been invited!</h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px;">Join our lending platform as a ${roleDisplayName}</p>
                        </div>
                        
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                            <p style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px; font-weight: 500;">Hello ${fullName},</p>
                            <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">
                                You've been invited by <strong style="color: #1e293b;">${invitedBy}</strong> to join the Lankford Capital platform as a <strong style="color: #3b82f6;">${roleDisplayName}</strong>.
                            </p>
                            <p style="color: #475569; margin: 0; font-size: 16px; line-height: 1.5;">
                                As a ${roleDisplayName}, you'll have ${roleDescription}.
                            </p>
                        </div>
                        
                        <div style="margin-bottom: 32px; text-align: center;">
                            <h3 style="color: #1e293b; margin: 0 0 24px 0; font-size: 18px; font-weight: 600;">Ready to get started?</h3>
                            
                            <div style="margin-bottom: 16px;">
                                <a href="${signupUrl}" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Create Account & Join Platform</a>
                            </div>
                            
                            <p style="color: #64748b; margin: 16px 0 0 0; font-size: 14px;">
                                Click the button above to create your account and start using the platform
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
            🏦 LANKFORD CAPITAL - PLATFORM INVITATION
            =========================================
            
            Hello ${fullName},
            
            You've been invited by ${invitedBy} to join the Lankford Capital platform as a ${roleDisplayName}.
            
            As a ${roleDisplayName}, you'll have ${roleDescription}.
            
            READY TO GET STARTED?
            =====================
            
            Create Account: ${signupUrl}
            
            ⏰ IMPORTANT: This invitation will expire in 7 days.
            
            Best regards,
            Lankford Capital Team
            Your Partner in Financial Growth
            
            ---
            This is an automated message. Please do not reply to this email.
        `;

        // Send email using the Resend-based service
        await sendEmail({
            to: [email],
            subject: `You've been invited to join Lankford Capital as a ${roleDisplayName}`,
            html: emailHtml,
            text: emailText,
            from: 'Lankford Lending <noreply@lankfordcapital.com>'
        });

        return NextResponse.json({
            success: true,
            invitationId,
            message: 'User invitation sent successfully'
        });

    } catch (error) {
        console.error('Error sending user invitation:', error);
        return NextResponse.json(
            { error: 'Failed to send user invitation' },
            { status: 500 }
        );
    }
}
