import styled from 'styled-components';

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
