import styled from 'styled-components';

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
