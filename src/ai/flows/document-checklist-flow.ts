'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a document checklist for a specific loan program.
 *
 * - getDocumentChecklist - An async function that takes a loan program and returns a categorized document checklist.
 * - GetDocumentChecklistInput - The input type for the getDocumentChecklist function.
 * - GetDocumentChecklistOutput - The return type for the getDocumentChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetDocumentChecklistInputSchema = z.object({
  loanProgram: z.string().describe('The selected loan program (e.g., Ground Up Construction, Fix and Flip, DSCR).'),
});
export type GetDocumentChecklistInput = z.infer<typeof GetDocumentChecklistInputSchema>;

const DocumentChecklistSchema = z.object({
    borrower: z.array(z.string()).describe('List of documents related to the borrower.'),
    company: z.array(z.string()).describe('List of documents related to the company.'),
    subjectProperty: z.array(z.string()).describe('List of documents related to the subject property.'),
});

const GetDocumentChecklistOutputSchema = z.object({
  documentRequestList: DocumentChecklistSchema.describe('A categorized list of all documents required to close the loan, specific to the selected loan program.'),
});
export type GetDocumentChecklistOutput = z.infer<typeof GetDocumentChecklistOutputSchema>;

export async function getDocumentChecklist(input: GetDocumentChecklistInput): Promise<GetDocumentChecklistOutput> {
  return getDocumentChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDocumentChecklistPrompt',
  input: {schema: GetDocumentChecklistInputSchema},
  output: {schema: GetDocumentChecklistOutputSchema},
  prompt: `You are an AI assistant that generates a categorized list of required documents for a specific loan program. The loan program is {{{loanProgram}}}.

Based on the loan program, generate a full list of required documents and populate it in the 'documentRequestList' field.
The documents in the 'documentRequestList' field MUST be categorized into 'borrower', 'company', and 'subjectProperty'.

**Document Categories:**

*   **Borrower Documents:** Personal documents for the individual borrower (e.g., ID, personal financial statements, credit report, deal history).
*   **Company Documents:** Documents related to the business entity (e.g., EIN, formation docs, operating agreements).
*   **Subject Property Documents:** Documents related to the property being financed (e.g., purchase contract, plans, permits, insurance).


**Borrower Profile Documents (Required for most loans):**
*   ID/Driver's License (Borrower)
*   Personal Financial Statement (Borrower)
*   Credit Report (Borrower)
*   Personal Asset Statement (Borrower)
*   Purchase HUD-1 (if applicable) (Borrower)
*   Disposition HUD-1 (if applicable) (Borrower)
*   Company Asset Statement (Company)
*   EIN Certificate (Company)
*   Formation Documentation (Company)
*   Operating Agreement/Bylaws (Company)
*   Partnership/Officer List (Company)
*   Business License (Company)
*   Certificate of Good Standing (Company)
*   Business Debt Schedule (Company)


**Document Requirements by Loan Program:**

*   **Residential NOO - Ground Up Construction:**
    *   Executed Purchase Contract (Subject Property)
    *   Evidence of Earnest Money Deposit (Subject Property)
    *   Preliminary Title Commitment (Subject Property)
    *   Escrow Instructions (Subject Property)
    *   Closing Protection Letter (Subject Property)
    *   Title/Escrow Agent Details (Name, Company, Phone, Email) (Subject Property)
    *   General Contractor Details (Name, Phone, Email) (Subject Property)
    *   General Contractor License (Subject Property)
    *   General Contractor Insurance (Subject Property)
    *   General Contractor Bond (if required by location) (Subject Property)
    *   General Contractor's Contract to Build (Subject Property)
    *   Builder's Risk Insurance Quote (Subject Property)
    *   Commercial Liability Insurance Quote (Subject Property)
    *   Insurance Agent Details (Name, Company, Phone, Email) (Subject Property)
    *   Approved or Pre-approved Plans (Subject Property)
    *   Approved Permits (if available) (Subject Property)
    *   Property HUD-1/Settlement Statement (if already purchased) (Subject Property)
    *   30-Day Payoff Statement with Per Diem (if property has a mortgage) (Subject Property)

*   **Residential NOO - Fix and Flip:**
    *   2023 Personal and Business Tax Returns (Borrower)
    *   Signed Purchase Agreement (Subject Property)
    *   Driver's License (Borrower)
    *   Articles of Organization and Operating Agreement (Company)
    *   Rehab Budget (Subject Property)
    *   Proof of Funds for down payment and reserves (Borrower)

*   **Residential NOO - DSCR:**
    *   Signed Purchase Agreement (Subject Property)
    *   Driver's License (Borrower)
    *   Articles of Organization and Operating Agreement (Company)
    *   Lease Agreements for subject property (if applicable) (Subject Property)
    *   Insurance Quote (Subject Property)

*   **Residential NOO - Bridge:**
    *   Signed Purchase Agreement (Subject Property)
    *   Driver's License (Borrower)
    *   Articles of Organization and Operating Agreement (Company)
    *   Preliminary Title Report (Subject Property)

*   **Commercial - Ground Up Construction:**
    *   Personal and Business Financial Statements (2 years) (Borrower)
    *   Pro-forma projections for the project (Subject Property)
    *   Construction Plans and Budget (Subject Property)
    *   Appraisal Report (Subject Property)
    *   Environmental Report (Subject Property)
    *   Articles of Organization and Operating Agreement (Company)

*   **Commercial - Rehab Loans:**
    *   Personal and Business Financial Statements (2 years) (Borrower)
    *   Current Rent Roll (Subject Property)
    *   Rehab Budget and Plans (Subject Property)
    *   Purchase Agreement (if applicable) (Subject Property)
    *   Appraisal Report (Subject Property)

*   **Commercial - Acquisition & Bridge:**
    *   Personal and Business Financial Statements (2 years) (Borrower)
    *   Trailing 12-month Operating Statement (Subject Property)
    *   Purchase Agreement (Subject Property)
    *   Appraisal Report (Subject Property)

*   **Commercial - Conventional Long Term Debt:**
    *   Personal and Business Tax Returns (3 years) (Borrower)
    *   Business Financial Statements (3 years) (Company)
    *   Current Rent Roll (Subject Property)
    *   Lease Agreements (Subject Property)
    *   Appraisal Report (Subject Property)

*   **Industrial - Ground Up Construction:**
    *   Business Plan with projections (Company)
    *   Personal and Business Financial Statements (2 years) (Borrower)
    *   Construction Plans, Budget, and Timeline (Subject Property)
    *   Appraisal and Environmental Reports (Subject Property)
    *   Proof of Equity Injection (Borrower)

*   **Industrial - Rehab & Expansion:**
    *   Business Financial Statements (2 years) (Company)
    *   Current Property Operating Statements (Subject Property)
    *   Rehab/Expansion Plans and Budget (Subject Property)
    *   Appraisal Report (Subject Property)

*   **Industrial - Acquisition & Bridge:**
    *   Trailing 12-month Operating Statement for property (Subject Property)
    *   Personal and Business Financial Statements of borrower (Borrower)
    *   Purchase Agreement (Subject Property)
    *   Preliminary Title Report (Subject Property)

*   **Industrial - Long Term Debt:**
    *   Business Tax Returns (3 years) (Company)
    *   Property Operating Statements (3 years) (Subject Property)
    *   Lease Agreements (Subject Property)
    *   Appraisal Report (Subject Property)

*   **SBA 7(a):**
    *   SBA Form 1919 (Borrower)
    *   Personal Financial Statement (SBA Form 413) (Borrower)
    *   Business Financial Statements (3 years) (Company)
    *   Business Tax Returns (3 years) (Company)
    *   Business Plan and Projections (Company)

*   **SBA 504:**
    *   SBA Form 1244 (Company)
    *   Project Cost Details (Subject Property)
    *   Business Financial Statements (3 years) (Company)
    *   Personal Financial Statement for all guarantors (Borrower)

*   **Land Acquisition:**
    *   Purchase Agreement (Subject Property)
    *   Feasibility Study (Subject Property)
    *   Zoning and Entitlement Documents (Subject Property)
    *   Environmental Report (Subject Property)
    *   Appraisal (Subject Property)

*   **Mezzanine Loans:**
    *   Senior Debt Term Sheet (Subject Property)
    *   Full Project Pro-forma (Subject Property)
    *   Capital Stack overview (Company)
    *   Sponsor Financials (Borrower)

*   **Mobilization Funding:**
    *   Executed Contract for the project (Subject Property)
    *   Detailed Use of Funds (Subject Property)
    *   Company Financials (Company)
    *   Credit Report (Borrower)

*   **Equipment Financing:**
    *   Equipment Quote or Invoice (Subject Property)
    *   Application Form (Borrower)
    *   Business Financials (if over $100k) (Company)
`,
});

const getDocumentChecklistFlow = ai.defineFlow(
  {
    name: 'getDocumentChecklistFlow',
    inputSchema: GetDocumentChecklistInputSchema,
    outputSchema: GetDocumentChecklistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
