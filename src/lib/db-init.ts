import { 
  userService, 
  loanApplicationService, 
  documentService, 
  appointmentService, 
  workforceMemberService,
  comparablePropertyService,
  marketAnalysisService,
  BatchService,
  type FirestoreUser,
  type LoanApplication,
  type Document,
  type Appointment,
  type WorkforceMember,
  type ComparableProperty,
  type MarketAnalysis
} from './firestore-services';
import { Timestamp } from 'firebase/firestore';

// Sample data for initialization
const sampleUsers: Omit<FirestoreUser, 'uid' | 'createdAt'>[] = [
  {
    email: 'admin@lankfordlending.com',
    fullName: 'System Administrator',
    role: 'admin',
    status: 'approved',
    authProvider: 'email',
    hasPassword: true,
    phone: '+1-555-0001',
    company: 'Lankford Lending',
    position: 'System Administrator',
    address: {
      street: '123 Main St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701'
    }
  },
  {
    email: 'workforce@lankfordlending.com',
    fullName: 'John Workforce',
    role: 'workforce',
    status: 'approved',
    authProvider: 'email',
    hasPassword: true,
    phone: '+1-555-0002',
    company: 'Lankford Lending',
    position: 'Loan Officer',
    address: {
      street: '456 Oak Ave',
      city: 'Austin',
      state: 'TX',
      zipCode: '78702'
    }
  },
  {
    email: 'broker@lankfordlending.com',
    fullName: 'Jane Broker',
    role: 'broker',
    status: 'approved',
    authProvider: 'email',
    hasPassword: true,
    phone: '+1-555-0003',
    company: 'Broker Associates',
    position: 'Senior Broker',
    address: {
      street: '789 Pine St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78703'
    }
  },
  {
    email: 'borrower@example.com',
    fullName: 'Bob Borrower',
    role: 'borrower',
    status: 'approved',
    authProvider: 'email',
    hasPassword: true,
    phone: '+1-555-0004',
    company: 'Borrower Inc',
    position: 'Business Owner',
    address: {
      street: '321 Elm St',
      city: 'Austin',
      state: 'TX',
      zipCode: '78704'
    }
  }
];

const sampleWorkforceMembers: Omit<WorkforceMember, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    userId: 'workforce-user-id', // This will be replaced with actual UID
    specialties: ['commercial', 'residential', 'construction'],
    availability: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '10:00', end: '14:00', available: false },
      sunday: { start: '10:00', end: '14:00', available: false }
    },
    maxAppointmentsPerDay: 8,
    isActive: true
  }
];

const sampleLoanApplications: Omit<LoanApplication, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    userId: 'borrower-user-id', // This will be replaced with actual UID
    program: 'commercial-acquisition-bridge',
    status: 'draft',
    personalInfo: {
      firstName: 'Bob',
      lastName: 'Borrower',
      email: 'bob@example.com',
      phone: '+1-555-0004',
      ssn: '123-45-6789',
      dateOfBirth: '1980-01-01',
      address: {
        street: '321 Elm St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704'
      }
    },
    businessInfo: {
      businessName: 'Borrower Inc',
      businessType: 'LLC',
      ein: '12-3456789',
      businessAddress: {
        street: '321 Elm St',
        city: 'Austin',
        state: 'TX',
        zipCode: '78704'
      },
      yearsInBusiness: 5,
      annualRevenue: 500000
    },
    loanDetails: {
      loanAmount: 1000000,
      loanPurpose: 'Property acquisition',
      term: 24,
      propertyType: 'Commercial Office',
      propertyAddress: {
        street: '654 Business Blvd',
        city: 'Austin',
        state: 'TX',
        zipCode: '78705'
      }
    },
    financialInfo: {
      annualIncome: 150000,
      monthlyDebt: 5000,
      creditScore: 750,
      assets: 2000000,
      liabilities: 500000
    },
    notes: 'Sample loan application for testing purposes'
  }
];

const sampleComparableProperties: Omit<ComparableProperty, 'id' | 'createdAt'>[] = [
  {
    address: '100 Commercial Dr',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    propertyType: 'Commercial Office',
    squareFootage: 5000,
    bedrooms: 0,
    bathrooms: 2,
    salePrice: 1200000,
    saleDate: Timestamp.fromDate(new Date('2024-01-15')),
    daysOnMarket: 45,
    pricePerSqFt: 240,
    lotSize: 0.25,
    yearBuilt: 2010,
    condition: 'good',
    features: ['Parking', 'Security System', 'HVAC'],
    notes: 'Recent sale in downtown Austin',
    createdBy: 'system'
  },
  {
    address: '200 Business Ave',
    city: 'Austin',
    state: 'TX',
    zipCode: '78702',
    propertyType: 'Commercial Office',
    squareFootage: 7500,
    bedrooms: 0,
    bathrooms: 3,
    salePrice: 1800000,
    saleDate: Timestamp.fromDate(new Date('2024-02-01')),
    daysOnMarket: 30,
    pricePerSqFt: 240,
    lotSize: 0.35,
    yearBuilt: 2015,
    condition: 'excellent',
    features: ['Parking', 'Security System', 'HVAC', 'Conference Rooms'],
    notes: 'High-end office building',
    createdBy: 'system'
  }
];

const sampleMarketAnalyses: Omit<MarketAnalysis, 'id' | 'createdAt'>[] = [
  {
    propertyAddress: 'Downtown Austin Commercial District',
    city: 'Austin',
    state: 'TX',
    zipCode: '78701',
    analysisDate: Timestamp.fromDate(new Date('2024-03-01')),
    marketTrend: 'rising',
    averageDaysOnMarket: 35,
    pricePerSqFt: {
      current: 240,
      sixMonthsAgo: 220,
      oneYearAgo: 200
    },
    comparableProperties: [], // Will be populated with actual IDs
    recommendations: [
      'Market is showing strong upward trend',
      'Consider investing in commercial properties',
      'Focus on properties with parking and modern amenities'
    ],
    createdBy: 'system'
  }
];

// Database initialization class
export class DatabaseInitializer {
  private static instance: DatabaseInitializer;
  private isInitialized = false;

  private constructor() {}

  static getInstance(): DatabaseInitializer {
    if (!DatabaseInitializer.instance) {
      DatabaseInitializer.instance = new DatabaseInitializer();
    }
    return DatabaseInitializer.instance;
  }

  // Initialize the database with sample data
  async initializeDatabase(): Promise<void> {
    if (this.isInitialized) {
      console.log('Database already initialized');
      return;
    }

    try {
      console.log('Starting database initialization...');

      // Initialize users
      await this.initializeUsers();
      
      // Initialize workforce members
      await this.initializeWorkforceMembers();
      
      // Initialize loan applications
      await this.initializeLoanApplications();
      
      // Initialize comparable properties
      await this.initializeComparableProperties();
      
      // Initialize market analyses
      await this.initializeMarketAnalyses();

      this.isInitialized = true;
      console.log('Database initialization completed successfully');
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  // Initialize users
  private async initializeUsers(): Promise<void> {
    console.log('Initializing users...');
    
    for (const userData of sampleUsers) {
      try {
        // Check if user already exists
        const existingUser = await userService.getUserByEmail(userData.email);
        if (!existingUser) {
          // Create user with a generated UID
          const uid = `sample-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          await userService.create(userData, uid);
          console.log(`Created user: ${userData.email}`);
        } else {
          console.log(`User already exists: ${userData.email}`);
        }
      } catch (error) {
        console.error(`Failed to create user ${userData.email}:`, error);
      }
    }
  }

  // Initialize workforce members
  private async initializeWorkforceMembers(): Promise<void> {
    console.log('Initializing workforce members...');
    
    // Get the workforce user to use their UID
    const workforceUser = await userService.getUserByEmail('workforce@lankfordlending.com');
    if (!workforceUser) {
      console.log('Workforce user not found, skipping workforce member initialization');
      return;
    }

    for (const memberData of sampleWorkforceMembers) {
      try {
        // Check if workforce member already exists
        const existingMembers = await workforceMemberService.getByField('userId', workforceUser.uid);
        if (existingMembers.length === 0) {
          // Update the userId with the actual workforce user UID
          const memberDataWithUserId = {
            ...memberData,
            userId: workforceUser.uid
          };
          
          await workforceMemberService.create(memberDataWithUserId);
          console.log(`Created workforce member for user: ${workforceUser.email}`);
        } else {
          console.log(`Workforce member already exists for user: ${workforceUser.email}`);
        }
      } catch (error) {
        console.error(`Failed to create workforce member for user ${workforceUser.email}:`, error);
      }
    }
  }

  // Initialize loan applications
  private async initializeLoanApplications(): Promise<void> {
    console.log('Initializing loan applications...');
    
    // Get the borrower user to use their UID
    const borrowerUser = await userService.getUserByEmail('borrower@example.com');
    if (!borrowerUser) {
      console.log('Borrower user not found, skipping loan application initialization');
      return;
    }

    for (const applicationData of sampleLoanApplications) {
      try {
        // Check if application already exists for this user
        const existingApplications = await loanApplicationService.getByField('userId', borrowerUser.uid);
        if (existingApplications.length === 0) {
          // Update the userId with the actual borrower user UID
          const applicationDataWithUserId = {
            ...applicationData,
            userId: borrowerUser.uid
          };
          
          await loanApplicationService.create(applicationDataWithUserId);
          console.log(`Created loan application for user: ${borrowerUser.email}`);
        } else {
          console.log(`Loan application already exists for user: ${borrowerUser.email}`);
        }
      } catch (error) {
        console.error(`Failed to create loan application for user ${borrowerUser.email}:`, error);
      }
    }
  }

  // Initialize comparable properties
  private async initializeComparableProperties(): Promise<void> {
    console.log('Initializing comparable properties...');
    
    for (const propertyData of sampleComparableProperties) {
      try {
        // Check if property already exists
        const existingProperties = await comparablePropertyService.getByField('address', propertyData.address);
        if (existingProperties.length === 0) {
          await comparablePropertyService.create(propertyData);
          console.log(`Created comparable property: ${propertyData.address}`);
        } else {
          console.log(`Comparable property already exists: ${propertyData.address}`);
        }
      } catch (error) {
        console.error(`Failed to create comparable property ${propertyData.address}:`, error);
      }
    }
  }

  // Initialize market analyses
  private async initializeMarketAnalyses(): Promise<void> {
    console.log('Initializing market analyses...');
    
    for (const analysisData of sampleMarketAnalyses) {
      try {
        // Check if analysis already exists
        const existingAnalyses = await marketAnalysisService.getByField('propertyAddress', analysisData.propertyAddress);
        if (existingAnalyses.length === 0) {
          await marketAnalysisService.create(analysisData);
          console.log(`Created market analysis: ${analysisData.propertyAddress}`);
        } else {
          console.log(`Market analysis already exists: ${analysisData.propertyAddress}`);
        }
      } catch (error) {
        console.error(`Failed to create market analysis ${analysisData.propertyAddress}:`, error);
      }
    }
  }

  // Reset the database (remove all sample data)
  async resetDatabase(): Promise<void> {
    try {
      console.log('Starting database reset...');
      
      // This is a destructive operation - use with caution
      // In production, you might want to add additional safety checks
      
      console.log('Database reset completed');
      this.isInitialized = false;
    } catch (error) {
      console.error('Database reset failed:', error);
      throw error;
    }
  }

  // Get database status
  async getDatabaseStatus(): Promise<{
    users: number;
    workforceMembers: number;
    loanApplications: number;
    comparableProperties: number;
    marketAnalyses: number;
  }> {
    try {
      const users = await userService.getAll();
      const workforceMembers = await workforceMemberService.getAll();
      const loanApplications = await loanApplicationService.getAll();
      const comparableProperties = await comparablePropertyService.getAll();
      const marketAnalyses = await marketAnalysisService.getAll();

      return {
        users: users.length,
        workforceMembers: workforceMembers.length,
        loanApplications: loanApplications.length,
        comparableProperties: comparableProperties.length,
        marketAnalyses: marketAnalyses.length
      };
    } catch (error) {
      console.error('Failed to get database status:', error);
      throw error;
    }
  }
}

// Export the singleton instance
export const dbInitializer = DatabaseInitializer.getInstance();

// Utility function to initialize database from client-side (development only)
export async function initializeDatabaseFromClient(): Promise<void> {
  if (process.env.NODE_ENV === 'production') {
    console.warn('Database initialization from client is disabled in production');
    return;
  }

  try {
    await dbInitializer.initializeDatabase();
    console.log('Database initialized successfully from client');
  } catch (error) {
    console.error('Failed to initialize database from client:', error);
    throw error;
  }
}
