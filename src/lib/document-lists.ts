
type DocumentList = {
    borrower: string[];
    company: string[];
    subjectProperty: string[];
}

export const loanProgramDocumentLists: Record<string, DocumentList> = {
    "Residential NOO - Ground Up Construction": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Executed Purchase Contract",
            "Evidence of Earnest Money Deposit",
            "General Contractor License",
            "General Contractor Insurance",
            "General Contractor Bond (if required by location)",
            "General Contractor's Contract to Build",
            "Builder's Risk Insurance Quote",
            "Commercial Liability Insurance Quote",
            "Approved or Pre-approved Plans",
            "Approved Permits (if available)",
            "Property HUD-1/Settlement Statement (if already purchased)",
            "30-Day Payoff Statement with Per Diem (if property has a mortgage)",
            "Preliminary Title Commitment",
            "Escrow Instructions",
            "Closing Protection Letter",
        ]
    },
    "Residential NOO - Fix and Flip": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
            "Proof of Funds for down payment and reserves"
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Executed Purchase Contract",
            "Evidence of Earnest Money Deposit",
            "Preliminary Title Commitment",
            "Escrow Instructions",
            "Closing Protection Letter",
            "Rehab Budget",
            "Property HUD-1/Settlement Statement (if already purchased)",
            "30-Day Payoff Statement with Per Diem (if property has a mortgage)",
        ]
    },
    "Residential NOO - DSCR": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Purchase and Sale Agreement (or HUD-1 if refinance)",
            "Lease Agreements for subject property (if applicable)",
            "Projected Lease Comparables (if vacant)",
            "Commercial Liability Insurance Quote",
            "Preliminary Title Commitment",
            "Escrow Instructions",
            "Closing Protection Letter",
            "30-Day Payoff Statement with Per Diem (if a refinance)",
        ]
    },
    "Residential NOO - Bridge": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
            "Proof of Funds for down payment and reserves",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Executed Purchase Contract",
            "Evidence of Earnest Money Deposit",
            "Preliminary Title Commitment",
            "Escrow Instructions",
            "Closing Protection Letter",
            "Property HUD-1/Settlement Statement (if already purchased)",
            "30-Day Payoff Statement with Per diem (if property has a mortgage)",
        ]
    },
    "Commercial - Ground Up Construction": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Executive Summary",
            "Pro-forma Projections (5 years, month-by-month)",
            "Sources and Uses Statement",
            "Construction Plans",
            "Construction Budget",
            "Appraisal Report",
            "Environmental Report",
            "Purchase and Sale Agreement (or HUD-1 if refinance)",
            "Evidence of Earnest Money Deposit",
            "30-Day Payoff Statement with Per Diem (if refinance)",
            "Preliminary Title Commitment",
            "Escrow Instructions",
            "Closing Protection Letter",
            "Builder's Risk Insurance Quote",
            "Commercial Liability Insurance Quote",
            "Approved or Pre-approved Plans",
            "Approved Permits (if available)",
        ]
    },
    "Commercial - Rehab Loans": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Current Rent Roll",
            "Rehab Budget and Plans",
            "Purchase Agreement (if applicable)",
            "Appraisal Report",
        ]
    },
    "Commercial - Acquisition & Bridge": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Trailing 12-month Operating Statement",
            "Purchase Agreement",
            "Appraisal Report",
        ]
    },
    "Commercial - Conventional Long Term Debt": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Current Rent Roll",
            "Lease Agreements",
            "Appraisal Report",
        ]
    },
    "Industrial - Ground Up Construction": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
            "Proof of Equity Injection",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
            "Business Plan with projections",
        ],
        subjectProperty: [
            "Construction Plans, Budget, and Timeline",
            "Appraisal and Environmental Reports",
            "Approved or Pre-approved Plans",
            "Approved Permits (if available)",
        ]
    },
    "Industrial - Rehab & Expansion": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Current Property Operating Statements",
            "Rehab/Expansion Plans and Budget",
            "Appraisal Report",
        ]
    },
    "Industrial - Acquisition & Bridge": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Trailing 12-month Operating Statement for property",
            "Purchase Agreement",
            "Preliminary Title Report",
        ]
    },
    "Industrial - Long Term Debt": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Purchase HUD-1 (if applicable)",
            "Disposition HUD-1 (if applicable)",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Property Operating Statements (3 years)",
            "Lease Agreements",
            "Appraisal Report",
        ]
    },
    "SBA 7(a)": {
        borrower: [
            "SBA Form 1919",
            "Personal Financial Statement (SBA Form 413)",
        ],
        company: [
            "Business Financial Statements (3 years)",
            "Business Tax Returns (3 years)",
            "Business Plan and Projections",
        ],
        subjectProperty: []
    },
    "SBA 504": {
        borrower: [
            "Personal Financial Statement for all guarantors",
        ],
        company: [
            "SBA Form 1244",
            "Business Financial Statements (3 years)",
        ],
        subjectProperty: [
            "Project Cost Details",
        ]
    },
    "Land Acquisition": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
        ],
        subjectProperty: [
            "Purchase Agreement",
            "Feasibility Study",
            "Zoning and Entitlement Documents",
            "Environmental Report",
            "Appraisal",
        ]
    },
    "Mezzanine Loans": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
            "Sponsor Financials",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
            "Capital Stack overview",
        ],
        subjectProperty: [
            "Senior Debt Term Sheet",
            "Full Project Pro-forma",
        ]
    },
    "Mobilization Funding": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Personal Asset Statement",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
            "Company Financials",
        ],
        subjectProperty: [
            "Executed Contract for the project",
            "Detailed Use of Funds",
        ]
    },
    "Equipment Financing": {
        borrower: [
            "Application Form",
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
        ],
        company: [
            "Company Asset Statement",
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Debt Schedule",
            "Business Financials (if over $100k)",
        ],
        subjectProperty: [
            "Equipment Quote or Invoice",
        ]
    },
    "Default": {
        borrower: ["ID/Driver's License", "Personal Financial Statement", "Credit Report"],
        company: ["EIN Certificate", "Formation Documentation", "Operating Agreement/Bylaws"],
        subjectProperty: ["Purchase and Sale Agreement", "Appraisal Report"]
    }
}
