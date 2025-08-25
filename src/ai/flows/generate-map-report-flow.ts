
'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a textual map analysis report.
 * 
 * - generateMapReport - An async function that takes a property address and returns a descriptive map report.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { GenerateMapReportInputSchema, GenerateMapReportOutputSchema, type GenerateMapReportInput, type GenerateMapReportOutput } from './map-report-types';

export async function generateMapReport(input: GenerateMapReportInput): Promise<GenerateMapReportOutput> {
    return mapReportFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateMapReportPrompt',
    input: { schema: GenerateMapReportInputSchema },
    output: { schema: GenerateMapReportOutputSchema },
    prompt: `You are an expert cartographer and urban analyst. Your task is to generate a descriptive map report for a subject property.

Based on the address provided, describe the location of the property and its proximity to key points of interest.

**Analysis Steps:**

1.  **Subject Property Location:** Describe the immediate surroundings of the property (e.g., "located on a busy commercial street," "in a quiet residential cul-de-sac").
2.  **Nearby Attractions & Amenities:** List key nearby attractions like parks, shopping centers, restaurants, schools, and hospitals, including their approximate distance and direction.
3.  **Transportation Links:** Describe the nearest major roads, highways, bus stops, and train stations.
4.  **Comparable Properties:** If provided, describe where the comparable properties are located in relation to the subject property (e.g., "Comp 1 is two blocks north," "Comp 3 is across the highway").

**Subject Property Address:** {{{subjectPropertyAddress}}}

{{#if comparableAddresses}}
**Comparable Property Addresses:**
{{#each comparableAddresses}}
- {{{this}}}
{{/each}}
{{/if}}

Please generate the full, detailed map description.
`,
});

const mapReportFlow = ai.defineFlow(
    {
        name: 'mapReportFlow',
        inputSchema: GenerateMapReportInputSchema,
        outputSchema: GenerateMapReportOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
