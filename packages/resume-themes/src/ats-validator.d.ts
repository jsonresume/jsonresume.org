// @jsonresume/ats-validator ships JavaScript only; the part the tests read.
declare module '@jsonresume/ats-validator' {
  export interface AtsIssue {
    severity: 'error' | 'warning' | 'info';
    message: string;
  }
  export interface AtsCheckResult {
    name: string;
    score: number;
    maxScore: number;
    passed: boolean;
    issues: AtsIssue[];
  }
  export function validateATS(html: string): {
    score: number;
    checks: AtsCheckResult[];
    issues: AtsIssue[];
  };
}
