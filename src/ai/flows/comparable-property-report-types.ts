
import { z } from 'zod';

export const GenerateComparablePropertyReportInputSchema = z.object({
    subjectPropertyAddress: z.string().describe('The full address of the subject property for market analysis.'),
    propertyType: z.string().describe('The type of property, e.g., "Multi-Family", "Retail Strip Center".'),
    proformaText: z.string().describe('The user-provided proforma, projections, or financial summary for the property.'),
});
export type GenerateComparablePropertyReportInput = z.infer<typeof GenerateComparablePropertyReportInputSchema>;


export const GenerateComparablePropertyReportOutputSchema = z.object({
    comparableSalesAnalysis: z.string().describe("A detailed analysis of comparable property sales, including a list of comps and an estimated value."),
    rentalMarketAnalysis: z.string().describe("A detailed analysis of the rental market, including rental comps, vacancy rates, expense ratios, concessions, and days on market."),
    proformaVsMarketAnalysis: z.string().describe("A comparative analysis of the user's proforma against the gathered market data, highlighting consistencies and discrepancies with percentages."),
    finalConclusion: z.string().describe("A summary conclusion on the overall feasibility of the property's financial projections based on the market data."),
});
export type GenerateComparablePropertyReportOutput = z.infer<typeof GenerateComparablePropertyReportOutputSchema>;
