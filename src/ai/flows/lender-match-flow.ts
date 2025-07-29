
'use server';

/**
 * @fileOverview This file defines a Genkit flow for matching a deal with the best lenders.
 * 
 * - findBestLenders - An async function that takes deal details and a list of lenders, 
 *   and returns a ranked list of the best matches.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Lender Profile Schema
export const LenderProfileSchema = z.object({
    id: z.string(),
    name: z.string().describe('The name of the lending institution or investor.'),
    contactPerson: z.string().describe("The primary contact person's name."),
    email: z.string().email().describe("The contact person's email."),
    phone: z.string().describe("The contact person's phone number."),
    lendingCriteria: z.string().describe('A detailed description of their lending criteria, including preferred deal types, loan sizes, geographic focus, LTV/LTC requirements, credit score minimums, etc.'),
    notes: z.string().optional().describe('Any additional notes or information about the lender.'),
});
export type LenderProfile = z.infer<typeof LenderProfileSchema>;

// Deal Information Schema
export const DealInfoSchema = z.object({
    dealId: z.string().describe('A unique identifier for the deal.'),
    loanAmount: z.number().describe('The requested loan amount.'),
    propertyType: z.string().describe('The type of property (e.g., Multi-Family, Retail, Industrial).'),
    location: z.string().describe('The city and state of the property.'),
    ltv: z.number().describe('The loan-to-value ratio.'),
    ltc: z.number().describe('The loan-to-cost ratio.'),
    dealSummary: z.string().describe('A brief summary of the deal, including its strengths and weaknesses.'),
});
export type DealInfo = z.infer<typeof DealInfoSchema>;

// Input Schema for the Flow
export const LenderMatchInputSchema = z.object({
    deal: DealInfo,
    lenders: z.array(LenderProfileSchema).describe('A list of all available lenders and their profiles.'),
});
export type LenderMatchInput = z.infer<typeof LenderMatchInputSchema>;

// Output Schema for the Flow
export const LenderMatchOutputSchema = z.object({
    bestMatches: z.array(z.object({
        lenderId: z.string().describe("The ID of the matched lender."),
        lenderName: z.string().describe("The name of the matched lender."),
        matchScore: z.number().min(0).max(100).describe('A score from 0 to 100 indicating the quality of the match.'),
        rationale: z.string().describe('A detailed explanation of why this lender is a good match for the deal, referencing specific criteria.'),
    })).describe('A ranked list of the top 3-5 best lender matches for the deal.'),
});
export type LenderMatchOutput = z.infer<typeof LenderMatchOutputSchema>;


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
