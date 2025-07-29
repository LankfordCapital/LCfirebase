import { z } from 'zod';

// Lender Profile Schema
export const LenderProfileSchema = z.object({
    id: z.string(),
    name: z.string().describe('The name of the lending institution or investor.'),
    contactPerson: z.string().describe("The primary contact person's name."),
    email: z.string().email().describe("The contact person's email."),
    phone: z.string().describe("The contact person's phone number."),
    website: z.string().url().optional().describe("The lender's website URL."),
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
    deal: DealInfoSchema,
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
