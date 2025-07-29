
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating title and escrow order instructions.
 * 
 * - generateTitleEscrowInstructions - An async function that takes deal details and returns customized instructions.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateTitleEscrowInstructionsInputSchema, GenerateTitleEscrowInstructionsOutputSchema, type GenerateTitleEscrowInstructionsInput, type GenerateTitleEscrowInstructionsOutput } from './title-escrow-instructions-types';

export async function generateTitleEscrowInstructions(input: GenerateTitleEscrowInstructionsInput): Promise<GenerateTitleEscrowInstructionsOutput> {
    return generateTitleEscrowInstructionsFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateTitleEscrowInstructionsPrompt',
    input: { schema: GenerateTitleEscrowInstructionsInputSchema },
    output: { schema: GenerateTitleEscrowInstructionsOutputSchema },
    prompt: `You are an expert real estate paralegal and closing coordinator for a lender named Lankford Capital. Your task is to generate comprehensive and precise order instructions for both the Title Company and the Escrow Company for a real estate transaction.

**Instructions:**
1.  **Analyze the Deal:** Deeply analyze the provided deal parameters (deal type, loan amount, property type, etc.) to determine the necessary requirements.
2.  **Generate Title Instructions:** Create a formal request to the title company.
    -   Specify the required lender's title insurance policy (e.g., ALTA Lender's Policy).
    -   Based on the deal type, list all necessary endorsements (e.g., for a commercial property, you would require Zoning 3.1, Survey, and ALTA 9 endorsements).
    -   Include all relevant party and property information.
3.  **Generate Escrow Instructions:** Create a separate set of instructions for the escrow company.
    -   Detail the handling of funds, including the loan amount and any deposits.
    -   Specify how prorations for taxes, insurance, and any rents should be handled.
    -   List all conditions that must be met before closing and disbursing funds.
    -   Reference the title requirements to ensure alignment.

**Deal Parameters:**

-   **Lender:** Lankford Capital
-   **Subject Property Address:** {{{subjectPropertyAddress}}}
-   **Borrower Name/Entity:** {{{borrowerName}}}
-   **Loan Amount:** {{{loanAmount}}}
-   **Deal Type:** {{{dealType}}}
-   **Property Type:** {{{propertyType}}}
-   **Purchase Price:** {{#if purchasePrice}}{{{purchasePrice}}}{{else}}N/A (Refinance){{/if}}
-   **Additional Notes:** {{{additionalNotes}}}

Please generate the two sets of instructions based on this data.
`,
});

const generateTitleEscrowInstructionsFlow = ai.defineFlow(
    {
        name: 'generateTitleEscrowInstructionsFlow',
        inputSchema: GenerateTitleEscrowInstructionsInputSchema,
        outputSchema: GenerateTitleEscrowInstructionsOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
