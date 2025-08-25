
import { z } from 'zod';

export const GenerateMapReportInputSchema = z.object({
    subjectPropertyAddress: z.string().describe('The full address of the subject property.'),
    comparableAddresses: z.array(z.string()).optional().describe('An array of addresses for comparable properties to show on the map.'),
});
export type GenerateMapReportInput = z.infer<typeof GenerateMapReportInputSchema>;


export const GenerateMapReportOutputSchema = z.object({
    mapDescription: z.string().describe('A detailed textual description of the property\'s location, nearby amenities, transportation, and relation to comps.'),
});
export type GenerateMapReportOutput = z.infer<typeof GenerateMapReportOutputSchema>;
