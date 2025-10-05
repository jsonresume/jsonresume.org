import { TeamMemberCard } from './TeamMemberCard';

interface TeamMember {
  name: string;
  avatar: string;
  github: string;
  twitter?: string;
}

interface TeamSectionProps {
  coreTeam: TeamMember[];
  standardsCommittee: TeamMember[];
}

export function TeamSection({
  coreTeam,
  standardsCommittee,
}: TeamSectionProps) {
  return (
    <div className="col-sm-6 team">
      <h2>The Team</h2>
      <p>
        There are many contributors to JSON Resume, but these are our regular
        members who keep the show running:
      </p>
      <section>
        <h3>Core Team</h3>
        <div className="row">
          {coreTeam.map((member) => (
            <TeamMemberCard key={member.github} member={member} />
          ))}
        </div>
      </section>
      <section>
        <h3>Standards Committee</h3>
        <div className="row">
          {standardsCommittee.map((member) => (
            <TeamMemberCard key={member.github} member={member} />
          ))}
        </div>
      </section>
    </div>
  );
}
