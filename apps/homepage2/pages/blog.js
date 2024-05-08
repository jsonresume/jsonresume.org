import React from 'react';
// import { formatDate } from './utils'; // Helper function to format the date
import { getSortedPostsData } from '../lib/posts';

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

function Blog({ allPostsData }) {
  const posts = allPostsData;
  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>News, features and releases</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="blog" className="container">
        {posts.map((post) => (
          <article key={post.data.url} className="row">
            <div className="col-sm-8 col-sm-offset-2">
              <header>
                <h2>
                  <a href={post.data.url}>{post.data.title}</a>
                </h2>
                <div className="date">posted {formatDate(post.data.date)}</div>
              </header>
              <div className="content">
                <p>{post.excerpt}</p>
                <p>
                  <a href={post.data.url}>Read more…</a>
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default Blog;
