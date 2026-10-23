/**
 * Copy for signing up and in. Username rules and what each refusal means
 * follow docs/ACCOUNTS_AND_USERNAMES.md (checked 23 October 2026).
 */

export const signIn = {
  title: 'Sign in',
  description: 'Welcome back. See who reads your resume.',
  github: 'Continue with GitHub',
  or: 'or with email',
  email: 'Email',
  password: 'Password',
  submit: 'Sign in',
  footer: { text: 'New to JSON Resume?', link: 'Create an account' },
};

export const signUp = {
  title: 'Create your account',
  description:
    'Free and open source. Your resume stays plain JSON you can take anywhere.',
  github: 'Sign up with GitHub',
  githubNote:
    'Use GitHub if you already keep resume.json in a gist: your page picks it up.',
  or: 'or with email',
  username: 'Username',
  usernameHint: (name: string) =>
    `Your page: jsonresume.org/@${name || 'username'}`,
  email: 'Email',
  emailHint: 'We send a link to confirm it before your page goes live.',
  password: 'Password',
  passwordHint: 'At least 10 characters. A few words is fine.',
  submit: 'Create account',
  footer: { text: 'Already have an account?', link: 'Sign in' },
};

export const chooseUsername = {
  title: 'Choose your username',
  description: (login: string) =>
    `Someone on JSON Resume already has @${login.toLowerCase()}. Pick the name for your page; your gist resume comes with you.`,
  submit: 'Continue',
};

/** Live feedback while typing a username. */
export const username = {
  checking: 'Checking…',
  available: (name: string) => `@${name} is free.`,
  invalid: 'Use letters, numbers and single hyphens, up to 39 characters.',
  reserved: 'That name is reserved.',
  taken: 'Taken. Try another.',
  github:
    'That’s a GitHub username with a resume. If it’s yours, sign up with GitHub to claim it.',
};

/** What a failed request means, by error tag. */
export const errors: Record<string, string> = {
  InvalidCredentials: 'That email and password don’t match an account.',
  EmailTaken: 'An account already uses that email. Sign in instead.',
  TooManyAttempts: 'Too many attempts. Wait a few minutes, then try again.',
  GithubUnreachable:
    'GitHub isn’t answering, so we can’t confirm that username yet. Try again in a minute.',
  NoPendingSignup: 'That GitHub sign-in expired. Start again.',
  InvalidResume: 'That isn’t a resume we can use.',
  Unauthorized: 'Your session ended. Sign in again.',
  default: 'Something went wrong. Try again.',
};

/** The ?error= a GitHub sign-in can come back with. */
export const githubErrors: Record<string, string> = {
  github: 'GitHub sign-in didn’t finish. Try again.',
  'github-expired':
    'That sign-in took too long, or was opened twice. Try again.',
  'github-down': 'GitHub isn’t answering. Try again in a minute.',
  'github-unavailable': 'GitHub sign-in isn’t set up on this server.',
};
