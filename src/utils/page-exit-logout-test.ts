/**
 * Production-ready page exit logout test utilities
 * This file provides testing utilities for the page exit logout functionality
 */

export interface PageExitTestResult {
  event: string;
  triggered: boolean;
  timestamp: number;
  userAgent: string;
  browser: string;
}

export class PageExitLogoutTester {
  private results: PageExitTestResult[] = [];
  private isTestMode = false;

  constructor() {
    this.isTestMode = process.env.NODE_ENV === 'development';
  }

  /**
   * Test page exit events and their reliability
   */
  public testPageExitEvents(): PageExitTestResult[] {
    if (!this.isTestMode || typeof window === 'undefined') {
      return [];
    }

    const events = [
      'beforeunload',
      'visibilitychange', 
      'pagehide',
      'blur',
      'unload'
    ];

    const browser = this.detectBrowser();
    
    events.forEach(eventName => {
      const result: PageExitTestResult = {
        event: eventName,
        triggered: false,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        browser
      };

      try {
        const handler = () => {
          result.triggered = true;
          result.timestamp = Date.now();
          console.log(`✅ Page exit event '${eventName}' triggered`);
        };

        if (eventName === 'visibilitychange') {
          document.addEventListener(eventName, handler, { once: true });
        } else {
          window.addEventListener(eventName, handler, { once: true });
        }

        this.results.push(result);
      } catch (error) {
        console.error(`❌ Error setting up test for '${eventName}':`, error);
        result.triggered = false;
        this.results.push(result);
      }
    });

    return this.results;
  }

  /**
   * Simulate page exit events for testing
   */
  public simulatePageExit(eventType: 'beforeunload' | 'visibilitychange' | 'pagehide' | 'blur'): void {
    if (!this.isTestMode || typeof window === 'undefined') {
      return;
    }

    try {
      if (eventType === 'visibilitychange') {
        // Simulate page becoming hidden
        Object.defineProperty(document, 'hidden', {
          writable: true,
          value: true
        });
        document.dispatchEvent(new Event('visibilitychange'));
      } else {
        window.dispatchEvent(new Event(eventType));
      }
      
      console.log(`🧪 Simulated page exit event: ${eventType}`);
    } catch (error) {
      console.error(`❌ Error simulating '${eventType}':`, error);
    }
  }

  /**
   * Get browser compatibility information
   */
  public getBrowserCompatibility(): Record<string, boolean> {
    if (typeof window === 'undefined') {
      return {};
    }

    return {
      beforeunload: 'onbeforeunload' in window,
      visibilitychange: 'visibilityState' in document,
      pagehide: 'onpagehide' in window,
      blur: 'onblur' in window,
      unload: 'onunload' in window,
      sessionStorage: typeof sessionStorage !== 'undefined',
      localStorage: typeof localStorage !== 'undefined',
      passiveListeners: this.supportsPassiveListeners()
    };
  }

  /**
   * Test session persistence behavior
   */
  public testSessionPersistence(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      const testKey = 'page-exit-logout-test';
      const testValue = Date.now().toString();
      
      sessionStorage.setItem(testKey, testValue);
      const retrieved = sessionStorage.getItem(testKey);
      
      sessionStorage.removeItem(testKey);
      
      return retrieved === testValue;
    } catch (error) {
      console.error('❌ Session storage test failed:', error);
      return false;
    }
  }

  /**
   * Get test results summary
   */
  public getTestSummary(): {
    totalEvents: number;
    triggeredEvents: number;
    successRate: number;
    browser: string;
    compatibility: Record<string, boolean>;
  } {
    const triggered = this.results.filter(r => r.triggered).length;
    const total = this.results.length;
    
    return {
      totalEvents: total,
      triggeredEvents: triggered,
      successRate: total > 0 ? (triggered / total) * 100 : 0,
      browser: this.detectBrowser(),
      compatibility: this.getBrowserCompatibility()
    };
  }

  private detectBrowser(): string {
    if (typeof window === 'undefined') {
      return 'unknown';
    }

    const ua = navigator.userAgent;
    
    if (ua.includes('Chrome')) return 'Chrome';
    if (ua.includes('Firefox')) return 'Firefox';
    if (ua.includes('Safari')) return 'Safari';
    if (ua.includes('Edge')) return 'Edge';
    if (ua.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }

  private supportsPassiveListeners(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    try {
      let supportsPassive = false;
      const opts = Object.defineProperty({}, 'passive', {
        get() {
          supportsPassive = true;
          return false;
        }
      });
      
      window.addEventListener('test', () => {}, opts);
      window.removeEventListener('test', () => {});
      
      return supportsPassive;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const pageExitTester = new PageExitLogoutTester();
