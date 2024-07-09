import { FaGithub } from 'react-icons/fa';
import { signIn } from '../../auth';
import Button from './Button/Button';

export default function SignIn() {
  return (
    <div
      style={{
        fontSize: '1.4rem',
        width: 400,
        margin: 'auto',
        padding: '30px 30px',
      }}
    >
      <div>
        Edit your resume.json synced from Github Gist.
        <br />
        <br />
        If you already have one, it will load it into the editor.
        <br />
        <br />
        There is nothing stored on our servers.
      </div>
      <br />
      <form
        action={async () => {
          'use server';
          await signIn('github');
        }}
      >
        <Button
          type="submit"
          size="large"
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <FaGithub size="20px" style={{ marginRight: '10px' }} /> Signin with
          GitHub
        </Button>
      </form>
      <br />
      <br />
      <div style={{ color: '#777' }}>
        <h3 style={{ color: '#222' }}>#todo</h3>
        <ul>
          <li>full featured resume editor</li>
          <li style={{ textDecoration: 'line-through' }}>basic AI tools</li>
          <li>build social networking</li>
          <li>opt in notifications and analytics</li>
        </ul>
      </div>
    </div>
  );
}
