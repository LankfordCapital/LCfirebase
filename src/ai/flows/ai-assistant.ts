'use server';
/**
 * @fileOverview An AI assistant to answer visitor questions about loan products and eligibility.
 *
 * - answerVisitorQuestion - A function that answers a visitor's question.
 * - AnswerVisitorQuestionInput - The input type for the answerVisitorQuestion function.
 * - AnswerVisitorQuestionOutput - The return type for the answerVisitorQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerVisitorQuestionInputSchema = z.object({
  question: z.string().describe('The visitor\'s question about loan products and eligibility.'),
});
export type AnswerVisitorQuestionInput = z.infer<typeof AnswerVisitorQuestionInputSchema>;

const AnswerVisitorQuestionOutputSchema = z.object({
  answer: z.string().describe('The AI assistant\'s answer to the visitor\'s question.'),
});
export type AnswerVisitorQuestionOutput = z.infer<typeof AnswerVisitorQuestionOutputSchema>;

export async function answerVisitorQuestion(input: AnswerVisitorQuestionInput): Promise<AnswerVisitorQuestionOutput> {
  return answerVisitorQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerVisitorQuestionPrompt',
  input: {schema: AnswerVisitorQuestionInputSchema},
  output: {schema: AnswerVisitorQuestionOutputSchema},
  prompt: `You are a helpful AI assistant that answers questions about loan products and eligibility. Please provide accurate and concise answers to the following question:\n\nQuestion: {{{question}}}`,
});

const answerVisitorQuestionFlow = ai.defineFlow(
  {
    name: 'answerVisitorQuestionFlow',
    inputSchema: AnswerVisitorQuestionInputSchema,
    outputSchema: AnswerVisitorQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
