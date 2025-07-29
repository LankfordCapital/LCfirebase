
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating various automated emails.
 * 
 * - generateEmail - An async function that takes user data and a scenario to draft an email.
 * - GenerateEmailInput - The input type for the function.
 * - GenerateEmailOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const UserProfileSchema = z.object({
  userId: z.string().describe('Unique identifier for the user.'),
  email: z.string().email().describe('The email address of the user (borrower or broker).'),
  fullName: z.string().describe('The full name of the user.'),
  role: z.enum(['borrower', 'broker']).describe('The role of the user.'),
  timeZone: z.string().describe('The timezone of the user (e.g., "America/New_York").'),
});

const GenerateEmailInputSchema = z.object({
    user: UserProfileSchema.describe('The user for whom the email is being generated.'),
    scenario: z.enum(['missingDocuments', 'appointmentConfirmation', 'loanApproval', 'adverseAction', 'custom'])
        .describe('The scenario for which the email is being generated.'),
    details: z.object({
        missingDocuments: z.array(z.string()).optional().describe('A list of documents that are still missing. Required for "missingDocuments" scenario.'),
        appointmentTime: z.string().optional().describe('The date and time of the appointment. Required for "appointmentConfirmation" scenario.'),
        loanDetails: z.string().optional().describe('Details about the approved loan (e.g., amount, property). Required for "loanApproval" scenario.'),
        adverseActionReason: z.string().optional().describe('The reason for the adverse action. Required for "adverseAction" scenario.'),
        customInstructions: z.string().optional().describe('Specific instructions for a custom email. Required for "custom" scenario.'),
    }).describe('Details specific to the chosen scenario.'),
});
export type GenerateEmailInput = z.infer<typeof GenerateEmailInputSchema>;

const EmailDraftSchema = z.object({
    to: z.string().email().describe('The recipient\'s email address.'),
    subject: z.string().describe('The subject line of the email.'),
    body: z.string().describe('The HTML body content of the email.'),
});

const GenerateEmailOutputSchema = z.object({
    draftedEmail: EmailDraftSchema.describe('The drafted email.'),
});
export type GenerateEmailOutput = z.infer<typeof GenerateEmailOutputSchema>;


export async function generateEmail(input: GenerateEmailInput): Promise<GenerateEmailOutput> {
    return emailAutomationFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateEmailPrompt',
    input: { schema: GenerateEmailInputSchema },
    output: { schema: GenerateEmailOutputSchema },
    prompt: `You are an AI assistant for Lankford Capital responsible for drafting professional emails.

Your task is to generate a personalized and professional email draft based on the provided user profile and scenario.

Address the user by their full name. The tone should be professional and helpful.

**User Data:**
- User ID: {{{user.userId}}}
  - Name: {{{user.fullName}}}
  - Email: {{{user.email}}}
  - Role: {{{user.role}}}
  - Timezone: {{{user.timeZone}}}

**Email Scenario: {{{scenario}}}**

{{#if (eq scenario "missingDocuments")}}
**Subject: Action Required on Your Loan Application**
**Body:**
Draft an email reminding the user of the following missing documents:
{{#each details.missingDocuments}}
- {{{this}}}
{{/each}}
Please ask them to upload these documents to the portal as soon as possible to continue with their application.
{{/if}}

{{#if (eq scenario "appointmentConfirmation")}}
**Subject: Appointment Confirmed with Lankford Capital**
**Body:**
Draft an email confirming an appointment scheduled for **{{details.appointmentTime}}**. Include details on how to join or what to prepare.
{{/if}}

{{#if (eq scenario "loanApproval")}}
**Subject: Congratulations! Your Loan Has Been Approved**
**Body:**
Draft an email congratulating the user on their loan approval. Include the following details: {{{details.loanDetails}}}. Mention that a loan officer will be in touch with the next steps.
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

Generate the final email and return it in the 'draftedEmail' field.
`,
});

const emailAutomationFlow = ai.defineFlow(
    {
        name: 'emailAutomationFlow',
        inputSchema: GenerateEmailInputSchema,
        outputSchema: GenerateEmailOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
