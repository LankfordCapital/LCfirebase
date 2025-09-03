import { NextRequest, NextResponse } from 'next/server';
import { ResidentialNOOLoanApplicationServiceAdmin } from '@/lib/residential-noo-loan-application-service-admin';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting Ground Up Construction application creation...');
    
    const body = await request.json();
    const { userId, brokerId } = body;
    
    console.log('Received request with userId:', userId, 'brokerId:', brokerId);

    if (!userId || !brokerId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: userId, brokerId'
      }, { status: 400 });
    }

    // Create a new instance of the admin service
    console.log('Creating ResidentialNOOLoanApplicationServiceAdmin instance...');
    const residentialNOOService = new ResidentialNOOLoanApplicationServiceAdmin();
    console.log('Service instance created successfully');

    // Create a Ground Up Construction application
    const applicationId = await residentialNOOService.createApplication(
      userId,
      brokerId,
      'residential_noo_ground_up_construction'
    );

    // Now populate it with comprehensive Ground Up Construction data
    await residentialNOOService.updateFields(applicationId, {
      'borrowerInfo.fullName': 'John Construction Investor',
      'borrowerInfo.email': 'john@construction.com',
      'borrowerInfo.phone': '555-123-4567',
      'borrowerInfo.dateOfBirth': '1980-05-15',
      'borrowerInfo.ssn': '123-45-6789',
      'borrowerInfo.maritalStatus': 'married',
      'borrowerInfo.dependents': 2,
      'borrowerInfo.currentAddress': {
        street: '123 Main Street',
        city: 'Austin',
        state: 'TX',
        zipCode: '78701',
        yearsAtAddress: 5,
        rentOrOwn: 'own'
      },
      'borrowerInfo.employmentStatus': 'self_employed',
      'borrowerInfo.annualIncome': 120000,
      'borrowerInfo.creditScore': 750,
      'borrowerInfo.citizenship': 'us_citizen'
    });

    // Update loan details
    await residentialNOOService.updateFields(applicationId, {
      'loanDetails.loanAmount': 500000,
      'loanDetails.loanPurpose': 'Ground up construction of single-family investment property',
      'loanDetails.term': 18,
      'loanDetails.propertyType': 'single_family',
      'loanDetails.downPayment': 100000,
      'loanDetails.downPaymentPercentage': 20,
      'loanDetails.propertyValue': 600000,
      'loanDetails.constructionBudget': 400000
    });

    // Update property info
    await residentialNOOService.updateFields(applicationId, {
      'propertyInfo.propertyType': 'single_family',
      'propertyInfo.propertyUse': 'construction',
      'propertyInfo.propertyCondition': 'needs_repair',
      'propertyInfo.yearBuilt': 0, // New construction
      'propertyInfo.squareFootage': 2500,
      'propertyInfo.lotSize': 8000,
      'propertyInfo.bedrooms': 4,
      'propertyInfo.bathrooms': 3,
      'propertyInfo.propertyTaxes': 0, // New construction
      'propertyInfo.insuranceCost': 2400
    });

    // Update financial info
    await residentialNOOService.updateFields(applicationId, {
      'financialAssets.totalAssets': 300000,
      'financialLiabilities.totalLiabilities': 50000,
      'incomeInformation.employmentIncome.total': 120000,
      'incomeInformation.totalMonthlyIncome': 10000,
      'incomeInformation.totalAnnualIncome': 120000
    });

    // Update Ground Up Construction specific info
    await residentialNOOService.updateGroundUpConstructionInfo(applicationId, {
      landAcquisitionCost: 150000,
      developmentCosts: 250000,
      afterConstructionValue: 600000,
      constructionLoanAmount: 500000,
      constructionInfo: {
        generalContractor: {
          name: 'ABC Construction & Development LLC',
          license: 'TECB123456',
          insurance: {
            generalLiability: 'GL789012',
            workersComp: 'WC345678',
            buildersRisk: 'BR901234'
          },
          experience: 20,
          references: [
            { 
              name: 'Sarah Johnson', 
              phone: '555-111-2222', 
              project: 'Modern Home Build - Cedar Park', 
              year: '2023' 
            },
            { 
              name: 'Mike Chen', 
              phone: '555-333-4444', 
              project: 'Luxury Condo Development - Downtown', 
              year: '2022' 
            }
          ]
        },
        constructionPlans: {
          architecturalPlans: 'https://example.com/architectural-plans.pdf',
          structuralPlans: 'https://example.com/structural-plans.pdf',
          sitePlans: 'https://example.com/site-plans.pdf'
        },
        constructionBudget: {
          totalBudget: 400000,
          breakdown: [
            { category: 'Foundation & Site Work', amount: 45000, percentage: 11 },
            { category: 'Framing & Structure', amount: 80000, percentage: 20 },
            { category: 'Electrical', amount: 35000, percentage: 9 },
            { category: 'Plumbing', amount: 32000, percentage: 8 },
            { category: 'HVAC', amount: 28000, percentage: 7 },
            { category: 'Interior Finishes', amount: 60000, percentage: 15 },
            { category: 'Exterior Finishes', amount: 45000, percentage: 11 },
            { category: 'Landscaping & Driveway', amount: 20000, percentage: 5 },
            { category: 'Appliances & Fixtures', amount: 25000, percentage: 6 },
            { category: 'Permits & Fees', amount: 15000, percentage: 4 }
          ],
          contingency: 40000,
          softCosts: 35000,
          hardCosts: 365000
        },
        drawSchedule: [
          { phase: 'Foundation Complete', percentage: 15, amount: 60000, conditions: ['Foundation inspection passed', 'Site work complete'], timeline: 'Month 1' },
          { phase: 'Framing Complete', percentage: 35, amount: 140000, conditions: ['Framing inspection passed', 'Roof sheathing complete'], timeline: 'Month 3' },
          { phase: 'Mechanical Complete', percentage: 55, amount: 220000, conditions: ['Electrical inspection passed', 'Plumbing inspection passed', 'HVAC complete'], timeline: 'Month 5' },
          { phase: 'Interior Complete', percentage: 80, amount: 320000, conditions: ['Interior finishes complete', 'Appliances installed'], timeline: 'Month 7' },
          { phase: 'Final Inspection', percentage: 100, amount: 400000, conditions: ['Final inspection passed', 'Certificate of occupancy'], timeline: 'Month 9' }
        ],
        constructionTimeline: {
          startDate: '2024-03-01',
          completionDate: '2024-12-01',
          duration: 9,
          milestones: [
            { milestone: 'Foundation Complete', date: '2024-04-01', percentage: 15 },
            { milestone: 'Framing Complete', date: '2024-06-01', percentage: 40 },
            { milestone: 'Mechanical Complete', date: '2024-08-01', percentage: 65 },
            { milestone: 'Interior Complete', date: '2024-10-01', percentage: 85 },
            { milestone: 'Final Inspection', date: '2024-12-01', percentage: 100 }
          ]
        },
        insurance: {
          buildersRisk: {
            carrier: 'Construction Insurance Co',
            policyNumber: 'BR123456',
            coverage: 500000,
            premium: 5000
          },
          generalLiability: {
            carrier: 'Construction Insurance Co',
            policyNumber: 'GL789012',
            coverage: 1000000,
            premium: 3000
          }
        }
      }
    });

    // Mark sections as completed
    await residentialNOOService.markSectionCompleted(applicationId, 'borrowerInfoCompleted');
    await residentialNOOService.markSectionCompleted(applicationId, 'loanDetailsCompleted');
    await residentialNOOService.markSectionCompleted(applicationId, 'propertyInfoCompleted');
    await residentialNOOService.markSectionCompleted(applicationId, 'financialInfoCompleted');
    await residentialNOOService.markSectionCompleted(applicationId, 'constructionInfoCompleted');

    return NextResponse.json({
      success: true,
      message: 'Ground Up Construction application created and populated successfully',
      data: {
        applicationId,
        program: 'residential_noo_ground_up_construction',
        borrowerName: 'John Construction Investor',
        loanAmount: 500000,
        constructionBudget: 400000,
        timeline: '9 months',
        afterConstructionValue: 600000
      }
    });

  } catch (error) {
    console.error('Error creating Ground Up Construction application:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
