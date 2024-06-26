import styled from 'styled-components';
import List from './List';
import DateRange from './DateRange';

const Meta = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 2px;
`;

const Title = styled.div`
  font-weight: 600;
  font-size: 1.45rem;
  margin-bottom: 3px;
`;

const SubTitle = styled.div`
  font-style: italic;
  font-size: 1.4rem;
  margin-bottom: 3px;
`;

const Container = styled.div`
  margin-bottom: 10px;
`;

const Summary = styled.p`
  margin-bottom: 5px;
`;

const Experience = ({
  title,
  startDate,
  endDate,
  subTitle,
  summary,
  highlights,
}) => {
  return (
    <Container>
      <Meta>
        <Title>{title}</Title>
        <DateRange startDate={startDate} endDate={endDate} />
      </Meta>
      {subTitle && <SubTitle>{subTitle}</SubTitle>}
      <Summary>{summary}</Summary>
      <List items={highlights} />
    </Container>
  );
};

export default Experience;
