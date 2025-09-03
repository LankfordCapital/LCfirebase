import { NextRequest, NextResponse } from 'next/server';
import { sendSimpleEmail } from '@/lib/mailgun-service';

export async function POST(request: NextRequest) {
    try {
        const { to, subject, message } = await request.json();

        if (!to || !subject || !message) {
            return NextResponse.json(
                { error: 'Missing required fields: to, subject, message' },
                { status: 400 }
            );
        }

        // Send the test email
        const result = await sendSimpleEmail(to, subject, message);

        return NextResponse.json({
            success: true,
            message: 'Email sent successfully',
            result
        });

    } catch (error) {
        console.error('Error in test email endpoint:', error);
        return NextResponse.json(
            { error: 'Failed to send email', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Test email endpoint. Use POST with { to, subject, message }',
        example: {
            to: 'test@example.com',
            subject: 'Test Email',
            message: 'This is a test email from Lankford Lending'
        }
    });
}
