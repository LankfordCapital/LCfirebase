'use server';

/**
 * @fileOverview An AI agent to scan an asset statement and extract the balance.
 *
 * - scanAssetStatement - A function that handles the asset statement scanning process.
 * - ScanAssetStatementInput - The input type for the scanAssetStatement function.
 * - ScanAssetStatementOutput - The return type for the scanAssetStatement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScanAssetStatementInputSchema = z.object({
  statementDataUri: z
    .string()
    .describe(
      "An asset statement document (e.g., bank statement), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ScanAssetStatementInput = z.infer<typeof ScanAssetStatementInputSchema>;

const ScanAssetStatementOutputSchema = z.object({
  balance: z.string().describe('The most recent account balance found on the statement. Should be formatted as a currency string (e.g., "$12,345.67").'),
});
export type ScanAssetStatementOutput = z.infer<typeof ScanAssetStatementOutputSchema>;

export async function scanAssetStatement(input: ScanAssetStatementInput): Promise<ScanAssetStatementOutput> {
  return scanAssetStatementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'scanAssetStatementPrompt',
  input: {schema: ScanAssetStatementInputSchema},
  output: {schema: ScanAssetStatementOutputSchema},
  prompt: `You are an expert financial data extraction tool. Your task is to scan the provided asset statement document and extract the most recent balance. If multiple statements are provided, identify the one with the latest date. Look for terms like "Ending Balance", "Current Balance", or the last balance listed in a transaction history.

Analyze the document content and identify the most recent balance from the latest statement. Return it in the specified JSON format. If a balance cannot be found, return "N/A".

Asset Statement: {{media url=statementDataUri}}`,
});

const scanAssetStatementFlow = ai.defineFlow(
  {
    name: 'scanAssetStatementFlow',
    inputSchema: ScanAssetStatementInputSchema,
    outputSchema: ScanAssetStatementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
