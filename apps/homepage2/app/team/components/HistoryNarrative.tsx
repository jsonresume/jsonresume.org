import Link from 'next/link';

export function HistoryNarrative() {
  return (
    <div className="history-narrative">
      <h3>A shared format for a familiar document</h3>
      <p>
        JSON Resume began in 2014 with Thomas Davis and Roland Sharp and a
        practical idea: give résumé information a shared, structured format so
        people could reuse it across tools and designs. A person’s experience,
        education and skills could live in a JSON file, with themes handling how
        that information appeared on the page. The project was already being
        discussed publicly on{' '}
        <a href="https://news.ycombinator.com/item?id=7996464">
          Hacker News in July 2014
        </a>
        .
      </p>
      <p>
        The public introduction came earlier than the maintainers had expected.
        In their{' '}
        <Link href="/blog/first-official-release/">first release post</Link>,
        Davis and Sharp described the work of turning that initial attention
        into a usable specification. On 31 July they released version 0.0.0,
        drawing a starting line for compatibility while acknowledging that the
        surrounding tools were still taking shape. The release included a
        command-line validator, an npm-based theme system and a standards
        committee. Its stated priority was to help individuals manage their own
        job-seeking profiles.
      </p>

      <h3>From a schema to an ecosystem</h3>
      <p>
        Portability depended on other tools being able to read and write the
        format. In September 2014, the team{' '}
        <Link href="/blog/first-service-integration/">
          announced its first service integration
        </Link>
        : Represent had added JSON Resume export. Importing a résumé was still
        an ambition in that announcement, but the export provided an early
        example of a separate service producing the shared format.
      </p>
      <p>
        Themes gave contributors another way to put the schema to work. By
        November, the project was showcasing designs including Elegant, Kendall
        and Paper, and{' '}
        <Link href="/blog/monthly-theme-competition-sponsored-by-hired/">
          announced a monthly theme competition sponsored by Hired.com
        </Link>
        , with a $250 prize and a winner chosen by votes. The format let theme
        authors explore different presentations while working with the same
        résumé data.
      </p>

      <h3>Keeping the project running</h3>
      <p>
        The{' '}
        <Link href="/blog/5th-birthday-new-features/">
          2019 fifth-birthday update
        </Link>{' '}
        looked back on slower development and a community contributing themes,
        parsers, converters, tools and services. Davis described that measured
        pace as useful for a project trying to provide a stable standard. The
        same post was candid about the cost and maintenance work behind the free
        résumé hosting and theme servers.
      </p>
      <p>
        That update introduced a hosting rewrite using serverless infrastructure
        and résumé files kept in users’ own GitHub Gists. A file named
        <code> resume.json</code> could be rendered at a registry address based
        on the user’s GitHub name, with a theme selected through the file’s
        metadata. It connected the shared format to a practical publishing
        workflow while moving résumé storage into users’ GitHub accounts.
      </p>

      <h3>A format people can build on</h3>
      <p>
        That original separation of data and presentation remains visible in the
        project: the <Link href="/schema/">schema</Link> describes résumé
        content, the <Link href="/themes/">theme gallery</Link> offers different
        ways to display it, and the{' '}
        <Link href="/projects/">projects directory</Link> collects tools built
        around it. The project’s history includes both changes to the
        specification and the ongoing work of people making the format useful in
        their own workflows.
      </p>
    </div>
  );
}
