import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { Octokit } from 'octokit';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user gist',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client, like an access token and user id from a provider.
      session.accessToken = token.accessToken;

      const octokit = new Octokit({ auth: session.accessToken });
      const { data } = await octokit.rest.users.getAuthenticated();
      const username = data.login;
      session.username = username;
      session.blah = 'blah';
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      // Always redirect to the base URL
      return baseUrl;
    },
  },
});
