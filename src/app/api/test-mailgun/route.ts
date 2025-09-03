import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, sendSimpleEmail, sendTemplateEmail, getDomainStatus, isValidEmail } from '@/lib/mailgun-service';

export async function POST(request: NextRequest) {
    try {
        const { to, subject, message, testType = 'simple' } = await request.json();

        // Validate email
        if (!(await isValidEmail(to))) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        let result;

        switch (testType) {
            case 'simple':
                result = await sendSimpleEmail(to, subject || 'Test Email from Mailgun', message || 'Hello from Lankford Lending via Mailgun!');
                break;
            
            case 'template':
                const template = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <h1 style="color: #333; text-align: center;">Welcome to Lankford Lending!</h1>
                        <p>Hello {{name}},</p>
                        <p>Thank you for your interest in our lending services. We're excited to help you with your financial needs.</p>
                        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3>Your Information:</h3>
                            <p><strong>Name:</strong> {{name}}</p>
                            <p><strong>Email:</strong> {{email}}</p>
                            <p><strong>Test ID:</strong> {{testId}}</p>
                        </div>
                        <p>If you have any questions, please don't hesitate to contact us.</p>
                        <p>Best regards,<br>The Lankford Lending Team</p>
                    </div>
                `;
                
                result = await sendTemplateEmail(
                    to,
                    subject || 'Template Test Email from Mailgun',
                    template,
                    {
                        name: 'Test User',
                        email: to,
                        testId: Math.random().toString(36).substr(2, 9)
                    }
                );
                break;
            
            case 'full':
                result = await sendEmail({
                    to: [to],
                    cc: [],
                    bcc: [],
                    subject: subject || 'Full Test Email from Mailgun',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <h1 style="color: #333;">Full Email Test</h1>
                            <p>This is a test of the full email functionality with Mailgun.</p>
                            <p><strong>Message:</strong> ${message || 'Default test message'}</p>
                            <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                            <div style="background-color: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
                                <h3>Features Tested:</h3>
                                <ul>
                                    <li>HTML email formatting</li>
                                    <li>Mailgun API integration</li>
                                    <li>Custom styling</li>
                                    <li>Dynamic content</li>
                                </ul>
                            </div>
                            <p>If you received this email, Mailgun is working correctly!</p>
                        </div>
                    `,
                    text: `Full Email Test\n\nThis is a test of the full email functionality with Mailgun.\n\nMessage: ${message || 'Default test message'}\nTimestamp: ${new Date().toISOString()}\n\nIf you received this email, Mailgun is working correctly!`,
                    tags: ['test', 'mailgun-integration'],
                    variables: {
                        testType: 'full',
                        timestamp: new Date().toISOString()
                    }
                });
                break;
            
            default:
                return NextResponse.json(
                    { error: 'Invalid test type. Use: simple, template, or full' },
                    { status: 400 }
                );
        }

        return NextResponse.json({
            success: true,
            message: `Email sent successfully via Mailgun (${testType} test)`,
            result: result,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error testing Mailgun:', error);
        return NextResponse.json(
            { 
                error: 'Failed to send test email',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        // Test domain status
        const domainStatus = await getDomainStatus();
        
        return NextResponse.json({
            success: true,
            message: 'Mailgun service is configured and ready',
            domainStatus: domainStatus,
            timestamp: new Date().toISOString(),
            environment: {
                hasApiKey: !!process.env.MAILGUN_API_KEY,
                hasDomain: !!process.env.MAILGUN_DOMAIN,
                domain: process.env.MAILGUN_DOMAIN
            }
        });
    } catch (error) {
        console.error('Error checking Mailgun status:', error);
        return NextResponse.json(
            { 
                error: 'Failed to check Mailgun status',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}
