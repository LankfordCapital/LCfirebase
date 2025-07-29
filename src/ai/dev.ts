
import { config } from 'dotenv';
config();

import '@/ai/flows/ai-pre-underwriter.ts';
import '@/ai/flows/ai-assistant.ts';
import '@/ai/flows/document-optimization.ts';
import '@/ai/flows/credit-score-scanner.ts';
import '@/ai/flows/asset-statement-scanner.ts';
import '@/ai/flows/email-automation.ts';
import '@/ai/flows/document-checklist-flow.ts';
import '@/ai/flows/document-generator.ts';
import '@/ai/flows/market-analysis-flow.ts';
import '@/ai/flows/construction-feasibility-flow.ts';
import '@/ai/flows/generate-title-escrow-instructions-flow.ts';
import '@/ai/flows/generate-insurance-instructions-flow.ts';
import '@/ai/flows/generate-comparable-property-report-flow.ts';
import '@/ai/flows/lender-match-flow.ts';
import '@/ai/flows/appointment-scheduler-flow.ts';

