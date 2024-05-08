import Image from 'next/image';

export default function Team() {
  const team = {
    coreTeam: [
      {
        name: 'Mattias Erming',
        avatar: 'https://avatars.githubusercontent.com/u/2502500?&s=50',
        github: 'erming',
        twitter: 'mattiaserming',
      },
      {
        name: 'Roland Sharp',
        avatar: 'https://avatars.githubusercontent.com/u/1858973?&s=50',
        github: 'rolandnsharp',
        twitter: 'rolandnsharp',
      },
      {
        name: 'Thomas Davis',
        avatar: 'https://avatars.githubusercontent.com/u/416209?&s=50',
        github: 'thomasdavis',
        twitter: 'ajaxdavis',
      },
      {
        name: 'Mike Chelen',
        avatar: 'https://avatars.githubusercontent.com/u/30691?&s=50',
        github: 'mchelen',
        twitter: 'mchelen',
      },
      {
        name: 'Mudassir Ali',
        avatar: 'https://avatars.githubusercontent.com/u/1861842?&s=50',
        github: 'mudassir0909',
        twitter: 'guesswhat4951',
      },
      {
        name: 'Peter Dave Hello',
        avatar: 'https://avatars.githubusercontent.com/u/3691490?&s=50',
        github: 'PeterDaveHello',
        twitter: 'PeterDaveHello',
      },
      {
        name: 'Seth Falco',
        avatar: 'https://avatars.githubusercontent.com/u/22801583?&s=50',
        github: 'SethFalco',
      },
    ],
    standardsCommittee: [
      {
        name: 'Daan Debie',
        avatar: 'https://avatars.githubusercontent.com/u/854991?s=50',
        github: 'DandyDev',
      },
      {
        name: 'Ursula Kallio',
        avatar: 'https://avatars.githubusercontent.com/u/1639324?s=50',
        github: 'osg',
      },
      {
        name: 'Walter Doekes',
        avatar: 'https://avatars.githubusercontent.com/u/1225014?s=50',
        github: 'wdoekes',
      },
    ],
  };
  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Meet the Team</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="team" className="container">
        <div className="row">
          <div className="col-sm-6 contributing">
            <h2>Contributing</h2>
            <p>
              The entire project is open sourced and split up amongst a number
              of modules which are hosted on GitHub. There are many areas of the
              project that need work:
            </p>
            <ul>
              <li>We need everyone to start making themes</li>
              <li>People who can offer advice on the standard</li>
              <li>
                The standard should be able to export to any format under the
                sun
              </li>
            </ul>
            <p>
              All the code for the project can be found here:
              <br />
              <a href="https://github.com/jsonresume">
                https://github.com/jsonresume
              </a>
            </p>
          </div>
          <div className="col-sm-6 team">
            <h2>The Team</h2>
            <p>
              There are many contributors to JSON Resume, but these are our
              regular members who keep the show running:
            </p>
            <section>
              <h3>Core Team</h3>
              <div className="row">
                {team.coreTeam.map((member) => (
                  <div key={member.github} className="col-lg-6 person">
                    <Image
                      className="avatar"
                      src={member.avatar}
                      alt={`Avatar of ${member.name}.`}
                      width="50"
                      height="50"
                    />
                    <div className="name">{member.name}</div>
                    <a
                      className="github"
                      href={`https://github.com/${member.github}`}
                    >
                      GitHub
                    </a>
                    {member.twitter && (
                      <a
                        className="twitter"
                        href={`https://twitter.com/${member.twitter}`}
                      >
                        Twitter
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
            <section>
              <h3>Standards Committee</h3>
              <div className="row">
                {team.standardsCommittee.map((member) => (
                  <div key={member.github} className="col-lg-6 person">
                    <Image
                      className="avatar"
                      src={member.avatar}
                      alt={`Avatar of ${member.name}.`}
                      width="50"
                      height="50"
                    />
                    <div className="name">{member.name}</div>
                    <a
                      className="github"
                      href={`https://github.com/${member.github}`}
                    >
                      GitHub
                    </a>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}
