/**
 * Extracts username from session user metadata
 * Tries user_name first, falls back to preferred_username
 */
export const getUsername = (session: any): string | undefined => {
  return (
    session?.user?.user_metadata?.user_name ||
    session?.user?.user_metadata?.preferred_username
  );
};
