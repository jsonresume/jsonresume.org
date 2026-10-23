'use client';

import {
  AuthCard,
  Button,
  Divider,
  Field,
  GithubIcon,
  Input,
  Link,
} from '@jsonresume/ui';
import * as styles from './sign-in.css';

export default function AuthCardSignIn() {
  return (
    <AuthCard
      title="Sign in"
      description="Welcome back. Your dashboard is one step away."
      footer={
        <>
          New to JSON Resume? <Link href="#">Create an account</Link>
        </>
      }
    >
      <Button variant="ink" className={styles.full}>
        <GithubIcon /> Continue with GitHub
      </Button>
      <Divider label="or" />
      <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
        <Field label="Email">
          <Input type="email" autoComplete="email" />
        </Field>
        <Field label="Password">
          <Input type="password" autoComplete="current-password" />
        </Field>
        <Button type="submit" variant="primary" className={styles.full}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}
