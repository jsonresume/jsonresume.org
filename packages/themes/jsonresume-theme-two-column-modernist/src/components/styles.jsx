import styled from 'styled-components';

export const Container = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  font-family: 'Space Grotesk', 'Archivo', -apple-system, BlinkMacSystemFont,
    'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #1f1f1f;
  background: #ffffff;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  @media print {
    padding: 1rem;
    gap: 2rem;
  }
`;

export const LeftColumn = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

export const RightColumn = styled.main`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 0;
`;
