import styled from 'styled-components';

export const Container = styled.div``;

export const HeaderContainer = styled.div`
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  height: 50px;
`;

export const UserSearchContainer = styled.div`
  width: 100%;
  background: #fff;
`;

export const UserSearch = styled.div`
  display: flex;
  height: 50px;
  justify-content: space-between;
  max-width: 800px;
  width: 100%;
  margin: auto;
  line-height: 40px;
  a,
  span {
    line-height: 50px;
  }
`;

export const Header = styled.div`
  background: #fff18f;
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 80px;
  font-weight: 500;
`;

export const Logo = styled.a`
  text-decoration: none;
  color: #000;
  &:active {
    color: #000;
  }
  &:visited {
    color: #000;
  }

  &:hover {
    color: #df4848;
  }
`;

export const Links = styled.div`
  width: 300px;
  display: flex;
  margin-left: 20px;
  justify-content: space-between;
  a {
    text-decoration: none;
    color: #000;
    &:visited {
      color: #000;
    }
  }
`;

export const Content = styled.div`
  max-width: 800px;
  margin: auto;
  margin-top: 100px;
  padding: 20px;
`;

export const UserSelect = styled.div`
  display: inline-block;
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
  width: 140px;
`;
