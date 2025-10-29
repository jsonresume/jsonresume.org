import styled from 'styled-components';
import Section from './Section';

const CertificateItem = styled.div`
  margin-bottom: 1.25rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 0.25rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Name = styled.h3`
  font-size: 1rem;
  color: #0b1f3a;
  margin: 0;
`;

const Date = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const Issuer = styled.div`
  font-size: 0.95rem;
  color: #555;
`;

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const Certificates = ({ certificates }) => {
  if (!certificates || certificates.length === 0) return null;

  return (
    <Section title="Certifications">
      {certificates.map((cert, i) => (
        <CertificateItem key={i}>
          <Header>
            <Name>
              {cert.url ? (
                <a href={cert.url} target="_blank" rel="noopener noreferrer">
                  {cert.name}
                </a>
              ) : (
                cert.name
              )}
            </Name>
            {cert.date && <Date>{formatDate(cert.date)}</Date>}
          </Header>
          {cert.issuer && <Issuer>{cert.issuer}</Issuer>}
        </CertificateItem>
      ))}
    </Section>
  );
};

export default Certificates;
