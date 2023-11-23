import styled from "styled-components";

const Text = styled.div`
  font-size: 20px;
  color: #330000;
`;

const List = ({ items }) => {
  console.log({ items });

  if (!items) {
    return null;
  }

  return (
    <ul>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
};

export default List;
