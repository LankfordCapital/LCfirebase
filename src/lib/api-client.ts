import { auth } from '@/lib/firebase-client';

/**
 * Get the current Firebase Auth token
 * @returns Promise<string | null> - The ID token or null if not authenticated
 */
export async function getAuthToken(): Promise<string | null> {
  if (!auth.currentUser) {
    return null;
  }
  
  try {
    const token = await auth.currentUser.getIdToken();
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Make an authenticated API request
 * @param url - The API endpoint URL
 * @param options - Fetch options
 * @returns Promise<Response> - The fetch response
 */
export async function authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAuthToken();
  
  if (!token) {
    throw new Error('No authentication token available');
  }
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };
  
  return fetch(url, {
    ...options,
    headers,
  });
}

/**
 * Make an authenticated GET request
 * @param url - The API endpoint URL
 * @param params - Query parameters
 * @returns Promise<Response> - The fetch response
 */
export async function authenticatedGet(url: string, params?: Record<string, string>): Promise<Response> {
  const urlObj = new URL(url, window.location.origin);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value);
    });
  }
  
  return authenticatedFetch(urlObj.toString(), {
    method: 'GET',
  });
}

/**
 * Make an authenticated POST request
 * @param url - The API endpoint URL
 * @param data - The request body data
 * @returns Promise<Response> - The fetch response
 */
export async function authenticatedPost(url: string, data?: any): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Make an authenticated PUT request
 * @param url - The API endpoint URL
 * @param data - The request body data
 * @returns Promise<Response> - The fetch response
 */
export async function authenticatedPut(url: string, data?: any): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

/**
 * Make an authenticated DELETE request
 * @param url - The API endpoint URL
 * @returns Promise<Response> - The fetch response
 */
export async function authenticatedDelete(url: string): Promise<Response> {
  return authenticatedFetch(url, {
    method: 'DELETE',
  });
}
