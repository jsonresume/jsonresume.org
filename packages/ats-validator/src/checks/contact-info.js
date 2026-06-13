/**
 * Check for ATS-parseable contact information.
 *
 * ATS systems extract the candidate's email and phone number as primary,
 * indexed fields. If those details only exist inside an image (a logo or a
 * "contact card" graphic) or are missing entirely, the parser drops them and
 * the application can be discarded as incomplete. They must therefore appear as
 * selectable text in the document body.
 */

// Matches the vast majority of real-world email addresses without being so
// permissive that prose like "see me @ the office" registers as a match.
const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

// Matches common phone formats: +1 (555) 123-4567, 555-123-4567,
// 555.123.4567, +44 20 7946 0958, etc. Requires at least 7 digits overall so
// short numeric strings (dates, zip codes) do not trigger a false positive.
const PHONE_RE =
  /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)[\s.-]?)?\d{2,4}[\s.-]?\d{2,4}[\s.-]?\d{0,4}/;

function countDigits(str) {
  return (str.match(/\d/g) || []).length;
}

export function checkContactInfo($) {
  const issues = [];
  let score = 10;

  const bodyText = ($('body').text() || $.root().text() || '').trim();

  // Email is the single most important field an ATS extracts.
  const emailMatch = bodyText.match(EMAIL_RE);
  // Also treat mailto: links as a valid, parseable email source.
  const hasMailto = $('a[href^="mailto:"]').length > 0;

  if (!emailMatch && !hasMailto) {
    issues.push({
      severity: 'error',
      message:
        'No email address found in selectable text - ATS systems index the email as a primary field; ensure it is real text (not inside an image or icon).',
    });
    score -= 5;
  }

  // Phone number: scan candidate substrings and confirm enough digits.
  const phoneMatch = bodyText.match(PHONE_RE);
  const hasTelLink = $('a[href^="tel:"]').length > 0;
  const phoneIsValid = phoneMatch && countDigits(phoneMatch[0]) >= 7;

  if (!phoneIsValid && !hasTelLink) {
    issues.push({
      severity: 'warning',
      message:
        'No phone number found in selectable text - include a phone number as plain text so ATS systems can extract it.',
    });
    score -= 3;
  }

  return {
    name: 'Contact Information',
    score: Math.max(0, score),
    maxScore: 10,
    passed: score >= 7,
    issues,
  };
}
