import styled from 'styled-components';

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
