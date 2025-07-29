import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {registerHelper} from 'handlebars';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash',
});

// Register a helper for the prompt
registerHelper('includes', function (array, value, options) {
  if (array?.includes(value)) {
    return options.fn(this);
  }
  return options.inverse(this);
});
