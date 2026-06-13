import styled from 'styled-components';
import {
  Section,
  SectionTitle,
  DateRange,
  Badge,
  BadgeList,
  ContactInfo,
  Avatar,
} from '@jsonresume/core';

// Field Researcher palette — academic, exploratory, scientific humility
export const INK = '#1f2a28';
export const INK_SOFT = '#4a5654';
export const INK_FAINT = '#73807d';
export const TEAL = '#0d9488';
export const TEAL_DEEP = '#0b6b62';
export const PAPER = '#fcfbf7';
export const RAIL = '#e7e3d6';
export const MUTED_FILL = '#f4f2ea';

const SERIF = "'Spectral', Georgia, 'Times New Roman', serif";
const MONO = "'IBM Plex Mono', 'SFMono-Regular', Menlo, monospace";

export const Layout = styled.div`
  max-width: 880px;
  margin: 0 auto;
  padding: 64px 56px 72px;
  background: ${PAPER};
  font-family: ${SERIF};
  color: ${INK};
  font-size: 15px;
  line-height: 1.62;

  @media print {
    padding: 36px 32px;
    background: #ffffff;
  }
  @media (max-width: 680px) {
    padding: 40px 24px;
  }
`;

/* ---------- Header ---------- */
export const Header = styled.header`
  display: grid;
  grid-template-columns: 96px 1fr;
  gap: 28px;
  align-items: start;
  padding-bottom: 28px;
  border-bottom: 2px solid ${INK};
  margin-bottom: 8px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 18px;
  }
`;

export const StyledAvatar = styled(Avatar)`
  border: 2px solid ${TEAL};
  border-radius: 4px;
`;

export const Eyebrow = styled.div`
  font-family: ${MONO};
  font-size: 11px;
  letter-spacing: 2.6px;
  text-transform: uppercase;
  color: ${TEAL_DEEP};
  margin-bottom: 8px;
`;

export const Name = styled.h1`
  font-family: ${SERIF};
  font-size: 42px;
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.4px;
  margin: 0;
  color: ${INK};
`;

export const Label = styled.div`
  font-size: 17px;
  font-style: italic;
  color: ${INK_SOFT};
  margin-top: 6px;
`;

export const StyledContactInfo = styled(ContactInfo)`
  justify-content: flex-start;
  gap: 18px;
  margin-top: 16px;
  font-family: ${MONO};
  font-size: 12px;
  letter-spacing: 0.3px;
  color: ${INK_SOFT};

  a {
    color: ${TEAL_DEEP};
    text-decoration: none;
    border-bottom: 1px solid ${RAIL};
    padding-bottom: 1px;
  }
  a:hover {
    border-bottom-color: ${TEAL};
  }
`;

export const Abstract = styled.p`
  grid-column: 1 / -1;
  margin: 22px 0 0 0;
  padding: 4px 0 4px 20px;
  border-left: 3px solid ${TEAL};
  font-size: 16px;
  line-height: 1.66;
  color: ${INK_SOFT};
  font-style: italic;
`;

/* ---------- Section scaffolding ---------- */
export const StyledSection = styled(Section)`
  margin-top: 40px;
`;

export const StyledSectionTitle = styled(SectionTitle)`
  display: flex;
  align-items: baseline;
  gap: 14px;
  font-family: ${MONO};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 2.4px;
  text-transform: uppercase;
  color: ${INK};
  margin: 0 0 22px 0;
  padding-bottom: 10px;
  border-bottom: 1px solid ${RAIL};

  &::before {
    content: '${(p) => p.$index || '00'}';
    color: ${TEAL};
    font-weight: 600;
  }
  &::after {
    content: '';
    flex: 1;
    height: 0;
    border-top: 1px solid ${RAIL};
    align-self: center;
  }
`;

/* ---------- Specimen entry (rail + body) ---------- */
export const Entry = styled.div`
  display: grid;
  grid-template-columns: 154px 1fr;
  gap: 28px;
  margin-bottom: 26px;
  padding-bottom: 26px;
  border-bottom: 1px solid ${RAIL};

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
    margin-bottom: 0;
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

export const Rail = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-left: 14px;
  border-left: 2px solid ${TEAL};

  @media (max-width: 680px) {
    border-left: none;
    padding-left: 0;
  }
`;

export const RailDate = styled.div`
  font-family: ${MONO};
  font-size: 12px;
  font-weight: 500;
  color: ${INK};
  font-variant-numeric: tabular-nums;
`;

export const RailMeta = styled.div`
  font-family: ${MONO};
  font-size: 11px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: ${INK_FAINT};
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

export const EntryTitle = styled.h3`
  font-family: ${SERIF};
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: ${INK};
  letter-spacing: -0.2px;

  a {
    color: ${INK};
    text-decoration: none;
    border-bottom: 1px solid ${TEAL};
  }
`;

export const EntrySubtitle = styled.div`
  font-size: 15px;
  font-style: italic;
  color: ${TEAL_DEEP};
  margin-top: 3px;
`;

export const EntryText = styled.p`
  margin: 12px 0 0 0;
  font-size: 15px;
  line-height: 1.62;
  color: ${INK_SOFT};
`;

export const Findings = styled.ul`
  margin: 12px 0 0 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 22px;
    margin-bottom: 7px;
    font-size: 14.5px;
    line-height: 1.55;
    color: ${INK_SOFT};
  }
  li::before {
    content: '\\2192';
    position: absolute;
    left: 0;
    top: 0;
    color: ${TEAL};
    font-family: ${MONO};
    font-weight: 600;
  }
`;

/* ---------- Skills / specimen index ---------- */
export const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 18px;
`;

export const SkillBlock = styled.div`
  border-top: 2px solid ${TEAL};
  padding-top: 10px;

  h4 {
    font-family: ${MONO};
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.4px;
    text-transform: uppercase;
    margin: 0 0 10px 0;
    color: ${INK};
  }
`;

export const StyledBadgeList = styled(BadgeList)`
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
`;

export const StyledBadge = styled(Badge)`
  font-family: ${MONO};
  font-size: 11.5px;
  letter-spacing: 0.3px;
  padding: 3px 9px;
  background: ${MUTED_FILL};
  border: 1px solid ${RAIL};
  border-radius: 3px;
  color: ${INK_SOFT};
`;

/* ---------- Compact card list (awards, certs, pubs, refs, interests) ---------- */
export const CardList = styled.div`
  display: grid;
  grid-template-columns: ${(p) => (p.$two ? 'repeat(2, 1fr)' : '1fr')};
  gap: 16px;

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
`;

export const Card = styled.div`
  padding: 14px 16px;
  background: ${MUTED_FILL};
  border-left: 3px solid ${TEAL};
  border-radius: 0 3px 3px 0;

  h4 {
    font-family: ${SERIF};
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: ${INK};
  }
  h4 a {
    color: ${INK};
    text-decoration: none;
    border-bottom: 1px solid ${TEAL};
  }
  .meta {
    font-family: ${MONO};
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${INK_FAINT};
    margin-top: 4px;
  }
  p {
    margin: 8px 0 0 0;
    font-size: 14.5px;
    line-height: 1.55;
    color: ${INK_SOFT};
  }
`;

export const LangGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 26px;
`;

export const LangItem = styled.div`
  .lang {
    font-family: ${SERIF};
    font-size: 16px;
    font-weight: 600;
    color: ${INK};
  }
  .fluency {
    font-family: ${MONO};
    font-size: 11px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: ${TEAL_DEEP};
    margin-top: 2px;
  }
`;

export { DateRange };
