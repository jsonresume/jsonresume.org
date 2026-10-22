import { team } from './data/teamData';
import { ContributingSection } from './components/ContributingSection';
import { TeamSection } from './components/TeamSection';
import { HistorySection } from './components/HistorySection';
import { pageMetadata } from '../lib/pageMetadata';

export const metadata = pageMetadata({
  title: 'Team — JSON Resume',
  description:
    'Meet the JSON Resume contributors and explore its documented history, starting in 2014.',
  url: 'https://jsonresume.org/team/',
});

export default function Team() {
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
          <ContributingSection />
          <TeamSection
            coreTeam={team.coreTeam}
            standardsCommittee={team.standardsCommittee}
          />
        </div>
        <div className="row">
          <HistorySection />
        </div>
      </div>
    </>
  );
}
