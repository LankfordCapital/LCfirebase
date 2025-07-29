import { z } from 'zod';

export const GenerateTitleEscrowInstructionsInputSchema = z.object({
    subjectPropertyAddress: z.string().describe('The full address of the subject property.'),
    dealType: z.string().describe('The type of deal, e.g., "Commercial Acquisition", "Residential Refinance".'),
    propertyType: z.string().describe('The type of property, e.g., "Multi-Family", "Retail", "Industrial Warehouse".'),
    loanAmount: z.number().describe('The total loan amount.'),
    borrowerName: z.string().describe('The full legal name of the borrowing entity or individual.'),
    purchasePrice: z.number().optional().describe('The purchase price of the property, if applicable.'),
    additionalNotes: z.string().optional().describe('Any other specific instructions or context for the AI to consider.'),
});
export type GenerateTitleEscrowInstructionsInput = z.infer<typeof GenerateTitleEscrowInstructionsInputSchema>;


export const GenerateTitleEscrowInstructionsOutputSchema = z.object({
    titleInstructions: z.string().describe('The generated, detailed instructions for the Title Company.'),
    escrowInstructions: z.string().describe('The generated, detailed instructions for the Escrow Company.'),
});
export type GenerateTitleEscrowInstructionsOutput = z.infer<typeof GenerateTitleEscrowInstructionsOutputSchema>;
