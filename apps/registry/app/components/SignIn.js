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
        This will let you sync a resume.json on your Github gists.
        <br />
        <br />
        If you already have one, it will load it into the editor.
        <br />
        <br />
        There is nothing stored on our servers.
      </div>
    </div>
  );
}
