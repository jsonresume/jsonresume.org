import styled from 'styled-components';

export const InputContainer = styled.div`
  position: fixed;
  background: #fff18f;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 120px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

export const Input = styled.input`
  bottom: 50px;
  height: 50px;
  border: none;
  border-radius: 5px;
  padding: 20px;
  font-size: 20px;
  box-sizing: border-box;
  outline: none;
  background-color: #fff;
  width: 100%;
  max-width: 570px;
  margin: 0 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  &:disabled {
    background-color: #f5f5f5;
  }
`;

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

export const MessagesContainer = styled.div`
  background: #fbfbfb;
  max-width: 600px;
  padding: 90px 30px;
  width: 100%;
  height: calc(100vh - 170px);
  margin: auto;
`;

export const Messages = styled.div`
  background: #fbfbfb;
  padding-bottom: 200px;
`;

export const Message = styled.div`
  background: #fbfbfb;
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
`;

export const Name = styled.span`
  font-weight: 600;
  flex: 0 0 100px;
  display: inline-block;
  text-align: right;
  margin-right: 5px;
`;

export const Helper = styled.div`
  font-size: 13px;
  margin-bottom: 15px;
  & a {
    text-decoration: none;
    font-weight: 600;
  }
  & a:hover {
    text-decoration: underline;
    color: #df4848;
  }
  & a:visited {
    color: #000;
  }
`;
