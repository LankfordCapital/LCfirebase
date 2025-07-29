
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating insurance order instructions.
 * 
 * - generateInsuranceInstructions - An async function that takes deal details and returns customized instructions for an insurance agent.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateInsuranceInstructionsInputSchema, GenerateInsuranceInstructionsOutputSchema, type GenerateInsuranceInstructionsInput, type GenerateInsuranceInstructionsOutput } from './insurance-instructions-types';

export async function generateInsuranceInstructions(input: GenerateInsuranceInstructionsInput): Promise<GenerateInsuranceInstructionsOutput> {
    return generateInsuranceInstructionsFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateInsuranceInstructionsPrompt',
    input: { schema: GenerateInsuranceInstructionsInputSchema },
    output: { schema: GenerateInsuranceInstructionsOutputSchema },
    prompt: `You are an expert insurance risk manager and underwriter for a lender named Lankford Capital. Your task is to generate a comprehensive insurance order instruction letter for an insurance agent based on a specific real estate deal.

**Instructions:**
1.  **Analyze the Deal:** Deeply analyze the provided deal parameters (deal type, loan amount, property type, construction details etc.) to determine the necessary insurance coverages.
2.  **Specify Required Policies:** Based on the deal, specify all required insurance policies.
    -   For any deal involving construction or major rehab, you MUST require "Builder's Risk" insurance covering 100% of the hard costs.
    -   For all deals, require "Commercial General Liability" insurance with a minimum coverage of $1,000,000 per occurrence and $2,000,000 in the aggregate.
    -   For all deals, require "Property Insurance" (or equivalent) covering the property for its full replacement cost.
3.  **Lender as Loss Payee:** Mandate that "Lankford Capital" and its assigns/successors must be named as the Lender Loss Payee and an Additional Insured on all policies.
4.  **Format as a Formal Request:** Draft a professional letter to the insurance agent outlining these requirements clearly. Include all relevant party and property information.

**Deal Parameters:**

-   **Lender:** Lankford Capital
-   **Subject Property Address:** {{{subjectPropertyAddress}}}
-   **Borrower Name/Entity:** {{{borrowerName}}}
-   **Loan Amount:** {{{loanAmount}}}
-   **Deal Type:** {{{dealType}}}
-   **Property Type:** {{{propertyType}}}
-   **Purchase Price:** {{#if purchasePrice}}{{{purchasePrice}}}{{else}}N/A (Refinance){{/if}}
-   **Construction/Rehab Budget:** {{#if constructionBudget}}{{{constructionBudget}}}{{else}}N/A{{/if}}
-   **Additional Notes:** {{{additionalNotes}}}

Please generate the formal insurance instruction letter based on this data.
`,
});

const generateInsuranceInstructionsFlow = ai.defineFlow(
    {
        name: 'generateInsuranceInstructionsFlow',
        inputSchema: GenerateInsuranceInstructionsInputSchema,
        outputSchema: GenerateInsuranceInstructionsOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
