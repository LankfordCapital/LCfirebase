
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating various market analysis reports for a given property.
 * 
 * - generateMarketAnalysis - An async function that takes a property address, deal type, and requested reports, and returns the generated reports.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateMarketAnalysisInputSchema, GenerateMarketAnalysisOutputSchema, type GenerateMarketAnalysisInput, type GenerateMarketAnalysisOutput } from './market-analysis-types';

export async function generateMarketAnalysis(input: GenerateMarketAnalysisInput): Promise<GenerateMarketAnalysisOutput> {
    return marketAnalysisFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateMarketAnalysisPrompt',
    input: { schema: GenerateMarketAnalysisInputSchema.extend({
        generateTrafficStudy: z.boolean(),
        generateDemographics: z.boolean(),
        generateEconomicDrivers: z.boolean(),
        generateZoning: z.boolean(),
    }) },
    output: { schema: GenerateMarketAnalysisOutputSchema },
    prompt: `You are an expert real estate and urban planning market analyst. Your task is to generate a series of detailed reports for a subject property based on the provided address, deal type, and a list of requested reports.

You must use your knowledge of public data sources, market trends, and analysis techniques to provide accurate, data-driven reports.

**Subject Property Address:** {{{subjectPropertyAddress}}}
**Deal Type / Property Focus:** {{{dealType}}}

Please generate the following reports as requested. If a report is not requested, do not generate it.

{{#if generateTrafficStudy}}
**Traffic Study:**
Generate a detailed report on traffic conditions around the subject property. Include:
- Estimated average daily traffic counts on nearby major roads.
- Peak traffic hours and patterns.
- Accessibility analysis (ingress/egress, public transit, major highway access).
- Any known future transportation projects that could impact the area.
{{/if}}

{{#if generateDemographics}}
**Demographics Report:**
Generate a comprehensive demographic analysis for a 3-5 mile radius around the property. Include:
- Population data: total population, density, and projected growth rate.
- Household income: median and average household income.
- Age distribution: key age brackets (e.g., 25-34, 35-44).
- Housing data: owner-occupied vs. renter-occupied statistics, median home values.
- Educational attainment levels.
{{/if}}

{{#if generateEconomicDrivers}}
**Economic Drivers Report:**
Generate an analysis of the local economy. Include:
- Major employers in the area and their industries.
- Key economic sectors (e.g., tech, healthcare, manufacturing).
- Recent economic development news or announcements.
- Unemployment rate and job growth trends.
- How these drivers specifically relate to the "{{dealType}}".
{{/if}}

{{#if generateZoning}}
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
        const promptInput = {
            ...input,
            generateTrafficStudy: input.reportTypes.includes('trafficStudy'),
            generateDemographics: input.reportTypes.includes('demographics'),
            generateEconomicDrivers: input.reportTypes.includes('economicDrivers'),
            generateZoning: input.reportTypes.includes('zoning'),
        };

        const { output } = await prompt(promptInput);
        return output!;
    }
);
