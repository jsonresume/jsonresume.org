import styled from 'styled-components';
import {
  FaMapPin,
  FaEnvelope,
  FaGithub,
  FaTwitter,
  FaPhoneAlt,
  FaLink,
  FaLinkedin,
} from 'react-icons/fa';
import Section from './Section';

const Title = styled.div`
  font-size: 3rem;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const BasicInfo = styled.div`
  display: flex;
  gap: 10px 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  svg {
    color: #000;
    margin-right: 5px;
    width: 10px;
  }

  a {
    color: inherit;
    text-decoration: none;
    &:hover {
      color: #000;
    }
  }
`;

const HeroComponent = ({ basics }) => {
  const { name, url, location, profiles, phone, email } = basics;

  const linkedin = profiles.find(({ network }) => network === 'linkedin');
  const github = profiles.find(({ network }) => network === 'github');
  const twitter = profiles.find(({ network }) => network === 'twitter');

  return (
    <Section>
      <Title>{name}</Title>
      <div className="secondary">
        <BasicInfo>
          {location && (
            <Info>
              <FaMapPin />
              {location.city}, {location.countryCode}
            </Info>
          )}
          {email && (
            <Info>
              <FaEnvelope />
              {email}
            </Info>
          )}
          {phone && (
            <Info>
              <FaPhoneAlt />
              {phone}
            </Info>
          )}
          {url && (
            <Info>
              <FaLink />
              <a href="{url}">{url}</a>
            </Info>
          )}
          {linkedin && (
            <Info>
              <FaLinkedin />
              <a href={`https://linkedin.com/${linkedin.username}`}>
                {linkedin.username}
              </a>
            </Info>
          )}
          {github && (
            <Info>
              <FaGithub />
              <a href={`https://github.com/${github.username}`}>
                {github.username}
              </a>
            </Info>
          )}
          {twitter && (
            <Info>
              <FaTwitter />
              <a href={`https://twitter.com/${twitter.username}`}>
                {twitter.username}
              </a>
            </Info>
          )}
        </BasicInfo>
      </div>
    </Section>
  );
};

export default HeroComponent;
