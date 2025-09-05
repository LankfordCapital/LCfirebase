import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Check environment variables
        const envCheck = {
            NODE_ENV: process.env.NODE_ENV,
            RESEND_API_KEY: process.env.RESEND_API_KEY ? 'SET' : 'NOT SET',
            FIREBASE_SERVICE_ACCOUNT_KEY: process.env.FIREBASE_SERVICE_ACCOUNT_KEY ? 'SET' : 'NOT SET',
            NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
            // Check if we can access the email service
            emailServiceAvailable: false,
            error: null
        };

        // Test if we can import the email service
        try {
            const { sendEmail } = await import('@/lib/email-service');
            envCheck.emailServiceAvailable = true;
        } catch (error) {
            envCheck.error = error instanceof Error ? error.message : 'Unknown error';
        }

        return NextResponse.json({
            success: true,
            environment: envCheck,
            timestamp: new Date().toISOString(),
            server: 'production'
        });

    } catch (error) {
        console.error('Debug production error:', error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}
