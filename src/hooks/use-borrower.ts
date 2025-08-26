import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface BorrowerInfo {
  id?: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  propertyAddress?: string;
  companyName?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
}

export function useBorrower() {
  const [borrowers, setBorrowers] = useState<BorrowerInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Create a new borrower
  const createBorrower = async (borrowerData: Omit<BorrowerInfo, 'id'>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/borrowers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...borrowerData,
          createdBy: user?.uid || 'system'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create borrower');
      }

      const result = await response.json();
      
      // Add the new borrower to the local state
      setBorrowers(prev => [...prev, result.borrower]);
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create borrower';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Search for borrowers by email or phone
  const searchBorrowers = async (email?: string, phoneNumber?: string) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (email) params.append('email', email);
      if (phoneNumber) params.append('phoneNumber', phoneNumber);

      const response = await fetch(`/api/borrowers?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search borrowers');
      }

      const result = await response.json();
      setBorrowers(result.borrowers);
      
      return result.borrowers;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to search borrowers';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get borrower by ID
  const getBorrowerById = async (borrowerId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/borrowers/${borrowerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch borrower');
      }

      const result = await response.json();
      return result.borrower;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch borrower';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check if borrower already exists
  const checkBorrowerExists = async (email: string, phoneNumber: string) => {
    try {
      const existingBorrowers = await searchBorrowers(email, phoneNumber);
      return existingBorrowers.length > 0 ? existingBorrowers[0] : null;
    } catch (err) {
      console.error('Error checking borrower existence:', err);
      return null;
    }
  };

  return {
    borrowers,
    loading,
    error,
    createBorrower,
    searchBorrowers,
    getBorrowerById,
    checkBorrowerExists,
    setError
  };
}
