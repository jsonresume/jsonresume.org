import { ChooseUsernamePage, SignInPage, SignUpPage } from '@repo/auth-pages';
import { account } from '@repo/content/pages';
import { paths, SiteLink } from '@repo/site';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const signIn = getRouteApi('/_site/signin');
const signUp = getRouteApi('/_site/signup');

export const SignInRoute = createLazyRoute('/_site/signin')({
  component: function SignInRouteComponent() {
    const { next, error } = signIn.useSearch();
    return (
      <SignInPage
        next={next}
        error={error}
        signUpLink={
          <SiteLink href={paths.signUp}>{account.signIn.footer.link}</SiteLink>
        }
      />
    );
  },
});

export const SignUpRoute = createLazyRoute('/_site/signup')({
  component: function SignUpRouteComponent() {
    const { next } = signUp.useSearch();
    return (
      <SignUpPage
        next={next}
        signInLink={
          <SiteLink href={paths.signIn}>{account.signUp.footer.link}</SiteLink>
        }
      />
    );
  },
});

export const ChooseUsernameRoute = createLazyRoute('/_site/signup/username')({
  component: function ChooseUsernameRouteComponent() {
    return (
      <ChooseUsernamePage
        restart={<SiteLink href={paths.signIn}>Sign in again</SiteLink>}
      />
    );
  },
});
