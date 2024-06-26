import styled from 'styled-components';

const Text = styled.div`
  font-style: italic;
  font-size: 1.4rem;
`;

const DateComponent = ({ date }) => {
  if (!date) {
    return <Text>Present</Text>;
  }

  const fullDate = new Date(date);

  const options = { year: 'numeric', month: 'long' };
  const formattedDate = fullDate.toLocaleDateString('en-US', options);

  return <Text>{formattedDate ?? 'Present'}</Text>;
};

export default DateComponent;
