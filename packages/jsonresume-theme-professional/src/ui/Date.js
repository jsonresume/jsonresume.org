import styled from 'styled-components';

const Text = styled.div`
  font-style: italic;
  font-size: 13px;
`;

const Date = ({ date }) => {
  // @todo - format date here
  return <Text>{date ?? 'Present'}</Text>;
};

export default Date;
