import Image from 'next/image';

interface TeamMember {
  name: string;
  avatar: string;
  github: string;
  twitter?: string;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <div className="col-lg-6 person">
      <Image
        className="avatar"
        src={member.avatar}
        alt={`Avatar of ${member.name}.`}
        width="50"
        height="50"
      />
      <div className="name">{member.name}</div>
      <a className="github" href={`https://github.com/${member.github}`}>
        GitHub
      </a>
      {member.twitter && (
        <a className="twitter" href={`https://twitter.com/${member.twitter}`}>
          Twitter
        </a>
      )}
    </div>
  );
}
