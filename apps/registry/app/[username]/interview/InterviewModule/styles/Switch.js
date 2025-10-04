import styled from 'styled-components';

export const Switch = styled.div`
  position: fixed;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Option = styled.div`
  background-color: ${(props) => (props.active ? '#df4848' : '#999')};
  width: 140px;
  cursor: pointer;
  height: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.active ? '#fbfbfb' : '#222')};
  &:hover {
    background-color: #ea8989;
  }

  &:first-child {
    border-radius: 5px 0px 0px 5px;
  }
  &:last-child {
    border-radius: 0px 5px 5px 0px;
  }
`;
