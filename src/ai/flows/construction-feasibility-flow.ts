
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a construction feasibility report.
 * 
 * - generateConstructionFeasibilityReport - An async function that takes project details and returns a feasibility analysis.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateConstructionFeasibilityInputSchema, GenerateConstructionFeasibilityOutputSchema, type GenerateConstructionFeasibilityInput, type GenerateConstructionFeasibilityOutput } from './construction-feasibility-types';

export async function generateConstructionFeasibilityReport(input: GenerateConstructionFeasibilityInput): Promise<GenerateConstructionFeasibilityOutput> {
    return constructionFeasibilityFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateConstructionFeasibilityPrompt',
    input: { schema: GenerateConstructionFeasibilityInputSchema },
    output: { schema: GenerateConstructionFeasibilityOutputSchema },
    prompt: `You are an expert construction cost estimator and quantity surveyor. Your task is to analyze the provided project information to determine the feasibility of the construction budget.

**Analysis Steps:**

1.  **Analyze Local Costs:** Based on the subject property address, use your knowledge of regional construction data to estimate the typical costs for labor and materials in that specific area.
2.  **Review Budget vs. Plans:** Compare the provided construction budget line items against the uploaded plans (if available) and the scope of work described.
3.  **Architectural Plan Analysis (if provided):** Review the architectural plans for completeness, adherence to common building standards, and potential issues. Note any obvious errors, inconsistencies, or areas that may lead to cost overruns.
4.  **Factor in Work Sunk:** Account for the work already completed and paid for ("work sunk") and subtract it from the overall project scope.
5.  **Feasibility Conclusion:** Determine if the remaining budget is sufficient to complete the remaining work based on your local cost analysis. Set the 'isFeasible' flag accordingly.
6.  **Calculate Shortfall:** If the budget is insufficient, estimate the 'potentialShortfall'.
7.  **Provide Detailed Analysis:** In 'costAnalysis', provide a detailed breakdown of your findings. Compare the submitted budget line items to your estimated costs. Highlight areas that are significantly under-budgeted.
8.  **Give Recommendations:** In 'recommendations', provide actionable advice. This could include suggestions for cost savings, reallocating funds, or warnings about specific high-risk items identified in the plans or budget.

**Project Information:**

-   **Subject Property Address:** {{{subjectPropertyAddress}}}
-   **Deal Type:** {{{dealType}}}

**Provided Documents & Data:**

-   **Construction Budget:**
    \`\`\`
    {{{constructionBudgetText}}}
    \`\`\`

-   **Work Sunk Report (Already Completed):**
    \`\`\`
    {{{workSunkText}}}
    \`\`\`

{{#if plansDataUri}}
-   **Architectural Plans:**
    {{media url=plansDataUri}}
{{/if}}

{{#if siteInspectionDataUri}}
-   **Site Inspection Report:**
    {{media url=siteInspectionDataUri}}
{{/if}}

Please generate the full feasibility report based on this data.
`,
});

const constructionFeasibilityFlow = ai.defineFlow(
    {
        name: 'constructionFeasibilityFlow',
        inputSchema: GenerateConstructionFeasibilityInputSchema,
        outputSchema: GenerateConstructionFeasibilityOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
