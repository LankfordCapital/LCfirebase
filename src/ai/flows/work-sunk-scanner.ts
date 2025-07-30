
'use server';

/**
 * @fileOverview An AI agent to scan a Work Sunk Report and extract the total cost.
 *
 * - scanWorkSunkReport - A function that handles the report scanning process.
 * - ScanWorkSunkReportInput - The input type for the function.
 * - ScanWorkSunkReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanWorkSunkReportInputSchema = z.object({
  reportDataUri: z
    .string()
    .describe(
      "A work sunk report document (e.g., PDF, Word, Excel), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanWorkSunkReportInput = z.infer<typeof ScanWorkSunkReportInputSchema>;

const ScanWorkSunkReportOutputSchema = z.object({
  totalSunkCost: z.number().describe('The total cost of all line items in the work sunk report. This should be a single number representing the sum of all costs for work already completed and paid for.'),
});
export type ScanWorkSunkReportOutput = z.infer<typeof ScanWorkSunkReportOutputSchema>;

export async function scanWorkSunkReport(input: ScanWorkSunkReportInput): Promise<ScanWorkSunkReportOutput> {
  return scanWorkSunkReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanWorkSunkReportPrompt',
  input: {schema: ScanWorkSunkReportInputSchema},
  output: {schema: ScanWorkSunkReportOutputSchema},
  prompt: `You are an expert construction cost analyst. Your task is to scan the provided Work Sunk Report, which details work that has already been completed and paid for.

Analyze the document content, identify all cost or amount line items, and sum them up to calculate the total cost of the work sunk.

Return the final calculated total in the specified JSON format.

Work Sunk Report: {{media url=reportDataUri}}`,
});

const scanWorkSunkReportFlow = ai.defineFlow(
  {
    name: 'scanWorkSunkReportFlow',
    inputSchema: ScanWorkSunkReportInputSchema,
    outputSchema: ScanWorkSunkReportOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
