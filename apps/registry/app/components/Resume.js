'use server';

import SignIn from './SignIn';
import { auth } from '../../auth';
import { Octokit, App } from 'octokit';
import { find } from 'lodash';
import axios from 'axios';
import ResumeEditor from './ResumeEditor';

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

  async function updateGist(resume) {
    'use server';

    // const response = await octokit.rest.gists.update({
    //   gist_id: gistId,
    //   files: {
    //     'resume.json': {
    //       content: resume,
    //     },
    //   },
    // });
    console.log('what happens');
    // console.log({ response });
    return null;
  }

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
        <ResumeEditor
          resume={JSON.stringify(resume, undefined, 2)}
          updateGist={updateGist}
        />
      </div>
    </div>
  );
}
