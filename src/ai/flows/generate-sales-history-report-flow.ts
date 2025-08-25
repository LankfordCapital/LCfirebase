
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a property sales history report.
 * 
 * - generateSalesHistoryReport - An async function that takes a property address and returns its sales history.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateSalesHistoryReportInputSchema, GenerateSalesHistoryReportOutputSchema, type GenerateSalesHistoryReportInput, type GenerateSalesHistoryReportOutput } from './sales-history-report-types';

export async function generateSalesHistoryReport(input: GenerateSalesHistoryReportInput): Promise<GenerateSalesHistoryReportOutput> {
    return salesHistoryReportFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateSalesHistoryReportPrompt',
    input: { schema: GenerateSalesHistoryReportInputSchema },
    output: { schema: GenerateSalesHistoryReportOutputSchema },
    prompt: `You are an expert real estate title researcher. Your task is to generate a sales history report for the given property address.

Use your knowledge of public records and real estate data to find and list the previous sales of this property.

**Subject Property Address:** {{{subjectPropertyAddress}}}

For each recorded sale, please provide:
- Sale Date
- Sale Price
- Parties Involved (if available)
- Any other relevant notes (e.g., type of sale, if it was distressed)

Please generate the sales history report. If no sales history can be found, please state that.
`,
});

const salesHistoryReportFlow = ai.defineFlow(
    {
        name: 'salesHistoryReportFlow',
        inputSchema: GenerateSalesHistoryReportInputSchema,
        outputSchema: GenerateSalesHistoryReportOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
