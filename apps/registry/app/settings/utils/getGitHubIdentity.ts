/**
 * Finds and returns GitHub identity from user identities array
 */
export const getGitHubIdentity = (session: any) => {
  return session?.user?.identities?.find(
    (identity: any) => identity.provider === 'github'
  );
};

/**
 * Checks if user is connected to GitHub
 */
export const isGitHubConnected = (session: any): boolean => {
  return Boolean(
    session?.user?.identities?.some(
      (identity: any) => identity.provider === 'github'
    )
  );
};
