import { compose } from './emailLayout';
import { optional, type EmailLinks } from './emailToken';
import type { Mail } from './mailer';

export { DISCORD } from './emailLayout';

/** A verification email, given who it is for and the link's token. */
export type VerifyTemplate = (
  to: string,
  username: string,
  siteUrl: string,
  token: string
) => Mail;

const verifyUrl = (siteUrl: string, token: string) =>
  `${siteUrl}/api/auth/verify?token=${token}`;

/** A day of the week and date, such as "Tuesday, December 1". */
export const day = (date: Date) =>
  date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });

export const verificationEmail: VerifyTemplate = (
  to,
  username,
  siteUrl,
  token
) =>
  compose({
    to,
    site: siteUrl,
    subject: 'Confirm your email for JSON Resume',
    preview: `One click and your resume goes live at /@${username}.`,
    heading: 'Confirm your email',
    intro: [
      `Confirm your email to put your resume live at ${siteUrl}/@${username}.`,
    ],
    action: { label: 'Confirm your email', url: verifyUrl(siteUrl, token) },
    outro: [
      'The link works for 24 hours. If you didn’t sign up, ignore this email.',
    ],
  });

/** A day after sign-up, unconfirmed: a fresh link, as the first has run out. */
export const verifyReminderEmail =
  (heldUntil: Date, links: EmailLinks): VerifyTemplate =>
  (to, username, siteUrl, token) =>
    compose({
      to,
      site: siteUrl,
      subject: `Your page at /@${username} is waiting`,
      preview: 'Here is a fresh link to confirm your email.',
      heading: 'One step left',
      intro: [
        `You signed up for JSON Resume as @${username}, but your email isn’t confirmed yet, so your page isn’t live.`,
        'The first link has run out, so here is a new one.',
      ],
      action: { label: 'Confirm your email', url: verifyUrl(siteUrl, token) },
      outro: [
        `We hold the name @${username} for you until ${day(
          heldUntil
        )}. If you didn’t sign up, ignore this email.`,
      ],
      ...optional('You signed up at JSON Resume.', links),
    });

/** The day before an unconfirmed account and its name are let go. */
export const verifyLastCallEmail =
  (heldUntil: Date, links: EmailLinks): VerifyTemplate =>
  (to, username, siteUrl, token) =>
    compose({
      to,
      site: siteUrl,
      subject: `Last day to keep @${username} on JSON Resume`,
      preview: `Confirm your email by ${day(heldUntil)} to keep the name.`,
      heading: `Keep @${username}?`,
      intro: [
        `Your email was never confirmed, so on ${day(
          heldUntil
        )} we delete the account and free the name @${username} for someone else.`,
        'To keep it, confirm your email. It takes one click.',
      ],
      action: { label: 'Keep my account', url: verifyUrl(siteUrl, token) },
      outro: [
        'This is the last email about it. If you didn’t sign up, ignore it: the account goes away on its own.',
      ],
      ...optional('You signed up at JSON Resume.', links),
    });

export const passwordResetEmail = (
  to: string,
  username: string,
  siteUrl: string,
  token: string
) =>
  compose({
    to,
    site: siteUrl,
    subject: 'Reset your JSON Resume password',
    preview: 'Choose a new password for your account.',
    heading: 'Reset your password',
    intro: [
      `Hi @${username},`,
      'Someone asked to reset the password for your account. If it was you, choose a new one:',
    ],
    action: {
      label: 'Choose a new password',
      url: `${siteUrl}/reset-password?token=${token}`,
    },
    outro: [
      'The link works for one hour. If you didn’t ask, ignore this email: your password stays as it is.',
    ],
  });
