import styled from 'styled-components';

const Text = styled.div`
  font-size: 22px;
  font-weight: 600;
`;

const SubTitle = ({ children }) => {
  return <Text>{children}</Text>;
};

export default SubTitle;
