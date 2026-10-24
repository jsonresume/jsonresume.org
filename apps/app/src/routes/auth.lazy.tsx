import {
  ChooseUsernamePage,
  ForgotPasswordPage,
  ResetPasswordPage,
  SignInPage,
  SignUpPage,
} from '@repo/auth-pages';
import { account } from '@repo/content/pages';
import { paths, SiteLink } from '@repo/site';
import { createLazyRoute, getRouteApi } from '@tanstack/react-router';

const signIn = getRouteApi('/_site/signin');
const signUp = getRouteApi('/_site/signup');
const reset = getRouteApi('/_site/reset-password');

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
        forgotLink={
          <SiteLink href={paths.forgotPassword}>
            {account.forgotPassword.link}
          </SiteLink>
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

export const ForgotPasswordRoute = createLazyRoute('/_site/forgot-password')({
  component: function ForgotPasswordRouteComponent() {
    return (
      <ForgotPasswordPage
        signInLink={
          <SiteLink href={paths.signIn}>{account.forgotPassword.back}</SiteLink>
        }
      />
    );
  },
});

export const ResetPasswordRoute = createLazyRoute('/_site/reset-password')({
  component: function ResetPasswordRouteComponent() {
    const { token } = reset.useSearch();
    return (
      <ResetPasswordPage
        token={token}
        forgotLink={
          <SiteLink href={paths.forgotPassword}>
            {account.forgotPassword.link}
          </SiteLink>
        }
      />
    );
  },
});
