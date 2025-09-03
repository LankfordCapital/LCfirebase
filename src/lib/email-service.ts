
'use server';

import { Resend } from 'resend';

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

interface MailPayload {
    to: string[];
    from?: string;
    cc?: string[];
    bcc?: string[];
    subject: string;
    html: string;
    text?: string;
}

/**
 * Sends an email using Resend service.
 * Much simpler than Firebase extensions and more reliable.
 * @param payload The email payload.
 * @returns The result from Resend API.
 */
export async function sendEmail(payload: MailPayload): Promise<any> {
    try {
        const result = await resend.emails.send({
            from: payload.from || 'Lankford Lending <noreply@lankfordcapital.com>',
            to: payload.to,
            cc: payload.cc,
            bcc: payload.bcc,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
        });

        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email with Resend:', error);
        throw new Error('Failed to send email.');
    }
}

/**
 * Sends a simple text email
 */
export async function sendSimpleEmail(to: string, subject: string, text: string): Promise<any> {
    return sendEmail({
        to: [to],
        subject,
        html: `<p>${text}</p>`,
        text,
    });
}

/**
 * Sends an HTML email with a template
 */
export async function sendTemplateEmail(to: string, subject: string, template: string, data: Record<string, any>): Promise<any> {
    // Simple template replacement
    let html = template;
    Object.entries(data).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return sendEmail({
        to: [to],
        subject,
        html,
    });
}
