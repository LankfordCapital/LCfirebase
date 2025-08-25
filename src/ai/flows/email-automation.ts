
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating and sending various automated emails.
 * 
 * - generateEmail - An async function that takes user data and a scenario to draft an email.
 * - GenerateEmailInput - The input type for the function.
 * - GenerateEmailOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { loanProgramDocumentLists } from '@/lib/document-lists';
import { sendEmail } from '@/lib/email-service';

const UserProfileSchema = z.object({
  userId: z.string().describe('Unique identifier for the user.'),
  email: z.string().email().describe('The email address of the user (borrower or broker).'),
  fullName: z.string().describe('The full name of the user.'),
  role: z.enum(['borrower', 'broker']).describe('The role of the user.'),
  timeZone: z.string().describe('The timezone of the user (e.g., "America/New_York").'),
});

const BrokerProfileSchema = z.object({
    userId: z.string().describe('Unique identifier for the broker.'),
    email: z.string().email().describe('The email address of the broker.'),
    fullName: z.string().describe('The full name of the broker.'),
    role: z.literal('broker').describe('The role of the user.'),
});


const GenerateEmailInputSchema = z.object({
    recipient: UserProfileSchema.describe('The user (borrower or broker) for whom the email is being generated.'),
    fromWorkforceName: z.string().describe('The name of the Lankford Capital workforce member sending the email.'),
    scenario: z.enum(['missingDocuments', 'appointmentConfirmation', 'loanApproval', 'adverseAction', 'custom'])
        .describe('The scenario for which the email is being generated.'),
    details: z.object({
        loanProgram: z.string().optional().describe('The loan program, required for "missingDocuments" scenario to determine the checklist.'),
        uploadedDocumentNames: z.array(z.string()).optional().describe('A list of filenames for documents already uploaded by the user.'),
        appointmentTime: z.string().optional().describe('The date and time of the appointment. Required for "appointmentConfirmation" scenario.'),
        loanDetails: z.string().optional().describe('Details about the approved loan (e.g., amount, property). Required for "loanApproval" scenario.'),
        adverseActionReason: z.string().optional().describe('The reason for the adverse action. Required for "adverseAction" scenario.'),
        customInstructions: z.string().optional().describe('Specific instructions for a custom email. Required for "custom" scenario.'),
    }).describe('Details specific to the chosen scenario.'),
    ccBroker: z.boolean().optional().describe('Whether to CC the associated broker on the email.'),
    broker: BrokerProfileSchema.optional().describe('The associated broker\'s profile, required if ccBroker is true.'),
});
export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

const EmailDraftSchema = z.object({
    to: z.string().email().describe('The recipient\'s email address.'),
    cc: z.string().email().optional().describe('The CC recipient\'s email address.'),
    subject: z.string().describe('The subject line of the email.'),
    body: z.string().describe('The HTML body content of the email.'),
});

const GenerateEmailOutputSchema = z.object({
    draftedEmail: EmailDraftSchema.describe('The drafted email.'),
    sendRecordId: z.string().optional().describe('The ID of the created record in the mail collection in Firestore.'),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;


export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
    return emailAutomationFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateEmailPrompt',
    input: { schema: GenerateEmailInputSchema },
    output: { schema: z.object({ draftedEmail: EmailDraftSchema }) }, // Prompt only generates the draft
    prompt: `You are an AI assistant for Lankford Capital responsible for drafting professional emails.

Your task is to generate a personalized and professional email draft based on the provided recipient profile and scenario.

Address the recipient by their full name. The tone should be professional and helpful. Sign the email from "{{fromWorkforceName}}".

**Recipient Data:**
- User ID: {{{recipient.userId}}}
  - Name: {{{recipient.fullName}}}
  - Email: {{{recipient.email}}}
  - Role: {{{recipient.role}}}
  - Timezone: {{{recipient.timeZone}}}

**Email Scenario: {{{scenario}}}**

{{#if (eq scenario "missingDocuments")}}
**Subject: Action Required on Your Loan Application**
**Body:**
Draft an email reminding the recipient of the following missing documents for their {{details.loanProgram}} application:
{{#each details.missingDocuments}}
- {{{this}}}
{{/each}}
Please ask them to upload these documents to the portal as soon as possible to continue with their application.
{{/if}}

{{#if (eq scenario "appointmentConfirmation")}}
**Subject: Appointment Confirmed with Lankford Capital**
**Body:**
Draft an email confirming an appointment scheduled for **{{{details.appointmentTime}}}**. Include details on how to join or what to prepare.
{{/if}}

{{#if (eq scenario "loanApproval")}}
**Subject: Congratulations! Your Loan Has Been Approved**
**Body:**
Draft an email congratulating the recipient on their loan approval. Include the following details: {{{details.loanDetails}}}. Mention that a loan officer will be in touch with the next steps.
{{/if}}

{{#if (eq scenario "adverseAction")}}
**Subject: Update on Your Recent Loan Application**
**Body:**
Draft a formal adverse action notice. State that after careful review, we are unable to approve the application at this time.
**Reason:** {{{details.adverseActionReason}}}
The email should be compliant with fair lending practices, respectful, and provide a point of contact for questions.
{{/if}}

{{#if (eq scenario "custom")}}
**Subject: A Message from Lankford Capital**
**Body:**
Draft a custom email based on the following instructions:
{{{details.customInstructions}}}
{{/if}}

Generate the final email and return it in the 'draftedEmail' field. Do not populate the CC field in your response, it will be handled by the system.
`,
});

const emailAutomationFlow = ai.defineFlow(
    {
        name: 'emailAutomationFlow',
        inputSchema: GenerateEmailInputSchema,
        outputSchema: GenerateEmailOutputSchema,
    },
    async (input) => {

        if (input.scenario === 'missingDocuments' && input.details.loanProgram) {
            const fullChecklist = loanProgramDocumentLists[input.details.loanProgram as keyof typeof loanProgramDocumentLists] || loanProgramDocumentLists['Default'];
            const allRequiredDocs = [...fullChecklist.borrower, ...fullChecklist.company, ...fullChecklist.subjectProperty];
            const uploadedDocs = new Set(input.details.uploadedDocumentNames || []);
            const missingDocs = allRequiredDocs.filter(doc => !uploadedDocs.has(doc));
            
            // @ts-ignore - Dynamically adding missingDocuments to the prompt details
            input.details.missingDocuments = missingDocs;
        }

        const { output } = await prompt(input);
        const draftedEmail = output!.draftedEmail;

        if (input.ccBroker && input.broker) {
            draftedEmail.cc = input.broker.email;
        }
        
        // Send the email by writing to Firestore
        const sendRecordId = await sendEmail({
            to: [draftedEmail.to],
            cc: draftedEmail.cc ? [draftedEmail.cc] : undefined,
            subject: draftedEmail.subject,
            html: draftedEmail.body,
        });

        return {
            draftedEmail,
            sendRecordId,
        };
    }
);
