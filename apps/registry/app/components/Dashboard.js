'use server';
import SignIn from './SignIn';
import { auth } from '../../auth';
import { Octokit, App } from 'octokit';
import { find } from 'lodash';
import axios from 'axios';
import ResumeEditor from './ResumeEditor';
import fetch from 'node-fetch';

// @todo - add json schema to editor
//codesandbox.io/p/sandbox/monaco-editor-json-validation-example-gue0q?file=%2Fsrc%2FApp.js

export default async function Page(props) {
  const session = await auth();
  console.log({ session });
  let resume = null;
  let gistId = null;
  if (session) {
    const octokit = new Octokit({ auth: session.accessToken });
    const { data } = await octokit.rest.users.getAuthenticated();

    const username = data.login;
    const gists = await octokit.rest.gists.list({ per_page: 100 });
    let resumeGist = null;

    const resumeUrl = find(gists.data, (f) => {
      // console.log({ f });
      return f.files['resume.json'];
    });

    gistId = resumeUrl.id;
    const fullResumeGistUrl = `https://gist.githubusercontent.com/${username}/${gistId}/raw?cachebust=${new Date().getTime()}`;
    const resumeRes = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      url: fullResumeGistUrl,
    });
    resume = resumeRes.data;
  }

  async function updateGist(resume) {
    'use server';
    const octokit = new Octokit({ auth: session.accessToken });

    if (gistId) {
      const response = await octokit.rest.gists.update({
        gist_id: gistId,
        files: {
          'resume.json': {
            content: resume,
          },
        },
      });
    }
    return;
    // const url = 'https://api.github.com/gists/' + gistId;
    // const token = session.accessToken;

    // const headers = {
    //   Accept: 'application/vnd.github+json',
    //   Authorization: `Bearer ${token}`,
    //   'X-GitHub-Api-Version': '2022-11-28',
    //   'Content-Type': 'application/json',
    // };

    // const data = {
    //   files: {
    //     'resume.json': {
    //       content: resume,
    //     },
    //   },
    // };
    // fetch(url, {
    //   method: 'PATCH',
    //   headers: headers,
    //   body: JSON.stringify(data),
    // })
    //   .then((response) => response.json())
    //   .then((data) => console.log(JSON.stringify(data)))
    //   .catch((error) => console.error('Error:', error));

    // return null;
  }

  //   console.log('Hello, %s', data);

  return (
    <div>
      Hello, Dashboard Page! asds
      <SignIn />
      <div>
        <ResumeEditor
          resume={JSON.stringify(resume, undefined, 2)}
          updateGist={updateGist}
        />
      </div>
    </div>
  );
}
