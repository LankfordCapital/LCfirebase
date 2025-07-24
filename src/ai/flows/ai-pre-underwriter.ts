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
});
export type AiPreUnderwriterInput = z.infer<typeof AiPreUnderwriterInputSchema>;

const AiPreUnderwriterOutputSchema = z.object({
  prequalificationStatus: z.string().describe('The prequalification status based on the provided information (e.g., Prequalified, Needs Review, Not Prequalified).'),
  missingDocuments: z.array(z.string()).describe('A list of required documents that are missing from the uploadedDocuments array.'),
  potentialIssues: z.array(z.string()).describe('A list of potential issues identified during the pre-underwriting process.'),
  documentRequestList: z.array(z.string()).describe('A list of documents required to close the loan.'),
});
export type AiPreUnderwriterOutput = z.infer<typeof AiPreUnderwriterOutputSchema>;

export async function aiPreUnderwriter(input: AiPreUnderwriterInput): Promise<AiPreUnderwriterOutput> {
  return aiPreUnderwriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPreUnderwriterPrompt',
  input: {schema: AiPreUnderwriterInputSchema},
  output: {schema: AiPreUnderwriterOutputSchema},
  prompt: `You are an AI underwriter that specializes in pre-underwriting files and providing prequalifications and document request lists based on the selected loan program and the documents provided. The loan program is {{{loanProgram}}}.

You will analyze the provided documents to determine a prequalification status, identify any missing documents, and list any potential issues. Based on the loan program that is selected, and the documents that we need to close it, you will list the required documents.

Uploaded Documents:
{{#each uploadedDocuments}}
  - Filename: {{{filename}}}
{{/each}}

Output:
- prequalificationStatus: The prequalification status based on the provided information (e.g., Prequalified, Needs Review, Not Prequalified).
- missingDocuments: A list of required documents that are missing from the uploadedDocuments array.
- potentialIssues: A list of potential issues identified during the pre-underwriting process.
- documentRequestList: A list of documents required to close the loan.
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
