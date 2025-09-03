'use server';

import Mailgun from 'mailgun.js';
import FormData from 'form-data';

// Initialize Mailgun client
function getMailgunClient() {
    const mailgun = new Mailgun(FormData);
    return mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY || '',
        url: 'https://api.mailgun.net'
    });
}

interface MailPayload {
    to: string[];
    from?: string;
    cc?: string[];
    bcc?: string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    tags?: string[];
    variables?: Record<string, string>;
}

/**
 * Sends an email using Mailgun service.
 * @param payload The email payload.
 * @returns The result from Mailgun API.
 */
export async function sendEmail(payload: MailPayload): Promise<any> {
    try {
        if (!process.env.MAILGUN_API_KEY) {
            throw new Error('MAILGUN_API_KEY environment variable is required');
        }
        
        const domain = process.env.MAILGUN_DOMAIN;
        if (!domain) {
            throw new Error('MAILGUN_DOMAIN environment variable is required');
        }

        const emailData = {
            from: payload.from || `Lankford Lending <noreply@${domain}>`,
            to: payload.to,
            cc: payload.cc,
            bcc: payload.bcc,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
            'h:Reply-To': payload.replyTo,
            'o:tag': payload.tags,
            'v:variables': payload.variables
        };

        const mg = getMailgunClient();
        const result = await mg.messages.create(domain, emailData);

        console.log('Email sent successfully via Mailgun:', result);
        return result;
    } catch (error) {
        console.error('Error sending email with Mailgun:', error);
        throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Sends a simple text email
 */
export async function sendSimpleEmail(to: string, subject: string, text: string): Promise<any> {
    return sendEmail({
        to: [to],
        subject,
        text,
        html: `<p>${text.replace(/\n/g, '<br>')}</p>`
    });
}

/**
 * Sends an HTML email with template variables
 */
export async function sendTemplateEmail(
    to: string, 
    subject: string, 
    template: string, 
    variables: Record<string, string> = {}
): Promise<any> {
    // Simple template replacement
    let html = template;
    Object.entries(variables).forEach(([key, value]) => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, value);
    });

    return sendEmail({
        to: [to],
        subject,
        html,
        text: html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
        variables
    });
}

/**
 * Sends a bulk email to multiple recipients
 */
export async function sendBulkEmail(
    recipients: string[],
    subject: string,
    html: string,
    text?: string
): Promise<any> {
    return sendEmail({
        to: recipients,
        subject,
        html,
        text
    });
}

/**
 * Sends an email with attachments (for future use)
 */
export async function sendEmailWithAttachments(
    payload: MailPayload & { attachments?: Array<{ filename: string; data: Buffer; contentType?: string }> }
): Promise<any> {
    try {
        const domain = process.env.MAILGUN_DOMAIN;
        if (!domain) {
            throw new Error('MAILGUN_DOMAIN environment variable is required');
        }

        const emailData: any = {
            from: payload.from || `Lankford Lending <noreply@${domain}>`,
            to: payload.to,
            cc: payload.cc,
            bcc: payload.bcc,
            subject: payload.subject,
            html: payload.html,
            text: payload.text,
            'h:Reply-To': payload.replyTo,
            'o:tag': payload.tags,
            'v:variables': payload.variables
        };

        // Add attachments if provided
        if (payload.attachments) {
            payload.attachments.forEach((attachment, index) => {
                emailData[`attachment[${index}]`] = {
                    filename: attachment.filename,
                    data: attachment.data,
                    contentType: attachment.contentType
                };
            });
        }

        const mg = getMailgunClient();
        const result = await mg.messages.create(domain, emailData);
        console.log('Email with attachments sent successfully via Mailgun:', result);
        return result;
    } catch (error) {
        console.error('Error sending email with attachments via Mailgun:', error);
        throw new Error(`Failed to send email with attachments: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Validates email address format
 */
export async function isValidEmail(email: string): Promise<boolean> {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Gets Mailgun domain status
 */
export async function getDomainStatus(): Promise<any> {
    try {
        if (!process.env.MAILGUN_API_KEY) {
            throw new Error('MAILGUN_API_KEY environment variable is required');
        }
        
        const domain = process.env.MAILGUN_DOMAIN;
        if (!domain) {
            throw new Error('MAILGUN_DOMAIN environment variable is required');
        }

        const mg = getMailgunClient();
        const result = await mg.domains.get(domain);
        return result;
    } catch (error) {
        console.error('Error getting domain status:', error);
        throw new Error(`Failed to get domain status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}
