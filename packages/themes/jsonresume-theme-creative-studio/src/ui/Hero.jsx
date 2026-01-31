import styled from 'styled-components';
import { FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt } from 'react-icons/fa';

const HeroContainer = styled.div`
  background: linear-gradient(135deg, #fff5f5 0%, #ffe8e8 100%);
  padding: 40px;
  border-radius: 12px;
  margin-bottom: 40px;
  text-align: center;
`;

const Name = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.2;
`;

const Label = styled.p`
  font-size: 1.25rem;
  color: #ff6363;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const ContactItem = styled.a`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.95rem;

  svg {
    color: #ff6363;
  }
`;

const Profiles = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
`;

const ProfileLink = styled.a`
  color: #ff6363;
  font-weight: 600;
  font-size: 0.95rem;
`;

const Hero = ({ basics }) => {
  if (!basics) return null;

  return (
    <HeroContainer>
      <Name>{basics.name}</Name>
      {basics.label && <Label>{basics.label}</Label>}

      <ContactInfo>
        {basics.email && (
          <ContactItem href={`mailto:${basics.email}`}>
            <FaEnvelope /> {basics.email}
          </ContactItem>
        )}
        {basics.phone && (
          <ContactItem href={`tel:${basics.phone}`}>
            <FaPhone /> {basics.phone}
          </ContactItem>
        )}
        {basics.url && (
          <ContactItem
            href={basics.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGlobe /> {basics.url.replace(/^https?:\/\//, '')}
          </ContactItem>
        )}
        {basics.location?.city && (
          <ContactItem as="span">
            <FaMapMarkerAlt /> {basics.location.city}
            {basics.location.region && `, ${basics.location.region}`}
          </ContactItem>
        )}
      </ContactInfo>

      {basics.profiles && basics.profiles.length > 0 && (
        <Profiles>
          {basics.profiles.map((profile, i) => (
            <ProfileLink
              key={i}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {profile.network}
            </ProfileLink>
          ))}
        </Profiles>
      )}
    </HeroContainer>
  );
};

export default Hero;
