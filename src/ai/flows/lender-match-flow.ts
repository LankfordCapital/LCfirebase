
'use server';

/**
 * @fileOverview This file defines a Genkit flow for matching a deal with the best lenders.
 * 
 * - findBestLenders - An async function that takes deal details and a list of lenders, 
 *   and returns a ranked list of the best matches.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { 
    LenderMatchInputSchema, 
    LenderMatchOutputSchema, 
    type LenderMatchInput, 
    type LenderMatchOutput 
} from './lender-match-types';

export async function findBestLenders(input: LenderMatchInput): Promise<LenderMatchOutput> {
    return lenderMatchFlow(input);
}

const prompt = ai.definePrompt({
    name: 'lenderMatchPrompt',
    input: { schema: LenderMatchInputSchema },
    output: { schema: LenderMatchOutputSchema },
    prompt: `You are an expert capital markets advisor. Your task is to analyze a real estate deal and match it with the most suitable lenders from a provided database.

**Deal Information:**
-   **Loan Amount:** {{{deal.loanAmount}}}
-   **Property Type:** {{{deal.propertyType}}}
-   **Location:** {{{deal.location}}}
-   **LTV:** {{{deal.ltv}}}%
-   **LTC:** {{{deal.ltc}}}%
-   **Deal Summary:** {{{deal.dealSummary}}}

**Task:**
1.  **Analyze Each Lender:** Carefully review each lender profile provided in the list below.
2.  **Compare to Deal:** Compare each lender's criteria against the specifics of the deal.
3.  **Score and Rank:** Assign a 'matchScore' from 0-100 to each lender based on how well they fit the deal. A score of 100 is a perfect match.
4.  **Provide Rationale:** For each of the top 3-5 matches, provide a clear 'rationale' explaining why they are a good fit. Be specific. For example, mention if the loan amount is within their preferred range, if the property type is a match, etc.
5.  **Return Top Matches:** Return a ranked list of the best 3 to 5 lenders in the 'bestMatches' field.

**Available Lenders:**
---
{{#each lenders}}
-   **Lender ID:** {{id}}
-   **Name:** {{name}}
-   **Criteria:** {{lendingCriteria}}
-   **Notes:** {{notes}}
---
{{/each}}

Please generate the ranked list of the best lender matches.`,
});

const lenderMatchFlow = ai.defineFlow(
    {
        name: 'lenderMatchFlow',
        inputSchema: LenderMatchInputSchema,
        outputSchema: LenderMatchOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
