# Backend Implementation Documentation

## Overview

This document describes the comprehensive backend implementation for the Lankford Lending application using Firebase Firestore as the database. The backend is built with a layered architecture that provides clean separation of concerns and easy maintenance.

## Architecture

The backend follows a three-layer architecture:

1. **Data Layer** (`src/lib/firestore-services.ts`) - Direct Firestore operations
2. **Service Layer** (`src/lib/api-services.ts`) - Business logic and API responses
3. **API Layer** (`src/app/api/*/route.ts`) - Next.js API routes
4. **Hook Layer** (`src/hooks/use-backend.ts`) - React hooks for frontend integration

## Database Schema

### Collections

#### Users
```typescript
interface FirestoreUser {
  uid: string;
  email: string;
  fullName: string;
  role: 'borrower' | 'broker' | 'workforce' | 'admin';
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Timestamp;
  authProvider?: string;
  hasPassword?: boolean;
  updatedAt?: Timestamp;
  phone?: string;
  company?: string;
  position?: string;
  address?: Address;
}
```

#### Loan Applications
```typescript
interface LoanApplication {
  id?: string;
  userId: string;
  program: string;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  submittedAt?: Timestamp;
  personalInfo?: PersonalInfo;
  businessInfo?: BusinessInfo;
  loanDetails?: LoanDetails;
  financialInfo?: FinancialInfo;
  documents?: string[];
  notes?: string;
  assignedTo?: string;
}
```

#### Documents
```typescript
interface Document {
  id?: string;
  userId: string;
  applicationId?: string;
  type: 'personal' | 'business' | 'financial' | 'property' | 'other';
  category: string;
  name: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: Timestamp;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  reviewedBy?: string;
  reviewedAt?: Timestamp;
}
```

#### Appointments
```typescript
interface Appointment {
  id?: string;
  userId: string;
  workforceMemberId: string;
  date: Timestamp;
  duration: number;
  type: 'consultation' | 'document_review' | 'application_review' | 'closing';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Workforce Members
```typescript
interface WorkforceMember {
  id?: string;
  userId: string;
  specialties: string[];
  availability: WeeklyAvailability;
  maxAppointmentsPerDay: number;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Comparable Properties
```typescript
interface ComparableProperty {
  id?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType: string;
  squareFootage: number;
  bedrooms: number;
  bathrooms: number;
  salePrice: number;
  saleDate: Timestamp;
  daysOnMarket: number;
  pricePerSqFt: number;
  lotSize: number;
  yearBuilt: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  features: string[];
  notes?: string;
  createdAt: Timestamp;
  createdBy: string;
}
```

#### Market Analyses
```typescript
interface MarketAnalysis {
  id?: string;
  propertyAddress: string;
  city: string;
  state: string;
  zipCode: string;
  analysisDate: Timestamp;
  marketTrend: 'rising' | 'stable' | 'declining';
  averageDaysOnMarket: number;
  pricePerSqFt: PriceHistory;
  comparableProperties: string[];
  recommendations: string[];
  createdBy: string;
  createdAt: Timestamp;
}
```

## Usage Examples

### Using the Backend Hook

```typescript
import { useBackend } from '@/hooks/use-backend';

function UserManagement() {
  const {
    userState,
    getAllUsers,
    updateUserRole,
    updateUserStatus,
    isLoading,
    hasError
  } = useBackend();

  useEffect(() => {
    // Load users on component mount
    getAllUsers(1, 20, { role: 'borrower', status: 'pending' });
  }, []);

  const handleRoleUpdate = async (uid: string, newRole: string) => {
    try {
      await updateUserRole(uid, newRole as any);
      // Success - data will be automatically refreshed
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error: {hasError}</div>;

  return (
    <div>
      {userState.data?.map(user => (
        <div key={user.uid}>
          <h3>{user.fullName}</h3>
          <p>Role: {user.role}</p>
          <p>Status: {user.status}</p>
          <button onClick={() => handleRoleUpdate(user.uid, 'admin')}>
            Make Admin
          </button>
        </div>
      ))}
    </div>
  );
}
```

### Creating a Loan Application

```typescript
import { useBackend } from '@/hooks/use-backend';

function LoanApplicationForm() {
  const { createLoanApplication, isLoading } = useBackend();

  const handleSubmit = async (formData: any) => {
    try {
      const applicationData = {
        userId: 'current-user-id',
        program: 'commercial-acquisition-bridge',
        status: 'draft',
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          ssn: formData.ssn,
          dateOfBirth: formData.dateOfBirth,
          address: {
            street: formData.street,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode
          }
        },
        // ... other fields
      };

      const applicationId = await createLoanApplication(applicationData);
      console.log('Application created with ID:', applicationId);
    } catch (error) {
      console.error('Failed to create application:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating...' : 'Create Application'}
      </button>
    </form>
  );
}
```

### Managing Appointments

```typescript
import { useBackend } from '@/hooks/use-backend';

function AppointmentScheduler() {
  const {
    appointmentState,
    getAllAppointments,
    createAppointment,
    getAvailableSlots,
    isLoading
  } = useBackend();

  useEffect(() => {
    // Load appointments for current user
    getAllAppointments(1, 20, { userId: 'current-user-id' });
  }, []);

  const handleBookAppointment = async (appointmentData: any) => {
    try {
      const appointmentId = await createAppointment({
        userId: 'current-user-id',
        workforceMemberId: appointmentData.workforceMemberId,
        date: new Date(appointmentData.date),
        duration: 60,
        type: 'consultation',
        status: 'scheduled'
      });
      console.log('Appointment booked with ID:', appointmentId);
    } catch (error) {
      console.error('Failed to book appointment:', error);
    }
  };

  const handleCheckAvailability = async (workforceMemberId: string, date: Date) => {
    try {
      const availableSlots = await getAvailableSlots(workforceMemberId, date);
      console.log('Available slots:', availableSlots);
    } catch (error) {
      console.error('Failed to check availability:', error);
    }
  };

  return (
    <div>
      <h2>Your Appointments</h2>
      {appointmentState.data?.map(appointment => (
        <div key={appointment.id}>
          <h3>{appointment.type}</h3>
          <p>Date: {appointment.date.toDate().toLocaleDateString()}</p>
          <p>Status: {appointment.status}</p>
        </div>
      ))}
    </div>
  );
}
```

## API Endpoints

### Users

#### GET /api/users
Get all users with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `role` (string): Filter by user role
- `status` (string): Filter by user status
- `search` (string): Search by name or email

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "hasMore": true
  }
}
```

#### POST /api/users
Update user role or status.

**Request Body:**
```json
{
  "action": "updateRole",
  "uid": "user-id",
  "newRole": "admin"
}
```

### Loan Applications

#### GET /api/loan-applications
Get all loan applications with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by application status
- `program` (string): Filter by loan program
- `userId` (string): Filter by user ID
- `assignedTo` (string): Filter by assigned workforce member

#### POST /api/loan-applications
Create, submit, or assign loan applications.

**Request Body:**
```json
{
  "action": "create",
  "userId": "user-id",
  "program": "commercial-acquisition-bridge",
  "personalInfo": {...},
  "businessInfo": {...},
  "loanDetails": {...},
  "financialInfo": {...}
}
```

### Appointments

#### GET /api/appointments
Get all appointments with pagination and filtering.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)
- `status` (string): Filter by appointment status
- `type` (string): Filter by appointment type
- `userId` (string): Filter by user ID
- `workforceMemberId` (string): Filter by workforce member ID
- `date` (string): Filter by date (ISO string)

#### POST /api/appointments
Create appointments or get available slots.

**Request Body:**
```json
{
  "action": "create",
  "userId": "user-id",
  "workforceMemberId": "workforce-member-id",
  "date": "2024-01-15T10:00:00Z",
  "duration": 60,
  "type": "consultation"
}
```

## Database Initialization

The backend includes a database initialization system for development and testing:

```typescript
import { initializeDatabaseFromClient } from '@/lib/db-init';

// Initialize database with sample data (development only)
await initializeDatabaseFromClient();
```

This will create:
- Sample users (admin, workforce, broker, borrower)
- Sample workforce member profiles
- Sample loan applications
- Sample comparable properties
- Sample market analyses

## Security Rules

The Firestore security rules are configured in `firestore.rules` and provide:

- User authentication required for all operations
- Users can only access their own data
- Admin users have full access to all data
- Workforce users can read all user documents for management
- Role-based access control

## Error Handling

All backend operations include comprehensive error handling:

- Network errors
- Authentication errors
- Permission errors
- Validation errors
- Database errors

Errors are returned in a consistent format:

```typescript
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
```

## Performance Considerations

- **Pagination**: All list operations support pagination to handle large datasets
- **Filtering**: Server-side filtering to reduce data transfer
- **Caching**: React Query or SWR can be used for client-side caching
- **Batch Operations**: Support for batch operations to improve performance
- **Indexing**: Firestore indexes are automatically created for common queries

## Development Workflow

1. **Local Development**: Use Firebase emulator for local development
2. **Testing**: Use the database initialization script for test data
3. **Deployment**: Deploy to Firebase with `firebase deploy`
4. **Monitoring**: Use Firebase Console for monitoring and debugging

## Best Practices

1. **Always check authentication** before performing operations
2. **Use the hook layer** for frontend integration
3. **Handle loading and error states** in UI components
4. **Validate data** before sending to the backend
5. **Use pagination** for large datasets
6. **Implement proper error handling** for all operations
7. **Follow the established patterns** for consistency

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Ensure user is properly authenticated
2. **Permission Errors**: Check user role and Firestore security rules
3. **Data Not Loading**: Verify Firestore indexes are created
4. **Performance Issues**: Implement pagination and filtering

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
NEXT_PUBLIC_DEBUG=true
```

This will log all Firestore operations to the console.

## Conclusion

This backend implementation provides a robust, scalable foundation for the Lankford Lending application. The layered architecture ensures maintainability, while the comprehensive service layer provides easy integration with the frontend. The security rules and error handling ensure data integrity and user privacy.
