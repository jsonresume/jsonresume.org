import styled from "styled-components";

const Text = styled.div`
  font-size: 16px;
  color: #666666;
`;

const Date = ({ date }) => {
  // @todo - format date here
  return <Text>{date ?? "Present"}</Text>;
};

export default Date;
