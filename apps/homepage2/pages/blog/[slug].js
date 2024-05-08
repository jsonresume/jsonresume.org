import { getPostData, getAllPostSlugs } from '../../lib/posts';
import { DiscussionEmbed } from 'disqus-react';

export async function getStaticProps({ params }) {
  // Add the "await" keyword like this:
  console.log({ params });
  const postData = await getPostData(params.slug);

  return {
    props: {
      postData,
    },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostSlugs();
  return {
    paths,
    fallback: false,
  };
}

export default function blog({ postData }) {
  console.log({ postData });
  const disqusShortname = 'jsonresume';
  const disqusConfig = {
    url: `http://jsonresume.org${postData.url}`,
    identifier: postData.id,
    title: postData.title,
  };

  return (
    <>
      <header id="header">
        <div class="container">
          <div class="row">
            <div class="col-sm-12">
              <h1>News, features and releases</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="blog" class="container">
        <article class="row">
          <div class="col-sm-8 col-sm-offset-2">
            <header>
              <h2>{postData.title}</h2>
              <div class="date">posted {postData.date}</div>
            </header>
            <div class="content">
              <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            </div>
            <hr />
            <DiscussionEmbed
              shortname={disqusShortname}
              config={disqusConfig}
            />
          </div>
        </article>
      </div>
    </>
  );
}
