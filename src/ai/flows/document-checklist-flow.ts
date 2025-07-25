'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a document checklist for a specific loan program.
 *
 * - getDocumentChecklist - An async function that takes a loan program and returns a categorized document checklist.
 * - GetDocumentChecklistInput - The input type for the getDocumentChecklist function.
 * - GetDocumentChecklistOutput - The return type for the getDocumentChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { loanProgramDocumentLists } from '@/lib/document-lists';

const GetDocumentChecklistInputSchema = z.object({
  loanProgram: z.string().describe('The selected loan program (e.g., Ground Up Construction, Fix and Flip, DSCR).'),
});
export type GetDocumentChecklistInput = z.infer<typeof GetDocumentChecklistInputSchema>;

const DocumentChecklistSchema = z.object({
    borrower: z.array(z.string()).describe('List of documents related to the borrower.'),
    company: z.array(z.string()).describe('List of documents related to the company.'),
    subjectProperty: z.array(z.string()).describe('List of documents related to the subject property.'),
});

const GetDocumentChecklistOutputSchema = z.object({
  documentRequestList: DocumentChecklistSchema.describe('A categorized list of all documents required to close the loan, specific to the selected loan program.'),
});
export type GetDocumentChecklistOutput = z.infer<typeof GetDocumentChecklistOutputSchema>;

export async function getDocumentChecklist(input: GetDocumentChecklistInput): Promise<GetDocumentChecklistOutput> {
  return getDocumentChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDocumentChecklistPrompt',
  input: {schema: z.object({
    loanProgram: z.string(),
    documentList: DocumentChecklistSchema,
  })},
  output: {schema: GetDocumentChecklistOutputSchema},
  prompt: `You are an AI assistant that generates a categorized list of required documents for a specific loan program. The loan program is {{{loanProgram}}}.

Based on the provided document list for the program, generate a full list of required documents and populate it in the 'documentRequestList' field.
The documents in the 'documentRequestList' field MUST be categorized into 'borrower', 'company', and 'subjectProperty'.

**Important Conditional Logic:**
- Only include "Approved or Pre-approved Plans" and "Approved Permits (if available)" in the 'subjectProperty' list if the loan program contains 'Ground Up Construction'.

**Document List for {{loanProgram}}:**
Borrower: {{#each documentList.borrower}}- {{{this}}} {{/each}}
Company: {{#each documentList.company}}- {{{this}}} {{/each}}
Subject Property: {{#each documentList.subjectProperty}}- {{{this}}} {{/each}}
`,
});

const getDocumentChecklistFlow = ai.defineFlow(
  {
    name: 'getDocumentChecklistFlow',
    inputSchema: GetDocumentChecklistInputSchema,
    outputSchema: GetDocumentChecklistOutputSchema,
  },
  async input => {
    const documentList = loanProgramDocumentLists[input.loanProgram as keyof typeof loanProgramDocumentLists] || loanProgramDocumentLists['Default'];
    
    const {output} = await prompt({
      loanProgram: input.loanProgram,
      documentList: documentList
    });
    return output!;
  }
);
