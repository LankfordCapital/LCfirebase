
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating various market analysis reports for a given property.
 * 
 * - generateMarketAnalysis - An async function that takes a property address, deal type, and requested reports, and returns the generated reports.
 * - GenerateMarketAnalysisInput - The input type for the function.
 * - GenerateMarketAnalysisOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
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


export async function generateMarketAnalysis(input: GenerateMarketAnalysisInput): Promise<GenerateMarketAnalysisOutput> {
    return marketAnalysisFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateMarketAnalysisPrompt',
    input: { schema: GenerateMarketAnalysisInputSchema },
    output: { schema: GenerateMarketAnalysisOutputSchema },
    prompt: `You are an expert real estate and urban planning market analyst. Your task is to generate a series of detailed reports for a subject property based on the provided address, deal type, and a list of requested reports.

You must use your knowledge of public data sources, market trends, and analysis techniques to provide accurate, data-driven reports.

**Subject Property Address:** {{{subjectPropertyAddress}}}
**Deal Type / Property Focus:** {{{dealType}}}

Please generate the following reports as requested. If a report is not requested in the 'reportTypes' array, do not generate it.

{{#if (includes reportTypes "trafficStudy")}}
**Traffic Study:**
Generate a detailed report on traffic conditions around the subject property. Include:
- Estimated average daily traffic counts on nearby major roads.
- Peak traffic hours and patterns.
- Accessibility analysis (ingress/egress, public transit, major highway access).
- Any known future transportation projects that could impact the area.
{{/if}}

{{#if (includes reportTypes "demographics")}}
**Demographics Report:**
Generate a comprehensive demographic analysis for a 3-5 mile radius around the property. Include:
- Population data: total population, density, and projected growth rate.
- Household income: median and average household income.
- Age distribution: key age brackets (e.g., 25-34, 35-44).
- Housing data: owner-occupied vs. renter-occupied statistics, median home values.
- Educational attainment levels.
{{/if}}

{{#if (includes reportTypes "economicDrivers")}}
**Economic Drivers Report:**
Generate an analysis of the local economy. Include:
- Major employers in the area and their industries.
- Key economic sectors (e.g., tech, healthcare, manufacturing).
- Recent economic development news or announcements.
- Unemployment rate and job growth trends.
- How these drivers specifically relate to the "{{dealType}}".
{{/if}}

{{#if (includes reportTypes "zoning")}}
**Zoning & Use Report:**
Generate a report on the property's zoning and land use. Include:
- The specific zoning designation for the address.
- A detailed description of what this zoning code permits (e.g., permitted uses, density, height restrictions, setback requirements).
- Any relevant overlays or special districts that apply.
- A brief summary of whether the stated "{{dealType}}" is a permitted use under the current zoning.
{{/if}}

Please provide each requested report in its corresponding field in the output.
`,
});

const marketAnalysisFlow = ai.defineFlow(
    {
        name: 'marketAnalysisFlow',
        inputSchema: GenerateMarketAnalysisInputSchema,
        outputSchema: GenerateMarketAnalysisOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
