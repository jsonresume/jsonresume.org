import { BackLink, Container, PageHeader, Section } from '@jsonresume/ui';
import type { BlogPost } from '@repo/domain';
import { formatDate } from '../format';
import { paths } from '../links';
import { MarkdownContent } from '../MarkdownContent';
import { SiteLink } from '../SiteLink';
import * as s from './pages.css';

/** All posts, newest first, each with its date and author. */
export function BlogIndexPage({ posts }: { posts: ReadonlyArray<BlogPost> }) {
  return (
    <>
      <PageHeader
        title="Blog"
        description="Announcements and notes from the JSON Resume project."
      />
      <Section spacing="lg">
        <Container>
          <div className={s.proseColumn}>
            <ol className={s.postList}>
              {posts.map((post) => (
                <li key={post.slug} className={s.postItem}>
                  <h2 className={s.postTitle}>
                    <SiteLink href={paths.post(post.slug)}>
                      {post.title}
                    </SiteLink>
                  </h2>
                  <p className={s.byline}>
                    <time dateTime={post.date}>{formatDate(post.date)}</time> ·{' '}
                    {post.author}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </Section>
    </>
  );
}

export function BlogPostPage({ post }: { post: BlogPost }) {
  return (
    <>
      <PageHeader
        eyebrow={
          <>
            <time dateTime={post.date}>{formatDate(post.date)}</time> ·{' '}
            {post.author}
          </>
        }
        title={post.title}
      />
      <Section spacing="lg">
        <Container>
          <div className={s.proseColumn}>
            <article>
              <MarkdownContent>{post.body}</MarkdownContent>
            </article>
            <div className={s.back}>
              <BackLink asChild>
                <SiteLink href={paths.blog}>All posts</SiteLink>
              </BackLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
