import styled from 'styled-components';

const Name = styled.div`
  font-weight: 600;
  font-size: 1.4rem;
`;

const List = styled.div`
  font-size: 1.4rem;
  margin-left: 5px;
`;

const Container = styled.div`
  margin-bottom: 5px;
  display: flex;
  align-items: baseline;
`;

const OneLineList = ({ name, items }) => {
  return (
    <Container>
      <Name>{name}:</Name>
      <List>
        <div class="secondary">{items.join(', ')}</div>
      </List>
    </Container>
  );
};

export default OneLineList;
