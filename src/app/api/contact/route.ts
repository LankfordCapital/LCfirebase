import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
    try {
        const { name, email, phone, message } = await request.json();

        // Validate required fields
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Name, email, and message are required' },
                { status: 400 }
            );
        }

        // Create email content for Lankford Capital team
        const teamEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission - Lankford Capital</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #1e293b 0%, #334155 100%); padding: 32px 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Lankford Capital</h1>
                        <p style="color: #cbd5e1; margin: 8px 0 0 0; font-size: 16px;">New Contact Form Submission</p>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 32px 24px;">
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                            <h2 style="color: #1e293b; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">Contact Details</h2>
                            <div style="margin-bottom: 12px;">
                                <strong style="color: #475569;">Name:</strong>
                                <span style="color: #1e293b; margin-left: 8px;">${name}</span>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <strong style="color: #475569;">Email:</strong>
                                <span style="color: #1e293b; margin-left: 8px;">${email}</span>
                            </div>
                            ${phone ? `
                            <div style="margin-bottom: 12px;">
                                <strong style="color: #475569;">Phone:</strong>
                                <span style="color: #1e293b; margin-left: 8px;">${phone}</span>
                            </div>
                            ` : ''}
                        </div>
                        
                        <div style="background-color: #f8fafc; border-radius: 8px; padding: 24px;">
                            <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Message</h3>
                            <p style="color: #475569; margin: 0; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <div style="background-color: #dcfce7; border-left: 4px solid #22c55e; padding: 16px; border-radius: 0 6px 6px 0; margin-top: 24px;">
                            <p style="color: #166534; margin: 0; font-size: 14px; font-weight: 500;">
                                📧 Reply directly to: ${email}
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; margin: 0; font-size: 14px;">
                            This message was sent from the Lankford Capital contact form
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const teamEmailText = `
            LANKFORD CAPITAL - NEW CONTACT FORM SUBMISSION
            ==============================================
            
            Contact Details:
            - Name: ${name}
            - Email: ${email}
            ${phone ? `- Phone: ${phone}` : ''}
            
            Message:
            ${message}
            
            Reply directly to: ${email}
            
            ---
            This message was sent from the Lankford Capital contact form
        `;

        // Send email to Lankford Capital team
        await sendEmail({
            to: ['Team@lankfordcapital.com'],
            subject: `New Contact Form Submission from ${name}`,
            html: teamEmailHtml,
            text: teamEmailText,
            from: 'Lankford Capital Contact Form <noreply@lankfordcapital.com>',
            replyTo: email
        });

        // Send confirmation email to the customer
        const customerEmailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You - Lankford Capital</title>
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
                                <span style="color: #ffffff; font-size: 24px; font-weight: bold;">✓</span>
                            </div>
                            <h2 style="color: #1e293b; margin: 0 0 8px 0; font-size: 24px; font-weight: 600;">Thank You, ${name}!</h2>
                            <p style="color: #64748b; margin: 0; font-size: 16px;">We've received your message and will get back to you soon.</p>
                        </div>
                        
                        <div style="background-color: #f1f5f9; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                            <h3 style="color: #1e293b; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">What happens next?</h3>
                            <ul style="color: #475569; margin: 0; padding-left: 20px; line-height: 1.6;">
                                <li>Our team will review your inquiry within 24 hours</li>
                                <li>We'll contact you at ${email} to discuss your needs</li>
                                <li>If you provided a phone number, we may call you directly</li>
                                <li>We'll provide personalized financing solutions for your project</li>
                            </ul>
                        </div>
                        
                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 0 6px 6px 0;">
                            <p style="color: #92400e; margin: 0; font-size: 14px; font-weight: 500;">
                                💡 Need immediate assistance? Call us at +1 888-489-6564
                            </p>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Best regards,</p>
                        <p style="color: #1e293b; margin: 0; font-size: 16px; font-weight: 600;">Lankford Capital Team</p>
                        <p style="color: #64748b; margin: 16px 0 0 0; font-size: 12px;">
                            12747 Olive Blvd, Ste 300a, Saint Louis, Missouri 63141
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const customerEmailText = `
            LANKFORD CAPITAL - THANK YOU
            ============================
            
            Dear ${name},
            
            Thank you for contacting Lankford Capital! We've received your message and will get back to you soon.
            
            WHAT HAPPENS NEXT?
            - Our team will review your inquiry within 24 hours
            - We'll contact you at ${email} to discuss your needs
            - If you provided a phone number, we may call you directly
            - We'll provide personalized financing solutions for your project
            
            Need immediate assistance? Call us at +1 888-489-6564
            
            Best regards,
            Lankford Capital Team
            12747 Olive Blvd, Ste 300a, Saint Louis, Missouri 63141
        `;

        // Send confirmation email to customer
        await sendEmail({
            to: [email],
            subject: 'Thank You for Contacting Lankford Capital',
            html: customerEmailHtml,
            text: customerEmailText,
            from: 'Lankford Capital <noreply@lankfordcapital.com>'
        });

        return NextResponse.json({
            success: true,
            message: 'Contact form submitted successfully'
        });

    } catch (error) {
        console.error('Error processing contact form:', error);
        return NextResponse.json(
            { error: 'Failed to submit contact form' },
            { status: 500 }
        );
    }
}
