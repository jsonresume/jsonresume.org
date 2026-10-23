'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { PageState } from './page-state';

export interface ErrorBoundaryProps {
  children: ReactNode;
  /** Custom fallback; receives the error and a reset function. */
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode);
  /** Report the error (logging, monitoring). */
  onError?: (error: Error, info: ErrorInfo) => void;
  /** When any of these change, a failed boundary resets itself (e.g. the route or record id). */
  resetKeys?: unknown[];
  /** Panel-sized default fallback, for regions inside a page. */
  size?: 'page' | 'panel';
}

interface State {
  error: Error | null;
}

/**
 * Catches a crashed region so the rest of the page keeps working, and offers
 * Try again. Errors in event handlers aren't caught; handle those with toast.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, State> {
  override state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
  }

  override componentDidUpdate(prev: ErrorBoundaryProps) {
    const { resetKeys = [] } = this.props;
    const before = prev.resetKeys ?? [];
    if (this.state.error && resetKeys.some((k, i) => !Object.is(k, before[i])))
      this.reset();
  }

  reset = () => this.setState({ error: null });

  override render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const { fallback, size = 'panel' } = this.props;
    if (typeof fallback === 'function') return fallback(error, this.reset);
    if (fallback !== undefined) return fallback;
    return (
      <PageState
        kind="error"
        size={size}
        level={2}
        onRetry={this.reset}
        details={error.message}
      />
    );
  }
}
