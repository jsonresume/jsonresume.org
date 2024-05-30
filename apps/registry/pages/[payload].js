import React, { useEffect, useState } from 'react';

export async function getStaticProps({ params }) {
  const { payload, theme } = params;
  const template = require('./lib/template').default;
  console.log({ theme });

  const resume = await template(payload, { theme: theme || 'elegant' });

  return {
    props: {
      username: payload,
      resume,
    },
  };
}

export async function getInitialProps(context) {
  console.log('get intial props', context);
  const theme = context.query.theme;

  return {
    props: {
      theme,
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: ['/any', { params: { payload: 'any' } }],
    fallback: 'blocking',
  };
}

const Resume = ({ username, resume, theme }) => {
  console.log({ theme });
  const { error, valid, output } = resume;

  if (!error && valid && output?.content) {
    return (
      <>
        <div dangerouslySetInnerHTML={{ __html: resume.output.content }} />
      </>
    );
  }

  return (
    <div>
      hello
      <br />
      <br />
      <pre>output: {resume.output}</pre>
      <pre>error: {resume.error}</pre>
      <pre>valid: {resume.valid ? 'yes' : 'no'}</pre>
    </div>
  );
};

export default Resume;
