import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Use fallback API key if environment variable is not available
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCIxq07RjOO-W9-yIU4lh7OkAKwETVAifw';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: GEMINI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
