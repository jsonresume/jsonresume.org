import styled from 'styled-components';
import Section from './Section';
import Date from './Date';

const CertItem = styled.div`
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const CertName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const Issuer = styled.p`
  color: #ff6363;
  font-weight: 600;
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
`;

const CertDate = styled.p`
  color: #999;
  font-size: 0.9rem;
  font-style: italic;
`;

const CertLink = styled.a`
  display: inline-block;
  margin-top: 0.5rem;
  color: #ff6363;
  font-weight: 600;
  font-size: 0.9rem;
`;

const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <Section title="Certificates">
      {certificates.map((cert, i) => (
        <CertItem key={i}>
          <CertName>{cert.name}</CertName>
          {cert.issuer && <Issuer>{cert.issuer}</Issuer>}
          {cert.date && (
            <CertDate>
              <Date date={cert.date} />
            </CertDate>
          )}
          {cert.url && (
            <CertLink href={cert.url} target="_blank" rel="noopener noreferrer">
              View Certificate →
            </CertLink>
          )}
        </CertItem>
      ))}
    </Section>
  );
};

export default Certificates;
