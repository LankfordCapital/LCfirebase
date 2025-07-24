'use server';
/**
 * @fileOverview This file defines a Genkit flow for AI-powered pre-underwriting of loan applications.
 *
 * - aiPreUnderwriter - An async function that takes loan program details and uploaded documents, and returns a pre-underwriting analysis.
 * - AiPreUnderwriterInput - The input type for the aiPreUnderwriter function.
 * - AiPreUnderwriterOutput - The return type for the aiPreUnderwriter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiPreUnderwriterInputSchema = z.object({
  loanProgram: z.string().describe('The selected loan program (e.g., Ground Up Construction, Fix and Flip, DSCR).'),
  uploadedDocuments: z.array(z.object({
    filename: z.string().describe('The name of the uploaded document.'),
    dataUri: z.string().describe("The document data as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  })).describe('An array of uploaded documents, including their filenames and data URIs.'),
});
export type AiPreUnderwriterInput = z.infer<typeof AiPreUnderwriterInputSchema>;

const AiPreUnderwriterOutputSchema = z.object({
  prequalificationStatus: z.string().describe('The prequalification status based on the provided information (e.g., Prequalified, Needs Review, Not Prequalified).'),
  missingDocuments: z.array(z.string()).describe('A list of required documents that are missing from the uploadedDocuments array based on the loan program.'),
  potentialIssues: z.array(z.string()).describe('A list of potential issues identified during the pre-underwriting process.'),
  documentRequestList: z.array(z.string()).describe('A list of all documents required to close the loan, specific to the selected loan program. This list should be comprehensive based on the requirements provided.'),
});
export type AiPreUnderwriterOutput = z.infer<typeof AiPreUnderwriterOutputSchema>;

export async function aiPreUnderwriter(input: AiPreUnderwriterInput): Promise<AiPreUnderwriterOutput> {
  return aiPreUnderwriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPreUnderwriterPrompt',
  input: {schema: AiPreUnderwriterInputSchema},
  output: {schema: AiPreUnderwriterOutputSchema},
  prompt: `You are an AI underwriter that specializes in pre-underwriting files and providing prequalifications and document request lists based on the selected loan program and the documents provided. The loan program is {{{loanProgram}}}.

You will analyze the provided documents to determine a prequalification status.
Based on the loan program that is selected, and the document requirements provided below, you will generate a full list of required documents and populate it in the 'documentRequestList' field. This list must be comprehensive for the selected program and also include the standard Borrower Profile Documents listed below.
Then, you will compare the filenames of the uploaded documents against the full list you just generated and identify any missing documents. Populate the 'missingDocuments' field with the names of the documents that are required but not present in the upload list.
Finally, list any potential issues you find in the provided documents.

**Borrower Profile Documents (Required for most loans):**
*   ID/Driver's License
*   Personal Financial Statement
*   Credit Report
*   Personal Asset Statement
*   Company Asset Statement
*   EIN Certificate
*   Formation Documentation
*   Operating Agreement/Bylaws
*   Partnership/Officer List
*   Business License
*   Certificate of Good Standing
*   Business Debt Schedule
*   Purchase HUD-1 (if applicable)
*   Disposition HUD-1 (if applicable)


**Document Requirements by Loan Program:**

*   **Residential NOO - Ground Up Construction:**
    *   Executed Purchase Contract
    *   Evidence of Earnest Money Deposit
    *   Preliminary Title Commitment
    *   Escrow Instructions
    *   Closing Protection Letter
    *   Title/Escrow Agent Details (Name, Company, Phone, Email)
    *   General Contractor Details (Name, Phone, Email)
    *   General Contractor License
    *   General Contractor Insurance
    *   General Contractor Bond (if required by location)
    *   General Contractor's Contract to Build
    *   Builder's Risk Insurance Quote
    *   Commercial Liability Insurance Quote
    *   Insurance Agent Details (Name, Company, Phone, Email)
    *   Approved or Pre-approved Plans
    *   Approved Permits (if available)
    *   Property HUD-1/Settlement Statement (if already purchased)
    *   30-Day Payoff Statement with Per Diem (if property has a mortgage)

*   **Residential NOO - Fix and Flip:**
    *   2023 Personal and Business Tax Returns
    *   Signed Purchase Agreement
    *   Driver's License
    *   Articles of Organization and Operating Agreement
    *   Rehab Budget
    *   Proof of Funds for down payment and reserves

*   **Residential NOO - DSCR:**
    *   Signed Purchase Agreement
    *   Driver's License
    *   Articles of Organization and Operating Agreement
    *   Lease Agreements for subject property (if applicable)
    *   Insurance Quote

*   **Residential NOO - Bridge:**
    *   Signed Purchase Agreement
    *   Driver's License
    *   Articles of Organization and Operating Agreement
    *   Preliminary Title Report

*   **Commercial - Ground Up Construction:**
    *   Personal and Business Financial Statements (2 years)
    *   Pro-forma projections for the project
    *   Construction Plans and Budget
    *   Appraisal Report
    *   Environmental Report
    *   Articles of Organization and Operating Agreement

*   **Commercial - Rehab Loans:**
    *   Personal and Business Financial Statements (2 years)
    *   Current Rent Roll
    *   Rehab Budget and Plans
    *   Purchase Agreement (if applicable)
    *   Appraisal Report

*   **Commercial - Acquisition & Bridge:**
    *   Personal and Business Financial Statements (2 years)
    *   Trailing 12-month Operating Statement
    *   Purchase Agreement
    *   Appraisal Report

*   **Commercial - Conventional Long Term Debt:**
    *   Personal and Business Tax Returns (3 years)
    *   Business Financial Statements (3 years)
    *   Current Rent Roll
    *   Lease Agreements
    *   Appraisal Report

*   **Industrial - Ground Up Construction:**
    *   Business Plan with projections
    *   Personal and Business Financial Statements (2 years)
    *   Construction Plans, Budget, and Timeline
    *   Appraisal and Environmental Reports
    *   Proof of Equity Injection

*   **Industrial - Rehab & Expansion:**
    *   Business Financial Statements (2 years)
    *   Current Property Operating Statements
    *   Rehab/Expansion Plans and Budget
    *   Appraisal Report

*   **Industrial - Acquisition & Bridge:**
    *   Trailing 12-month Operating Statement for property
    *   Personal and Business Financial Statements of borrower
    *   Purchase Agreement
    *   Preliminary Title Report

*   **Industrial - Long Term Debt:**
    *   Business Tax Returns (3 years)
    *   Property Operating Statements (3 years)
    *   Lease Agreements
    *   Appraisal Report

*   **SBA 7(a):**
    *   SBA Form 1919
    *   Personal Financial Statement (SBA Form 413)
    *   Business Financial Statements (3 years)
    *   Business Tax Returns (3 years)
    *   Business Plan and Projections

*   **SBA 504:**
    *   SBA Form 1244
    *   Project Cost Details
    *   Business Financial Statements (3 years)
    *   Personal Financial Statement for all guarantors

*   **Land Acquisition:**
    *   Purchase Agreement
    *   Feasibility Study
    *   Zoning and Entitlement Documents
    *   Environmental Report
    *   Appraisal

*   **Mezzanine Loans:**
    *   Senior Debt Term Sheet
    *   Full Project Pro-forma
    *   Capital Stack overview
    *   Sponsor Financials

*   **Mobilization Funding:**
    *   Executed Contract for the project
    *   Detailed Use of Funds
    *   Company Financials
    *   Credit Report

*   **Equipment Financing:**
    *   Equipment Quote or Invoice
    *   Application Form
    *   Business Financials (if over $100k)

Uploaded Documents:
{{#each uploadedDocuments}}
  - Filename: {{{filename}}}
{{/each}}
`,
});

const aiPreUnderwriterFlow = ai.defineFlow(
  {
    name: 'aiPreUnderwriterFlow',
    inputSchema: AiPreUnderwriterInputSchema,
    outputSchema: AiPreUnderwriterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
