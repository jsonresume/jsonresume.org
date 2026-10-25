import { Container, Hero, LinkCard, Section } from '@jsonresume/ui';
import { excerpt, type PostLink } from '@repo/content/documents';
import type { BlogPost } from '@repo/domain';
import { formatDate } from '../format';
import { paths } from '../links';
import { MarkdownContent } from '../MarkdownContent';
import { SiteLink } from '../SiteLink';
import * as s from './pages.css';
import * as l from './shared/layout.css';

const byYear = (posts: ReadonlyArray<BlogPost>) => {
  const years = new Map<string, BlogPost[]>();
  for (const post of posts) {
    const year = post.date.slice(0, 4);
    years.set(year, [...(years.get(year) ?? []), post]);
  }
  return [...years];
};

/** Every post, newest first, grouped by year, each with an excerpt. */
export function BlogIndexPage({ posts }: { posts: ReadonlyArray<BlogPost> }) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
        eyebrow="Blog"
        title="News from the project"
        lede="Releases, integrations and milestones, as they were announced."
      />
      <Section spacing="lg">
        <Container>
          {byYear(posts).map(([year, list]) => (
            <section
              key={year}
              className={s.year}
              aria-labelledby={`year-${year}`}
            >
              <h2 id={`year-${year}`} className={s.yearTitle}>
                {year}
              </h2>
              <ol className={s.postList}>
                {list.map((post) => (
                  <li key={post.slug} className={s.postItem}>
                    <p className={s.byline}>
                      <time dateTime={post.date}>{formatDate(post.date)}</time>{' '}
                      · {post.author}
                    </p>
                    <h3 className={s.postTitle}>
                      <SiteLink href={paths.post(post.slug)}>
                        {post.title}
                      </SiteLink>
                    </h3>
                    <p className={l.body}>
                      {post.description ?? excerpt(post.body)}
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </Container>
      </Section>
    </>
  );
}

function Neighbour({ post, label }: { post: PostLink; label: string }) {
  return (
    <LinkCard
      asChild
      eyebrow={label}
      title={post.title}
      description={formatDate(post.date)}
    >
      <SiteLink href={paths.post(post.slug)} />
    </LinkCard>
  );
}

export interface BlogPostPageProps {
  post: BlogPost;
  newer?: PostLink;
  older?: PostLink;
}

/** One post in a reading column, with the posts either side of it. */
export function BlogPostPage({ post, newer, older }: BlogPostPageProps) {
  return (
    <>
      <Hero
        size="compact"
        align="start"
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
          <article className={l.prose}>
            <MarkdownContent>{post.body}</MarkdownContent>
          </article>
          <nav aria-label="More posts" className={s.neighbours}>
            {older ? <Neighbour post={older} label="Older" /> : <span />}
            {newer ? <Neighbour post={newer} label="Newer" /> : <span />}
          </nav>
          <p className={s.back}>
            <SiteLink href={paths.blog}>All posts</SiteLink>
          </p>
        </Container>
      </Section>
    </>
  );
}
