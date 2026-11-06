import type { PostHog, PostHogConfig } from 'posthog-js';

/**
 * PostHog in the browser, loaded after the page is idle so it never delays
 * the first paint. Cookieless: nothing is stored on the device, and PostHog
 * counts visitors with a hash that changes daily, as our own resume
 * analytics do. Everything goes through /ingest on our domain.
 */
export const browserOptions = (
  uiHost: string,
  country?: string
): Partial<PostHogConfig> => ({
  api_host: '/ingest',
  ui_host: uiHost,
  defaults: '2026-08-30',
  cookieless_mode: 'always',
  // The router uses the History API; page views follow it.
  capture_pageview: 'history_change',
  capture_pageleave: true,
  capture_exceptions: true,
  person_profiles: 'identified_only',
  respect_dnt: true,
  // Typing in the editor is resume text: never recorded.
  disable_session_recording: true,
  disable_surveys: true,
  // Cookieless mode drops the address before PostHog could place it.
  before_send: country
    ? (event) =>
        event && { ...event, properties: { ...event.properties, country } }
    : undefined,
});

/** The visitor's country from Cloudflare's trace, which fronts the site. */
export const countryOf = (trace: string) =>
  /^loc=([A-Z]{2})$/m.exec(trace)?.[1];

const country = () =>
  fetch('/cdn-cgi/trace')
    .then((r) => (r.ok ? r.text() : ''))
    .then(countryOf)
    .catch(() => undefined);

let client: Promise<PostHog> | undefined;

const later = (run: () => void) =>
  typeof window.requestIdleCallback === 'function'
    ? window.requestIdleCallback(run, { timeout: 4000 })
    : window.setTimeout(run, 1);

/** Starts PostHog once; without a project token it stays off. */
export function startPostHog(token: string | undefined, uiHost: string) {
  if (!token || client) return;
  client = new Promise((resolve) =>
    later(() => {
      void Promise.all([import('posthog-js'), country()]).then(
        ([{ default: posthog }, where]) => {
          posthog.init(token, browserOptions(uiHost, where));
          resolve(posthog);
        }
      );
    })
  );
}

const withClient = (run: (posthog: PostHog) => void) => {
  void client?.then(run);
};

/** Ties this page load's events to an account: by id, with the username only. */
export const identify = (accountId: string, username: string) =>
  withClient((posthog) => posthog.identify(accountId, { username }));

/** On sign out: later events belong to nobody. */
export const forget = () => withClient((posthog) => posthog.reset());

/** An error React caught, so it never reached window.onerror. */
export const captureError = (error: unknown) =>
  withClient((posthog) => posthog.captureException(error));
