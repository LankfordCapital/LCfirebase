
'use server';

/**
 * @fileOverview This file defines a Genkit flow for sending automated email reminders about missing documents.
 * 
 * - generateMissingDocumentReminders - An async function that takes user data and drafts reminder emails.
 * - GenerateMissingDocumentRemindersInput - The input type for the function.
 * - GenerateMissingDocumentRemindersOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const UserProfileSchema = z.object({
  userId: z.string().describe('Unique identifier for the user.'),
  email: z.string().email().describe('The email address of the user (borrower or broker).'),
  fullName: z.string().describe('The full name of the user.'),
  role: z.enum(['borrower', 'broker']).describe('The role of the user.'),
  timeZone: z.string().describe('The timezone of the user (e.g., "America/New_York").'),
  missingDocuments: z.array(z.string()).describe('A list of documents that are still missing from their checklist.'),
});

const GenerateMissingDocumentRemindersInputSchema = z.object({
  users: z.array(UserProfileSchema).describe('A list of users who need to be checked for missing documents.'),
});
export type GenerateMissingDocumentRemindersInput = z.infer<typeof GenerateMissingDocumentRemindersInputSchema>;

const EmailDraftSchema = z.object({
    to: z.string().email().describe('The recipient\'s email address.'),
    subject: z.string().describe('The subject line of the email.'),
    body: z.string().describe('The HTML body content of the email.'),
});

const GenerateMissingDocumentRemindersOutputSchema = z.object({
    draftedEmails: z.array(EmailDraftSchema).describe('A list of drafted email reminders.'),
});
export type GenerateMissingDocumentRemindersOutput = z.infer<typeof GenerateMissingDocumentRemindersOutputSchema>;


export async function generateMissingDocumentReminders(input: GenerateMissingDocumentRemindersInput): Promise<GenerateMissingDocumentRemindersOutput> {
    return emailAutomationFlow(input);
}


const prompt = ai.definePrompt({
    name: 'generateEmailReminderPrompt',
    input: { schema: GenerateMissingDocumentRemindersInputSchema },
    output: { schema: GenerateMissingDocumentRemindersOutputSchema },
    prompt: `You are an AI assistant for Lankford Capital responsible for sending document reminders.

Your task is to generate personalized and professional email drafts for each user in the provided list who has missing documents.

The current time and date will determine if it's a morning or evening reminder.
- If it's before 12:00 PM in the user's timezone, the subject should be "Morning Reminder: Action Required on Your Loan Application".
- If it's 12:00 PM or later in the user's timezone, the subject should be "Evening Reminder: Action Required on Your Loan Application".

The email body should be friendly, clear, and list the specific documents that are still required. Address the user by their full name.

Generate one email draft for each user that has one or more missing documents. If a user has no missing documents, do not generate an email for them.

User Data:
{{#each users}}
- User ID: {{{userId}}}
  - Name: {{{fullName}}}
  - Email: {{{email}}}
  - Role: {{{role}}}
  - Timezone: {{{timeZone}}}
  - Missing Documents:
    {{#each missingDocuments}}
    - {{{this}}}
    {{/each}}
{{/each}}
`,
});

const emailAutomationFlow = ai.defineFlow(
    {
        name: 'emailAutomationFlow',
        inputSchema: GenerateMissingDocumentRemindersInputSchema,
        outputSchema: GenerateMissingDocumentRemindersOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
