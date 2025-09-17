/**
 * Browser Refresh Persistence Test Utility
 * Use this to test that users stay logged in on refresh
 */

export class RefreshPersistenceTester {
  private static instance: RefreshPersistenceTester;
  private testResults: Array<{
    test: string;
    passed: boolean;
    timestamp: Date;
    details?: string;
  }> = [];

  private constructor() {}

  static getInstance(): RefreshPersistenceTester {
    if (!RefreshPersistenceTester.instance) {
      RefreshPersistenceTester.instance = new RefreshPersistenceTester();
    }
    return RefreshPersistenceTester.instance;
  }

  /**
   * Test if the page was loaded via refresh
   */
  testRefreshDetection(): boolean {
    try {
      // Method 1: Check performance navigation type
      const navigationType = performance.navigation?.type || 
                           (performance as any).getEntriesByType?.('navigation')?.[0]?.type;
      
      if (navigationType === 1) { // TYPE_RELOAD
        this.addTestResult('Refresh Detection - Method 1', true, 'Performance navigation type detected refresh');
        return true;
      }

      // Method 2: Check navigation entries
      const navigationEntries = performance.getEntriesByType('navigation');
      if (navigationEntries.length > 0) {
        const entry = navigationEntries[0] as any;
        if (entry.type === 'reload') {
          this.addTestResult('Refresh Detection - Method 2', true, 'Navigation entry type detected refresh');
          return true;
        }
      }

      // Method 3: Check if page was refreshed by looking at referrer
      if (document.referrer === window.location.href) {
        this.addTestResult('Refresh Detection - Method 3', true, 'Referrer matches current URL (refresh)');
        return true;
      }

      this.addTestResult('Refresh Detection', false, 'No refresh detected - this is a new page load');
      return false;
    } catch (error) {
      this.addTestResult('Refresh Detection', false, `Error: ${error}`);
      return false;
    }
  }

  /**
   * Test Firebase auth persistence
   */
  testAuthPersistence(): boolean {
    try {
      // Check if there's a Firebase auth user
      const hasAuthUser = typeof window !== 'undefined' && 
                         (window as any).firebase?.auth?.currentUser !== undefined;
      
      // Check localStorage for auth data
      const hasLocalStorageAuth = typeof window !== 'undefined' && 
                                 localStorage.getItem('firebase:authUser') !== null;
      
      // Check sessionStorage for auth data
      const hasSessionStorageAuth = typeof window !== 'undefined' && 
                                   sessionStorage.getItem('firebase:authUser') !== null;

      const hasAnyAuth = hasAuthUser || hasLocalStorageAuth || hasSessionStorageAuth;
      
      this.addTestResult('Auth Persistence', hasAnyAuth, 
        `Auth user: ${hasAuthUser}, LocalStorage: ${hasLocalStorageAuth}, SessionStorage: ${hasSessionStorageAuth}`);
      
      return hasAnyAuth;
    } catch (error) {
      this.addTestResult('Auth Persistence', false, `Error: ${error}`);
      return false;
    }
  }

  /**
   * Test if explicit logout flag is set
   */
  testExplicitLogoutFlag(): boolean {
    try {
      const explicitLogout = typeof window !== 'undefined' && 
                           localStorage.getItem('userExplicitlyLoggedOut') === 'true';
      
      this.addTestResult('Explicit Logout Flag', !explicitLogout, 
        explicitLogout ? 'User was explicitly logged out' : 'No explicit logout flag set');
      
      return !explicitLogout; // Should be false (no explicit logout)
    } catch (error) {
      this.addTestResult('Explicit Logout Flag', false, `Error: ${error}`);
      return false;
    }
  }

  /**
   * Run all tests
   */
  runAllTests(): {
    allPassed: boolean;
    results: Array<{ test: string; passed: boolean; timestamp: Date; details?: string }>;
    summary: string;
  } {
    this.testResults = [];
    
    const refreshDetected = this.testRefreshDetection();
    const authPersisted = this.testAuthPersistence();
    const noExplicitLogout = this.testExplicitLogoutFlag();
    
    const allPassed = refreshDetected && authPersisted && noExplicitLogout;
    
    const summary = allPassed 
      ? '✅ All tests passed - User should stay logged in on refresh'
      : '❌ Some tests failed - User might be logged out on refresh';
    
    return {
      allPassed,
      results: [...this.testResults],
      summary
    };
  }

  /**
   * Add a test result
   */
  private addTestResult(test: string, passed: boolean, details?: string): void {
    this.testResults.push({
      test,
      passed,
      timestamp: new Date(),
      details
    });
  }

  /**
   * Get test results
   */
  getTestResults(): Array<{ test: string; passed: boolean; timestamp: Date; details?: string }> {
    return [...this.testResults];
  }

  /**
   * Clear test results
   */
  clearResults(): void {
    this.testResults = [];
  }

  /**
   * Log test results to console
   */
  logResults(): void {
    console.log('🔄 === REFRESH PERSISTENCE TEST RESULTS ===');
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.test}: ${result.details || 'No details'}`);
    });
    console.log('==========================================');
  }
}

// Export singleton instance
export const refreshPersistenceTester = RefreshPersistenceTester.getInstance();

// Utility function to run tests
export const testRefreshPersistence = () => {
  const tester = RefreshPersistenceTester.getInstance();
  const results = tester.runAllTests();
  tester.logResults();
  return results;
};

// Auto-run tests on page load in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Run tests after a short delay to allow auth to initialize
  setTimeout(() => {
    testRefreshPersistence();
  }, 1000);
}
