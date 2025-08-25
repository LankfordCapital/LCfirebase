
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a comparable property analysis report.
 * 
 * - generateComparablePropertyReport - An async function that takes project details and returns a market comparison report.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateComparablePropertyReportInputSchema, GenerateComparablePropertyReportOutputSchema, type GenerateComparablePropertyReportInput, type GenerateComparablePropertyReportOutput } from './comparable-property-report-types';

export async function generateComparablePropertyReport(input: GenerateComparablePropertyReportInput): Promise<GenerateComparablePropertyReportOutput> {
    return comparablePropertyReportFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateComparablePropertyReportPrompt',
    input: { schema: GenerateComparablePropertyReportInputSchema },
    output: { schema: GenerateComparablePropertyReportOutputSchema },
    prompt: `You are an expert real estate appraiser and market analyst. Your task is to generate a comprehensive comparable property report based on the subject property's address, type, and its provided proforma/projections.

**Analysis Steps:**

1.  **Comparable Sales Analysis:**
    -   Identify at least 3-5 recent, relevant comparable sales ("comps") in the immediate vicinity, following standard appraisal principles (similar size, age, condition, property type).
    -   For each comp, provide: Address, Sale Price, Sale Date, Square Footage, Price per Square Foot, Number of Units, Lot Size, Year Built, Amenities, and Days on Market.
    -   Provide a summary of the sales comparison analysis, including average days on market, and conclude with an estimated value for the subject property based on this data.

2.  **Rental Market Analysis:**
    -   Identify at least 3-5 current, relevant rental listings ("rental comps") in the immediate vicinity.
    -   For each rental comp, provide: Address, Monthly Rent, Square Footage, Rent per Square Foot, Number of Units, Lot Size, Year Built, and Amenities.
    -   Analyze and report on the typical:
        -   Vacancy rates and overall occupancy rates for this property type in the area.
        -   Operating expense ratios (as a percentage of gross income).
        -   Common rental concessions and lease-up loss estimates (e.g., "one month free," "tenant improvement allowances").
        -   Average days on market for rentals.

3.  **Proforma vs. Market Analysis:**
    -   Critically compare the user-provided proforma against the market data you have gathered.
    -   Is the projected rental income consistent with the market? Provide a percentage difference (e.g., "Projected rents are 5% above market average").
    -   Are the projected expenses realistic compared to the typical expense ratios for the area?
    -   Is the projected vacancy rate in line with the market?
    -   Provide a concluding analysis on the overall feasibility and accuracy of the proforma.

**Subject Property Information:**

-   **Address:** {{{subjectPropertyAddress}}}
-   **Property Type:** {{{propertyType}}}
-   **Provided Proforma / Projections:**
    \`\`\`
    {{{proformaText}}}
    \`\`\`

Please generate the full, detailed report.
`,
});

const comparablePropertyReportFlow = ai.defineFlow(
    {
        name: 'comparablePropertyReportFlow',
        inputSchema: GenerateComparablePropertyReportInputSchema,
        outputSchema: GenerateComparablePropertyReportOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
