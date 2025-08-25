
import { z } from 'zod';

export const GenerateSalesHistoryReportInputSchema = z.object({
    subjectPropertyAddress: z.string().describe('The full address of the subject property.'),
});
export type GenerateSalesHistoryReportInput = z.infer<typeof GenerateSalesHistoryReportInputSchema>;


export const GenerateSalesHistoryReportOutputSchema = z.object({
    salesHistory: z.string().describe('A detailed report of the property\'s sales history, listing each sale with date, price, and other relevant details.'),
});
export type GenerateSalesHistoryReportOutput = z.infer<typeof GenerateSalesHistoryReportOutputSchema>;
