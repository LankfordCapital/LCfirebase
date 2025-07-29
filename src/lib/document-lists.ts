

type DocumentList = {
    borrower: string[];
    company: string[];
    subjectProperty: string[];
}

export const loanProgramDocumentLists: Record<string, DocumentList> = {
    "Residential NOO - Ground Up Construction": {
        borrower: [
            "ID/Driver's License (Borrower)",
            "Personal Financial Statement",
            "Credit Report (Borrower)",
            "Personal Asset Statement (Month 1)",
            "Personal Asset Statement (Month 2)",
            "Personal Asset Statement (Month 3)",
        ],
        company: [
            "EIN Certificate (Company)",
            "Formation Documentation (Company)",
            "Operating Agreement/Bylaws (Company)",
            "Partnership/Officer List (Company)",
            "Business License (Company)",
            "Certificate of Good Standing (Company)",
        ],
        subjectProperty: [
            "Executed Purchase Contract",
            "Evidence of Earnest Money Deposit",
            "Property HUD-1/Settlement Statement (if already purchased)",
            "30-Day Payoff Statement with Per Diem (if property has a mortgage)",
            "Marked Up Title Commitment",
            "Escrow Instructions",
            "Closing Protection Letter",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
            "General Contractor License",
            "General Contractor Insurance",
            "General Contractor Bond",
            "General Contractor's Contract to Build",
            "Construction Budget",
            "Projected Draw Schedule",
            "Approved or Pre-approved Plans",
            "Approved Permits",
            "Builder's Risk Insurance Quote",
            "Commercial Liability Insurance Quote"
        ]
    },
    "Residential NOO - Fix and Flip": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Proof of Funds for down payment and reserves"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Executed Purchase Contract",
            "Evidence of Earnest Money Deposit",
            "Marked Up Title Commitment",
            "Rehab Budget",
            "Property HUD-1/Settlement Statement (if already purchased)",
            "30-Day Payoff Statement with Per Diem (if property has a mortgage)",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Residential NOO - DSCR": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Purchase and Sale Agreement (or HUD-1 if refinance)",
            "Evidence of Earnest Money Deposit",
            "Lease Agreements for subject property (if applicable)",
            "Projected Lease Comparables (if vacant)",
            "Commercial Liability Insurance Quote",
            "Marked Up Title Commitment",
            "30-Day Payoff Statement with Per Diem (if a refinance)",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Residential NOO - Bridge": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Proof of Funds for down payment and reserves",
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Executed Purchase Contract",
            "Evidence of Earnest Money Deposit",
            "Marked Up Title Commitment",
            "Property HUD-1/Settlement Statement (if already purchased)",
            "30-Day Payoff Statement with Per diem (if property has a mortgage)",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Commercial - Ground Up Construction": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Executive Summary",
            "Pro-forma Projections (5 years, month-by-month)",
            "Sources and Uses Statement",
            "Environmental Report",
            "Purchase and Sale Agreement (or HUD-1 if refinance)",
            "Evidence of Earnest Money Deposit",
            "30-Day Payoff Statement with Per Diem (if refinance)",
            "Marked Up Title Commitment",
            "Builder's Risk Insurance Quote",
            "Commercial Liability Insurance Quote",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
            "Approved or Pre-approved Plans",
            "Approved Permits",
            "Construction Plans",
            "Construction Budget",
            "General Contractor's Contract to Build",
            "General Contractor License",
            "General Contractor Insurance",
            "General Contractor Bond",
            "Projected Draw Schedule"
        ]
    },
    "Commercial - Rehab Loans": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Current Rent Roll",
            "Rehab Budget and Plans",
            "Purchase Agreement (if applicable)",
            "Evidence of Earnest Money Deposit",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Commercial - Acquisition & Bridge": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Trailing 12-month Operating Statement",
            "Purchase Agreement",
            "Evidence of Earnest Money Deposit",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Commercial - Conventional Long Term Debt": {
        borrower: [
            "Personal Tax Returns (Last 2 Years)",
        ],
        company: [
            "Business Entity Tax Returns (Last 2 Years)",
        ],
        subjectProperty: [
            "Trailing 12-Month Profit & Loss Statement",
            "Previous Year 1 Profit & Loss Statement",
            "Previous Year 2 Profit & Loss Statement",
        ]
    },
    "Industrial - Ground Up Construction": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "General Contractor License",
            "General Contractor Insurance",
            "General Contractor Bond",
            "Purchase and Sale Agreement",
            "Evidence of Earnest Money Deposit",
            "Environmental Reports",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
            "Approved or Pre-approved Plans",
            "Approved Permits",
            "Construction Plans, Budget, and Timeline",
            "Construction Budget",
            "Projected Draw Schedule"
        ]
    },
    "Industrial - Rehab & Expansion": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "General Contractor License",
            "General Contractor Insurance",
            "General Contractor Bond",
            "Current Property Operating Statements",
            "Rehab/Expansion Plans and Budget",
            "Purchase Agreement (if applicable)",
            "Evidence of Earnest Money Deposit",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Industrial - Acquisition & Bridge": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Trailing 12-month Operating Statement for property",
            "Purchase Agreement",
            "Evidence of Earnest Money Deposit",
            "Marked Up Title Commitment",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Industrial - Long Term Debt": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned",
            "Personal Tax Returns (Last 2 Years)",
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Entity Tax Returns (Last 2 Years)",
        ],
        subjectProperty: [
            "Trailing 12-Month Profit & Loss Statement",
            "Previous Year 1 Profit & Loss Statement",
            "Previous Year 2 Profit & Loss Statement",
        ]
    },
    "Land Acquisition": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
        ],
        subjectProperty: [
            "Executed Purchase Contract",
            "Evidence of Earnest Money Deposit",
            "Feasibility Study",
            "Zoning and Entitlement Documents",
            "Environmental Report",
            "Property Tax Certificate",
            "Appraisal",
            "Collateral Desktop Analysis",
        ]
    },
    "Mezzanine Loans": {
        borrower: [
            "ID/Driver's License",
            "Personal Financial Statement",
            "Credit Report",
            "Sponsor Financials",
            "Experience",
            "Real Estate Owned"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
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
            "Credit Report"
        ],
        company: [
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
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
            "EIN Certificate",
            "Formation Documentation",
            "Operating Agreement/Bylaws",
            "Partnership/Officer List",
            "Business License",
            "Certificate of Good Standing",
            "Business Financials (if over $100k)",
        ],
        subjectProperty: [
            "Equipment Quote or Invoice",
        ]
    },
    "Default": {
        borrower: ["ID/Driver's License", "Personal Financial Statement", "Credit Report", "Experience", "Real Estate Owned"],
        company: ["EIN Certificate", "Formation Documentation", "Operating Agreement/Bylaws", "Partnership/Officer List", "Business License", "Certificate of Good Standing"],
        subjectProperty: ["Purchase and Sale Agreement", "Evidence of Earnest Money Deposit", "Appraisal Report", "Approved or Pre-approved Plans", "Approved Permits"]
    }
}
