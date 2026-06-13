/**
 * @jsonresume/ats-validator/constants
 *
 * Public, reusable building blocks that power the individual ATS checks.
 * These are re-exported (not redefined) from the check modules so the values
 * never drift from what `validateATS` actually uses. Useful for library
 * authors who want to lint or highlight ATS issues without running the full
 * validator.
 *
 * NOTE: `EMOJI_RE` carries the global (`g`) flag, so it is stateful via
 * `lastIndex`. Use `String#match` / `String#matchAll`, or reset `lastIndex`
 * before reusing it with `RegExp#test` / `RegExp#exec`.
 */

// Fonts
export { ATS_FRIENDLY_FONTS, ATS_BAD_FONTS } from './checks/fonts.js';

// Icon fonts, emoji and decorative special characters
export {
  ICON_FONT_TOKENS,
  ICON_FONT_FAMILIES,
  EMOJI_RE,
  PRIVATE_USE_RE,
} from './checks/special-characters.js';

// Contact information detection
export { EMAIL_RE, PHONE_RE, countDigits } from './checks/contact-info.js';
