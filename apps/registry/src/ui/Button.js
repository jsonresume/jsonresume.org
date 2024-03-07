import styled from 'styled-components';

const Button = styled.button`
  background: #df4848;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 12px;
  cursor: pointer;
  letter-spacing: 1px;
  font-weight: 600;
  font-family: 'Open Sans', sans-serif;

  &:hover {
    background: #ce2424;
    color: #fff;
    -webkit-transition: all 0.25s;
    transition: all 0.25s;
  }

  &:disabled {
    background: #ccc;
    border: 2px solid #ccc;
    color: #fff;
    -webkit-transition: all 0.25s;
    transition: all 0.25s;
    cursor: default;
  }
`;

export default function Component({ children, disabled, onClick }) {
  return (
    <>
      <Button disabled={disabled} onClick={onClick}>
        {children}
      </Button>
    </>
  );
}
