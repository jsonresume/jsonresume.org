import styled from 'styled-components';
import { marked } from 'marked';
import Section from './Section';

const Summary = styled.div``;

const SummaryComponent = ({ basics }) => {
  const { summary } = basics;
  const htmlContent = summary ? marked.parse(summary, { breaks: true }) : '';

  return (
    <Section>
      <div className="secondary">
        <Summary dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </Section>
  );
};

export default SummaryComponent;
