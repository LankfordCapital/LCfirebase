import { z } from 'zod';

const ReportTypeSchema = z.enum(['trafficStudy', 'demographics', 'economicDrivers', 'zoning']);

export const GenerateMarketAnalysisInputSchema = z.object({
    subjectPropertyAddress: z.string().describe('The full address of the subject property.'),
    dealType: z.string().describe('The type of deal or property (e.g., Commercial Retail, Residential Multi-Family). This helps tailor the analysis.'),
    reportTypes: z.array(ReportTypeSchema).min(1).describe('An array of the specific reports being requested.'),
});
export type GenerateMarketAnalysisInput = z.infer<typeof GenerateMarketAnalysisInputSchema>;


export const GenerateMarketAnalysisOutputSchema = z.object({
    trafficStudy: z.string().optional().describe('A detailed traffic study report including traffic counts, patterns, and accessibility.'),
    demographics: z.string().optional().describe('A comprehensive demographics report including population, income levels, age distribution, and housing stats.'),
    economicDrivers: z.string().optional().describe('An analysis of the key economic drivers for the area, including major employers, industries, and economic trends.'),
    zoning: z.string().optional().describe('A report on the property\'s zoning designation, permitted uses, and any relevant land use regulations or restrictions.'),
});
export type GenerateMarketAnalysisOutput = z.infer<typeof GenerateMarketAnalysisOutputSchema>;
