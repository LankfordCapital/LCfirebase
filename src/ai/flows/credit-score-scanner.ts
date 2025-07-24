'use server';

/**
 * @fileOverview An AI agent to scan a credit report and extract scores.
 *
 * - scanCreditReport - A function that handles the credit report scanning process.
 * - ScanCreditReportInput - The input type for the scanCreditReport function.
 * - ScanCreditReportOutput - The return type for the scanCreditReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanCreditReportInputSchema = z.object({
  creditReportDataUri: z
    .string()
    .describe(
      "A credit report document, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanCreditReportInput = z.infer<typeof ScanCreditReportInputSchema>;

const ScanCreditReportOutputSchema = z.object({
  equifaxScore: z.string().describe('The credit score from Equifax.'),
  experianScore: z.string().describe('The credit score from Experian.'),
  transunionScore: z.string().describe('The credit score from TransUnion.'),
});
export type ScanCreditReportOutput = z.infer<typeof ScanCreditReportOutputSchema>;

export async function scanCreditReport(input: ScanCreditReportInput): Promise<ScanCreditReportOutput> {
  return scanCreditReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanCreditReportPrompt',
  input: {schema: ScanCreditReportInputSchema},
  output: {schema: ScanCreditReportOutputSchema},
  prompt: `You are an expert financial data extraction tool. Your task is to scan the provided credit report document and extract the credit scores for Equifax, Experian, and TransUnion.

Analyze the document content and identify the three credit scores. Return them in the specified JSON format. If a score for a specific bureau cannot be found, return "N/A".

Credit Report: {{media url=creditReportDataUri}}`,
});

const scanCreditReportFlow = ai.defineFlow(
  {
    name: 'scanCreditReportFlow',
    inputSchema: ScanCreditReportInputSchema,
    outputSchema: ScanCreditReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
