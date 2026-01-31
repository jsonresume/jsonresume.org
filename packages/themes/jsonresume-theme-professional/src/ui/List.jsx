import styled from 'styled-components';
import { marked } from 'marked';

const ListContainer = styled.ul`
  padding-left: 20px;
  line-height: 16px;
  li::before {
    content: '•';
    display: inline-block;
    width: 1em;
    margin-left: -1em;
    line-height: 10px;
  }
`;

const List = ({ items }) => {
  if (!items) {
    return null;
  }

  return (
    <ListContainer>
      {items.map((item, index) => {
        const htmlContent = marked.parseInline(item, { breaks: true });
        return (
          <li key={index} dangerouslySetInnerHTML={{ __html: htmlContent }} />
        );
      })}
    </ListContainer>
  );
};

export default List;
