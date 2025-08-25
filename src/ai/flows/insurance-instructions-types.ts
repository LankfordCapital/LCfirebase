
import { z } from 'zod';

export const GenerateInsuranceInstructionsInputSchema = z.object({
    subjectPropertyAddress: z.string().describe('The full address of the subject property.'),
    dealType: z.string().describe('The type of deal, e.g., "Ground Up Construction", "Fix and Flip", "Commercial Acquisition".'),
    propertyType: z.string().describe('The type of property, e.g., "Multi-Family", "Retail", "Industrial Warehouse".'),
    loanAmount: z.number().describe('The total loan amount.'),
    borrowerName: z.string().describe('The full legal name of the borrowing entity or individual.'),
    purchasePrice: z.number().optional().describe('The purchase price of the property, if applicable.'),
    constructionBudget: z.number().optional().describe('The construction or rehab budget, if applicable.'),
    additionalNotes: z.string().optional().describe('Any other specific instructions or context for the AI to consider.'),
});
export type GenerateInsuranceInstructionsInput = z.infer<typeof GenerateInsuranceInstructionsInputSchema>;


export const GenerateInsuranceInstructionsOutputSchema = z.object({
    insuranceInstructions: z.string().describe('The generated, detailed instructions for the Insurance Agent.'),
});
export type GenerateInsuranceInstructionsOutput = z.infer<typeof GenerateInsuranceInstructionsOutputSchema>;
