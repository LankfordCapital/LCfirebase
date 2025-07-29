
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating customized documents from templates.
 *
 * - generateDocument - An async function that takes a template and data to generate a document.
 * - GenerateDocumentInput - The input type for the function.
 * - GenerateDocumentOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const UserProfileSchema = z.object({
  fullName: z.string().describe('The full name of the user.'),
  email: z.string().email().describe('The email address of the user.'),
  // Add other relevant user fields here if needed
});

const CustomTermSchema = z.object({
    key: z.string(),
    value: z.string(),
});

const GenerateDocumentInputSchema = z.object({
    templateContent: z.string().describe('The full text content of the document template. Placeholders should be clearly marked, e.g., [Borrower Name].'),
    borrower: UserProfileSchema.describe('The profile of the borrower.'),
    broker: UserProfileSchema.optional().describe('The profile of the broker, if applicable.'),
    customTerms: z.array(CustomTermSchema).describe('An array of key-value pairs for custom terms to be inserted into the document.'),
});
export type GenerateDocumentInput = z.infer<typeof GenerateDocumentInputSchema>;


const GenerateDocumentOutputSchema = z.object({
    generatedDocument: z.string().describe('The final, customized document with all placeholders filled in.'),
});
export type GenerateDocumentOutput = z.infer<typeof GenerateDocumentOutputSchema>;

export async function generateDocument(input: GenerateDocumentInput): Promise<GenerateDocumentOutput> {
    return documentGeneratorFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateDocumentPrompt',
    input: { schema: GenerateDocumentInputSchema },
    output: { schema: GenerateDocumentOutputSchema },
    prompt: `You are an expert AI paralegal. Your task is to take a document template and fill it in with the provided information about the borrower, broker, and custom loan terms.

Carefully review the template and replace all placeholders (like [Borrower Name], [Loan Amount], etc.) with the corresponding data provided below. Ensure the final document is accurate and professionally formatted.

**Document Template:**
---
{{{templateContent}}}
---

**Data to Insert:**

**Borrower:**
- Full Name: {{{borrower.fullName}}}
- Email: {{{borrower.email}}}

{{#if broker}}
**Broker:**
- Full Name: {{{broker.fullName}}}
- Email: {{{broker.email}}}
{{/if}}

**Custom Loan Terms:**
{{#each customTerms}}
- {{{key}}}: {{{value}}}
{{/each}}

Please generate the final document.
`,
});

const documentGeneratorFlow = ai.defineFlow(
    {
        name: 'documentGeneratorFlow',
        inputSchema: GenerateDocumentInputSchema,
        outputSchema: GenerateDocumentOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
