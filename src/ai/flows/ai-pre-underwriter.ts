'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered pre-underwriting of loan applications.
 *
 * - aiPreUnderwriter - An async function that takes loan program details and uploaded documents, and returns a pre-underwriting analysis.
 * - AiPreUnderwriterInput - The input type for the aiPreUnderwriter function.
 * - AiPreUnderwriterOutput - The return type for the aiPreUnderwriter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPreUnderwriterInputSchema = z.object({
  loanProgram: z.string().describe('The selected loan program (e.g., Ground Up Construction, Fix and Flip, DSCR).'),
  uploadedDocuments: z.array(z.object({
    filename: z.string().describe('The name of the uploaded document.'),
    dataUri: z.string().describe("The document data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  })).describe('An array of uploaded documents, including their filenames and data URIs.'),
   documentRequestList: z.object({
      borrower: z.array(z.string()),
      company: z.array(z.string()),
      subjectProperty: z.array(z.string()),
    }).describe('A categorized list of all documents required to close the loan, specific to the selected loan program.'),
});
export type AiPreUnderwriterInput = z.infer<typeof AiPreUnderwriterInputSchema>;

const DocumentChecklistSchema = z.object({
    borrower: z.array(z.string()).describe('List of documents related to the borrower.'),
    company: z.array(z.string()).describe('List of documents related to the company.'),
    subjectProperty: z.array(z.string()).describe('List of documents related to the subject property.'),
});

const AiPreUnderwriterOutputSchema = z.object({
  prequalificationStatus: z.string().describe('The prequalification status based on the provided information (e.g., Prequalified, Needs Review, Not Prequalified).'),
  missingDocuments: DocumentChecklistSchema.describe('A categorized list of required documents that are missing from the uploadedDocuments array.'),
  potentialIssues: z.array(z.string()).describe('A list of potential issues identified during the pre-underwriting process.'),
});
export type AiPreUnderwriterOutput = z.infer<typeof AiPreUnderwriterOutputSchema>;

export async function aiPreUnderwriter(input: AiPreUnderwriterInput): Promise<AiPreUnderwriterOutput> {
  return aiPreUnderwriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPreUnderwriterPrompt',
  input: {schema: AiPreUnderwriterInputSchema},
  output: {schema: AiPreUnderwriterOutputSchema},
  prompt: `You are an AI underwriter that specializes in pre-underwriting files. Your task is to determine a prequalification status, identify missing documents, and flag potential issues based on the provided loan program, a list of required documents, and the documents the user has uploaded.

The selected loan program is: {{{loanProgram}}}.

First, analyze the provided documents to determine a prequalification status.

Next, compare the filenames of the uploaded documents against the full 'documentRequestList' provided in the input. Identify any missing documents from the request list and populate the 'missingDocuments' field with a categorized list of the documents that were required but not uploaded. The categories are 'borrower', 'company', and 'subjectProperty'.

Finally, review the content of the uploaded documents for any potential issues or red flags (e.g., inconsistencies, low balances, incomplete information) and list them in the 'potentialIssues' field.

Full Document Request List:
Borrower: {{#each documentRequestList.borrower}}- {{{this}}} {{/each}}
Company: {{#each documentRequestList.company}}- {{{this}}} {{/each}}
Subject Property: {{#each documentRequestList.subjectProperty}}- {{{this}}} {{/each}}

Uploaded Documents:
{{#each uploadedDocuments}}
  - Filename: {{{filename}}}
    - Document: {{media url=dataUri}}
{{/each}}
`,
});

const aiPreUnderwriterFlow = ai.defineFlow(
  {
    name: 'aiPreUnderwriterFlow',
    inputSchema: AiPreUnderwriterInputSchema,
    outputSchema: AiPreUnderwriterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
