'use client';

import { useState, useEffect, useCallback } from 'react';

export interface WorkforceMember {
  uid: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  role: 'workforce' | 'admin';
  company: string;
  avatar: string; // Real profile photo URL or fallback avatar
}

export function useWorkforceMembers() {
  const [workforceMembers, setWorkforceMembers] = useState<WorkforceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWorkforceMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/workforce-members');
      const result = await response.json();

      if (result.success) {
        setWorkforceMembers(result.workforceMembers || []);
      } else {
        throw new Error(result.error || 'Failed to load workforce members');
      }
    } catch (error) {
      console.error('Error loading workforce members:', error);
      setError(error instanceof Error ? error.message : 'Failed to load workforce members');
      setWorkforceMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWorkforceMembers();
  }, [loadWorkforceMembers]);

  return {
    workforceMembers,
    loading,
    error,
    refresh: loadWorkforceMembers,
  };
}
