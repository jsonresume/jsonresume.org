/**
 * Security utilities for @resume/core
 * Prevents XSS attacks and ensures safe URL handling
 */

/**
 * Sanitizes URLs to prevent XSS attacks
 * - Blocks javascript:, data:, vbscript: schemes
 * - Allows http:, https:, mailto:, tel: schemes
 * - Returns null for invalid/dangerous URLs
 *
 * @param {string} url - The URL to sanitize
 * @returns {string|null} - Safe URL or null if dangerous
 *
 * @example
 * safeUrl('https://example.com') // 'https://example.com'
 * safeUrl('javascript:alert(1)') // null
 * safeUrl('mailto:user@example.com') // 'mailto:user@example.com'
 */
export function safeUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Trim whitespace
  const trimmed = url.trim();

  // Check for dangerous protocols
  const dangerousProtocols = /^(javascript|data|vbscript|file|about):/i;
  if (dangerousProtocols.test(trimmed)) {
    console.warn(`[Security] Blocked dangerous URL: ${trimmed.slice(0, 50)}`);
    return null;
  }

  // Allow safe protocols
  const safeProtocols = /^(https?|mailto|tel|sms|ftp):/i;
  if (safeProtocols.test(trimmed)) {
    return trimmed;
  }

  // Allow relative URLs (starting with / or .)
  if (trimmed.startsWith('/') || trimmed.startsWith('.')) {
    return trimmed;
  }

  // Allow URLs without protocol (assume https)
  if (/^www\./i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // For other cases, check if it looks like a valid domain
  // Allow alphanumeric, hyphens, dots, and common TLDs
  if (/^[a-z0-9][a-z0-9.-]+\.[a-z]{2,}$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  // If we can't determine safety, return the original
  // (Let the browser handle it, but log a warning)
  console.warn(`[Security] Uncertain URL safety: ${trimmed.slice(0, 50)}`);
  return trimmed;
}

/**
 * Returns proper rel attribute for external links
 * Adds security attributes for links opening in new windows
 *
 * @param {string} url - The URL to check
 * @param {boolean} openInNewTab - Whether link opens in new tab
 * @returns {string} - rel attribute value
 *
 * @example
 * getLinkRel('https://example.com', true) // 'noopener noreferrer'
 * getLinkRel('mailto:user@example.com', false) // ''
 */
export function getLinkRel(url, openInNewTab = false) {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Only add security attributes for http(s) links opening in new tabs
  if (openInNewTab && /^https?:/i.test(url)) {
    return 'noopener noreferrer';
  }

  return '';
}

/**
 * Sanitizes HTML to prevent XSS
 * Simple implementation that escapes dangerous characters
 * For more complex needs, use DOMPurify
 *
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 *
 * @example
 * sanitizeHtml('<script>alert(1)</script>') // '&lt;script&gt;alert(1)&lt;/script&gt;'
 */
export function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Checks if a URL is external (different origin)
 *
 * @param {string} url - URL to check
 * @param {string} currentOrigin - Current site origin (default: window.location.origin if available)
 * @returns {boolean} - True if URL is external
 *
 * @example
 * isExternalUrl('https://example.com') // true (if on different domain)
 * isExternalUrl('/about') // false
 */
export function isExternalUrl(url, currentOrigin = null) {
  if (!url || typeof url !== 'string') {
    return false;
  }

  // Relative URLs are not external
  if (url.startsWith('/') || url.startsWith('.') || url.startsWith('#')) {
    return false;
  }

  // mailto:, tel:, etc. are not external in the HTTP sense
  if (/^(mailto|tel|sms):/i.test(url)) {
    return false;
  }

  // If no origin provided and we're in a browser, use window.location
  if (!currentOrigin && typeof window !== 'undefined') {
    currentOrigin = window.location.origin;
  }

  // If still no origin, we can't determine (assume external for safety)
  if (!currentOrigin) {
    return true;
  }

  try {
    const urlObj = new URL(url, currentOrigin);
    return urlObj.origin !== currentOrigin;
  } catch (e) {
    // Invalid URL, treat as external for safety
    return true;
  }
}
