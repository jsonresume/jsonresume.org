'use client';

import React, { Component, type ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { ErrorFallback } from './ErrorFallback';

// ============================================================================
// Types
// ============================================================================

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ============================================================================
// Error Boundary
// ============================================================================

export class PathwaysErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log to error reporting service
    logger.error(
      { error: error.message, componentStack: errorInfo.componentStack },
      'Pathways Error Boundary caught an error'
    );
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback
          error={this.state.error}
          resetError={this.handleReset}
          title="Pathways Error"
          description="Something went wrong in the Pathways career exploration tool."
        />
      );
    }

    return this.props.children;
  }
}

export default PathwaysErrorBoundary;
