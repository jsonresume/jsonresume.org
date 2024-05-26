'use server';
import SignIn from './SignIn';
import { auth } from '../../auth';
import { Octokit, App } from 'octokit';
import { find } from 'lodash';
import axios from 'axios';
import ResumeEditor from './ResumeEditor';
import RecordButton from './RecordButton';
import fetch from 'node-fetch';

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

    const url = 'https://api.github.com/gists/' + gistId;
    const token = session.accessToken;

    const headers = {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    };

    const data = {
      files: {
        'resume.json': {
          content: resume,
        },
      },
    };
    fetch(url, {
      method: 'PATCH',
      headers: headers,
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => console.log(JSON.stringify(data)))
      .catch((error) => console.error('Error:', error));

    return null;
  }

  const resume = resumeRes.data;

  //   console.log('Hello, %s', data);

  return (
    <div>
      Hello, Dashboard Page! asds
      <SignIn />
      <div>
        <RecordButton />
        <ResumeEditor
          resume={JSON.stringify(resume, undefined, 2)}
          updateGist={updateGist}
        />
      </div>
    </div>
  );
}
