import { z } from 'zod';

export const GenerateConstructionFeasibilityInputSchema = z.object({
    subjectPropertyAddress: z.string().describe('The full address of the subject property to determine local costs.'),
    dealType: z.string().describe('The type of deal, e.g., "Ground Up Construction" or "Fix and Flip".'),
    constructionBudgetText: z.string().describe('The full text or summary of the construction budget.'),
    workSunkText: z.string().describe('A report or summary of work already completed and paid for.'),
    plansDataUri: z.string().optional().describe("Architectural or construction plans, as a data URI."),
    siteInspectionDataUri: z.string().optional().describe("A site inspection report, as a data URI."),
});
export type GenerateConstructionFeasibilityInput = z.infer<typeof GenerateConstructionFeasibilityInputSchema>;


export const GenerateConstructionFeasibilityOutputSchema = z.object({
    isFeasible: z.boolean().describe('Whether the provided budget is feasible to complete the project.'),
    feasibilitySummary: z.string().describe('A high-level summary of the feasibility analysis.'),
    potentialShortfall: z.number().optional().describe('The estimated monetary shortfall if the project is not feasible.'),
    costAnalysis: z.string().describe('A detailed, line-item-level analysis comparing the provided budget to estimated local costs.'),
    recommendations: z.array(z.string()).describe('Actionable recommendations to improve budget feasibility or mitigate risks.'),
});
export type GenerateConstructionFeasibilityOutput = z.infer<typeof GenerateConstructionFeasibilityOutputSchema>;
