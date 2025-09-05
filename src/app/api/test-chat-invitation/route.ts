import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        // Test email template
        const testEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Test Chat Invitation - Lankford Capital</title>
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
                                <span style="color: #ffffff; font-size: 24px; font-weight: bold;">✅</span>
                            </div>
                            <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">Chat Invitation System Test</h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px;">Resend email service is working correctly!</p>
                        </div>
                        
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
                            <p style="color: #1e293b; margin: 0 0 12px 0; font-size: 16px; font-weight: 500;">Hello Test User,</p>
                            <p style="color: #475569; margin: 0 0 16px 0; font-size: 16px; line-height: 1.5;">
                                This is a test of the chat invitation system. The email service is working correctly with Resend!
                            </p>
                            <p style="color: #475569; margin: 0; font-size: 16px; line-height: 1.5;">
                                You can now send real chat invitations to users.
                            </p>
                        </div>
                        
                        <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 16px; border-radius: 0 6px 6px 0;">
                            <p style="color: #166534; margin: 0; font-size: 14px; font-weight: 500;">
                                ✅ Chat invitation system is ready to use!
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Best regards,</p>
                        <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600;">Lankford Capital Team</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const testEmailText = `
            🏦 LANKFORD CAPITAL - CHAT INVITATION TEST
            ==========================================
            
            Hello Test User,
            
            This is a test of the chat invitation system. The email service is working correctly with Resend!
            
            ✅ Chat invitation system is ready to use!
            
            Best regards,
            Lankford Capital Team
            Your Partner in Financial Growth
        `;

        // Send test email
        await sendEmail({
            to: [email],
            subject: 'Chat Invitation System Test - Lankford Capital',
            html: testEmailHtml,
            text: testEmailText,
            from: 'Lankford Capital <noreply@lankfordcapital.com>'
        });

        return NextResponse.json({
            success: true,
            message: 'Test email sent successfully!',
            email: email
        });

    } catch (error) {
        console.error('Error sending test email:', error);
        return NextResponse.json(
            { error: 'Failed to send test email' },
            { status: 500 }
        );
    }
}
