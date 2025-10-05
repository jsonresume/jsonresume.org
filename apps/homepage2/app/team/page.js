import { team } from './data/teamData';
import { ContributingSection } from './components/ContributingSection';
import { TeamSection } from './components/TeamSection';
import { HistorySection } from './components/HistorySection';

export const metadata = {
  title: 'Team — JSON Resume',
  description: 'Meet the team behind JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/team/',
};

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
