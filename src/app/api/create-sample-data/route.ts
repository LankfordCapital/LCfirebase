import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAuth, requireRole } from '@/lib/auth-utils-server';

export async function POST(request: NextRequest) {
  try {
    // Require authentication and admin role
    const authError = await requireAuth(request);
    if (authError) return authError;

    const roleError = await requireRole(request, ['admin']);
    if (roleError) return roleError;

    // Sample loan applications data
    const sampleApplications = [
      {
        id: 'sample-app-1',
        userId: 'sample-borrower-1',
        brokerId: '2gMmOSto7XXNzbNB7WahuzVFELv2', // Nate Marshall
        loanProgram: 'Fix and Flip',
        status: 'Under Review',
        loanAmount: 450000,
        borrowerInfo: {
          fullName: 'John Smith',
          email: 'john.smith@email.com',
          phone: '555-0123',
          dateOfBirth: '1985-03-15',
          ssn: '123-45-6789',
          address: {
            street: '123 Main St',
            city: 'Denver',
            state: 'CO',
            zipCode: '80202'
          },
          employmentStatus: 'self-employed',
          annualIncome: 120000,
          creditScore: 720
        },
        propertyInfo: {
          address: '456 Oak Avenue',
          city: 'Denver',
          state: 'CO',
          zipCode: '80203',
          propertyType: 'Single Family',
          purchasePrice: 400000,
          estimatedValue: 450000,
          ltv: 89
        },
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20')
      },
      {
        id: 'sample-app-2',
        userId: 'sample-borrower-2',
        brokerId: 'AtLmI1ikUVgdavE7gTWCzlRCtag2', // Kyle Hoffman
        loanProgram: 'DSCR',
        status: 'Approved',
        loanAmount: 750000,
        borrowerInfo: {
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@email.com',
          phone: '555-0456',
          dateOfBirth: '1980-07-22',
          ssn: '987-65-4321',
          address: {
            street: '789 Pine Street',
            city: 'Raleigh',
            state: 'NC',
            zipCode: '27601'
          },
          employmentStatus: 'employed',
          annualIncome: 150000,
          creditScore: 780
        },
        propertyInfo: {
          address: '321 Elm Drive',
          city: 'Raleigh',
          state: 'NC',
          zipCode: '27602',
          propertyType: 'Multi-Family',
          purchasePrice: 700000,
          estimatedValue: 750000,
          ltv: 93
        },
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-18')
      },
      {
        id: 'sample-app-3',
        userId: 'sample-borrower-3',
        brokerId: '2gMmOSto7XXNzbNB7WahuzVFELv2', // Nate Marshall
        loanProgram: 'Ground Up Construction',
        status: 'Funded',
        loanAmount: 1200000,
        borrowerInfo: {
          fullName: 'Michael Brown',
          email: 'michael.brown@email.com',
          phone: '555-0789',
          dateOfBirth: '1975-11-08',
          ssn: '456-78-9012',
          address: {
            street: '555 Cedar Lane',
            city: 'Denver',
            state: 'CO',
            zipCode: '80204'
          },
          employmentStatus: 'self-employed',
          annualIncome: 200000,
          creditScore: 750
        },
        propertyInfo: {
          address: '999 Maple Street',
          city: 'Denver',
          state: 'CO',
          zipCode: '80205',
          propertyType: 'Commercial',
          purchasePrice: 1000000,
          estimatedValue: 1200000,
          ltv: 83
        },
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2024-01-05')
      },
      {
        id: 'sample-app-4',
        userId: 'sample-borrower-4',
        brokerId: 'uUZ5mFz6AyNHqLrNbtbVvcDiFsM2', // Alessandro Ciaccio
        loanProgram: 'Bridge Loan',
        status: 'Missing Documents',
        loanAmount: 300000,
        borrowerInfo: {
          fullName: 'Emily Davis',
          email: 'emily.davis@email.com',
          phone: '555-0321',
          dateOfBirth: '1990-05-12',
          ssn: '789-01-2345',
          address: {
            street: '777 Palm Avenue',
            city: 'Sarasota',
            state: 'FL',
            zipCode: '34236'
          },
          employmentStatus: 'employed',
          annualIncome: 95000,
          creditScore: 680
        },
        propertyInfo: {
          address: '888 Beach Road',
          city: 'Sarasota',
          state: 'FL',
          zipCode: '34237',
          propertyType: 'Condo',
          purchasePrice: 280000,
          estimatedValue: 300000,
          ltv: 93
        },
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-28')
      },
      {
        id: 'sample-app-5',
        userId: 'sample-borrower-5',
        brokerId: 'WGhZAu2kRLXE34NdmoHCwHgbA5T2', // Boston Learned
        loanProgram: 'Fix and Flip',
        status: 'Under Review',
        loanAmount: 600000,
        borrowerInfo: {
          fullName: 'David Wilson',
          email: 'david.wilson@email.com',
          phone: '555-0654',
          dateOfBirth: '1988-09-30',
          ssn: '321-65-9870',
          address: {
            street: '222 Oak Street',
            city: 'Denver',
            state: 'CO',
            zipCode: '80206'
          },
          employmentStatus: 'self-employed',
          annualIncome: 140000,
          creditScore: 740
        },
        propertyInfo: {
          address: '333 Pine Avenue',
          city: 'Denver',
          state: 'CO',
          zipCode: '80207',
          propertyType: 'Single Family',
          purchasePrice: 550000,
          estimatedValue: 600000,
          ltv: 92
        },
        createdAt: new Date('2024-01-22'),
        updatedAt: new Date('2024-01-25')
      }
    ];

    // Create sample applications in Firestore
    const batch = adminDb.batch();
    
    for (const app of sampleApplications) {
      const appRef = adminDb.collection('enhancedLoanApplications').doc(app.id);
      batch.set(appRef, app);
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      message: `Created ${sampleApplications.length} sample loan applications`,
      applications: sampleApplications.map(app => ({
        id: app.id,
        brokerId: app.brokerId,
        borrowerName: app.borrowerInfo.fullName,
        loanProgram: app.loanProgram,
        status: app.status,
        loanAmount: app.loanAmount
      }))
    });

  } catch (error) {
    console.error('Error creating sample data:', error);
    return NextResponse.json(
      { error: 'Failed to create sample data' },
      { status: 500 }
    );
  }
}
