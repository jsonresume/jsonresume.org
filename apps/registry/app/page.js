import SignIn from './components/SignIn';
import { auth } from '../auth';
import { Octokit, App } from 'octokit';
import { find } from 'lodash';
import axios from 'axios';
import Editor from '@monaco-editor/react';

export default async function Page(props) {
  const session = await auth();
  const octokit = new Octokit({ auth: session.accessToken });
  const { data } = await octokit.rest.users.getAuthenticated();

  const username = data.login;
  const gists = await octokit.rest.gists.list({ per_page: 100 });
  let resumeGist = null;

  const resumeUrl = find(gists.data, (f) => {
    // console.log({ f });
    return f.files['resume.json'];
  });

  const gistId = resumeUrl.id;
  console.log({ resumeUrl, resumeGist });
  const fullResumeGistUrl = `https://gist.githubusercontent.com/${username}/${gistId}/raw?cachebust=${new Date().getTime()}`;
  const resumeRes = await axios({
    method: 'GET',
    headers: { 'content-type': 'application/json' },
    url: fullResumeGistUrl,
  });

  const resume = resumeRes.data;

  console.log({ resume });
  //   console.log('Hello, %s', data);
  return (
    <div>
      Hello, Dashboard Page! asds
      <SignIn />
      <div>
        More to come (read the homepage for instructions on how to use the
        registry)
        <br />
        https://github.com/jsonresume/jsonresume.org
        <br />
        <a href="https://registry.jsonresume.org/resumes">view all resumes</a>
        {JSON.stringify(resume, null, 2)}
      </div>
    </div>
  );
}
