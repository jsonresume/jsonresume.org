import styles from './SignIn.module.css';
import Button from '@jsonresume/ui/Button';

import { signIn } from '../../auth';

export default function SignIn() {
  return (
    <div className={styles.signin}>
      <form
        action={async () => {
          'use server';
          await signIn('github');
        }}
      >
        <Button type="submit">Signin with GitHub</Button>
      </form>
      <br />
      <div>
        There is nothing stored on our servers.
        <br />
        <br />
        This will let you sync a resume.gist on your Github account.
      </div>
    </div>
  );
}
