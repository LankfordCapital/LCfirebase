import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({
        RESEND_API_KEY: process.env.RESEND_API_KEY ? 'Set' : 'Not set',
        MAILGUN_API_KEY: process.env.MAILGUN_API_KEY ? 'Set' : 'Not set',
        MAILGUN_DOMAIN: process.env.MAILGUN_DOMAIN ? 'Set' : 'Not set',
        NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || 'Not set'
    });
}
