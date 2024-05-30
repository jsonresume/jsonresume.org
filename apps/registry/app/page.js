import Dashboard from './components/Dashboard';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: blue;
`;

// @todo - come up with a strategy of what Pages should handle
// I think they should just handle url params and pass them to components

export default async function Page(props) {
  return (
    <PageContainer>
      <Dashboard />
    </PageContainer>
  );
}
