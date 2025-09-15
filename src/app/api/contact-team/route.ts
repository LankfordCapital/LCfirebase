import { NextRequest, NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userEmail, userName, subject, message, priority, context } = body;

    // Validate required fields
    if (!userEmail || !userName || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create email content
    const emailSubject = `[${priority.toUpperCase()}] Contact Request: ${subject}`;
    
    const emailContent = `
New contact request from Lankford Capital Platform:

User Information:
- Name: ${userName}
- Email: ${userEmail}
- Priority: ${priority.toUpperCase()}
${context ? `- Context: ${context}` : ''}

Subject: ${subject}

Message:
${message}

---
This message was sent from the Lankford Capital platform contact form.
Please respond directly to the user at: ${userEmail}
    `.trim();

    // Send email to info@lankfordcapital.com
    await sendEmail({
      to: ['info@lankfordcapital.com'],
      subject: emailSubject,
      text: emailContent,
      html: emailContent.replace(/\n/g, '<br>'),
    });

    // Send confirmation email to user
    const userConfirmationSubject = `Thank you for contacting Lankford Capital - ${subject}`;
    const userConfirmationContent = `
Dear ${userName},

Thank you for reaching out to Lankford Capital. We have received your message and will get back to you within 24 hours.

Your Message Details:
- Subject: ${subject}
- Priority: ${priority.toUpperCase()}
${context ? `- Context: ${context}` : ''}

Message:
${message}

We appreciate your interest in Lankford Capital and look forward to assisting you.

Best regards,
The Lankford Capital Team

---
This is an automated confirmation. Please do not reply to this email.
    `.trim();

    await sendEmail({
      to: [userEmail],
      subject: userConfirmationSubject,
      text: userConfirmationContent,
      html: userConfirmationContent.replace(/\n/g, '<br>'),
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Contact request sent successfully' 
    });

  } catch (error) {
    console.error('Contact team API error:', error);
    return NextResponse.json(
      { error: 'Failed to send contact request' },
      { status: 500 }
    );
  }
}
