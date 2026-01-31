import styled from 'styled-components';
import SubTitle from './SubTitle.jsx';

const Title = styled.div`
  font-size: 34px;
  font-weight: 600;
  padding: 20px 0;
`;

const Basics = ({ basics }) => {
  return (
    <div>
      <Title>{basics.name}</Title>
      <SubTitle>Professional Summary</SubTitle>
      <p>{basics.summary}</p>
    </div>
  );
};

export default Basics;
