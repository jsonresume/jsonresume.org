import styled from 'styled-components';

const Header = styled.header`
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #0b1f3a;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  color: #0b1f3a;
  margin-bottom: 0.5rem;
`;

const Label = styled.p`
  font-size: 1.125rem;
  color: #555;
  margin-bottom: 1.5rem;
  font-weight: 400;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  font-size: 0.95rem;
  color: #666;
`;

const ContactItem = styled.div`
  a {
    color: #0b1f3a;
    text-decoration: none;

    &:hover {
      border-bottom: 1px solid #0b1f3a;
    }
  }
`;

const Hero = ({ basics }) => {
  if (!basics) return null;

  return (
    <Header>
      <Name>{basics.name}</Name>
      {basics.label && <Label>{basics.label}</Label>}
      <ContactInfo>
        {basics.email && (
          <ContactItem>
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </ContactItem>
        )}
        {basics.phone && <ContactItem>{basics.phone}</ContactItem>}
        {basics.location?.city && (
          <ContactItem>
            {basics.location.city}
            {basics.location.region && `, ${basics.location.region}`}
          </ContactItem>
        )}
        {basics.url && (
          <ContactItem>
            <a href={basics.url} target="_blank" rel="noopener noreferrer">
              {basics.url.replace(/^https?:\/\//, '')}
            </a>
          </ContactItem>
        )}
        {basics.profiles?.map((profile, i) => (
          <ContactItem key={i}>
            <a href={profile.url} target="_blank" rel="noopener noreferrer">
              {profile.network}
            </a>
          </ContactItem>
        ))}
      </ContactInfo>
    </Header>
  );
};

export default Hero;
