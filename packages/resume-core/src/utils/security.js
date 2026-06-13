/**
 * Security utilities for @jsonresume/core
 *
 * The implementations now live in @jsonresume/utils (framework-free). This
 * module re-exports them so existing imports
 * (`import { safeUrl } from '@jsonresume/core'` and the internal
 * `../utils/security.js` imports in Link/ContactInfo) keep working unchanged.
 */
export {
  safeUrl,
  getLinkRel,
  sanitizeHtml,
  isExternalUrl,
} from '@jsonresume/utils/url';
