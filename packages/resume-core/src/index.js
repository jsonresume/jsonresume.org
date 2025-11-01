/**
 * @resume/core
 * React component library for building ATS-friendly resume themes
 * Design tokens, primitives, and utilities with JSX
 */

// Export theme provider
export { ThemeProvider, useTheme } from './providers/ThemeProvider.jsx';

// Export all React primitives
export {
  Section,
  SectionTitle,
  ListItem,
  DateRange,
  formatDateRange,
  Badge,
  BadgeList,
  ContactInfo,
  Link,
  InlineSeparatorPipe,
  KeylineDivider,
  DottedDivider,
  AccentSidebarStripe,
  AccentTopRule,
  RulesetStack,
} from './primitives/index.jsx';

// Export design tokens
export {
  default as tokens,
  typography,
  colors,
  spacing,
  layout,
  radius,
  shadows,
  rawTokens,
} from './tokens/index.js';

// Export security utilities
export {
  safeUrl,
  getLinkRel,
  sanitizeHtml,
  isExternalUrl,
} from './utils/security.js';

// Export calculation helpers
export {
  calculateTotalExperience,
  calculateCurrentRoleExperience,
  countCompanies,
  countProjects,
  countPublications,
  countAwards,
  countTotalSkills,
  countSkillCategories,
  countLanguages,
  calculateVolunteerYears,
  calculateEducationYears,
  getHighestDegree,
  countCareerPositions,
  getCareerProgressionRate,
  countTotalHighlights,
  getUniqueIndustries,
  getCurrentEmployer,
  isCurrentlyEmployed,
  calculateKeyMetrics,
} from './helpers/calculations.js';

// Export layouts
export {
  GridLayout,
  SidebarLayout,
  StackLayout,
  CardLayout,
  FlexLayout,
  TwoColumnMicroGrid,
} from './layouts/index.jsx';

// Export skills components
export {
  SkillBar,
  SkillPill,
  SkillRating,
  SkillGroup,
  SkillCloud,
  SkillCategory,
} from './skills/index.jsx';

// Export timeline components
export {
  TimelineSection,
  TimelineItem,
  TimelineRuleMinimal,
  TimelineInline,
} from './timeline/index.jsx';

// Export profile components
export {
  Avatar,
  ProfileCard,
  ContactGrid,
  SocialLinks,
} from './profile/index.jsx';

// Export typography components
export {
  Heading,
  Text,
  Label,
  SectionIntroParagraph,
  QuoteStripe,
  HyphenationSafeParagraph,
} from './typography/index.jsx';

// Export data display components
export {
  ProgressCircle,
  StatCard,
  MetricBar,
  MetricInline,
  MetricBullet,
  MetricBulletList,
  KPIChipLine,
  KPIChip,
  KeyValueInline,
  KeyValue,
} from './data/index.jsx';

// Export utilities
export { Divider, Spacer, Flex, Grid } from './utils/index.jsx';

// Export experience components
export {
  ExperienceCard,
  ExperienceTimeline,
  ExperienceGrid,
  ExperienceCompact,
} from './experience/index.jsx';

// Export header/footer components
export {
  HeaderCentered,
  HeaderSplit,
  HeaderMinimal,
  CornerInitials,
  Footer,
  PageBreak,
  HeroNameBlock,
  ContactRowLine,
  SectionRuleTitle,
  SectionFlagTitle,
  NameStackElegant,
} from './header/index.jsx';

// Export quote/testimonial components
export { PullQuote, Testimonial, BlockQuote } from './quotes/index.jsx';

// Export certification/award components
export {
  CertificationBadge,
  CertificationRow,
  AwardCard,
  HonorsList,
} from './certifications/index.jsx';

// Export language/proficiency components
export {
  LanguageBar,
  LanguageLevelBarLite,
  LanguageGrid,
  ProficiencyScale,
} from './languages/index.jsx';

// Export publication/portfolio components
export {
  PublicationItem,
  PublicationEntryPlain,
  PortfolioGrid,
  ProjectCard,
} from './publications/index.jsx';

// Export table components
export { SkillMatrix, ComparisonTable, DataTable } from './tables/index.jsx';

// Export callout/highlight components
export { Callout, InfoBox, HighlightCard } from './callouts/index.jsx';

// Export list components
export {
  CheckList,
  IconList,
  NumberedList,
  BulletList,
  CompactList,
  AchievementListTight,
  AchievementListSpacious,
  HangingBulletList,
  ListDashCompact,
  MiniDotLeaderList,
  DefinitionKeyline,
} from './lists/index.jsx';

// Export date components
export { DateBadge, RelativeDate } from './dates/index.jsx';

// Export visual components
export {
  BackgroundPattern,
  ColorBlock,
  DividerVariants,
  BorderAccent,
} from './visuals/index.jsx';

// Export print utilities
export {
  KeepTogether,
  ColumnBreak,
  PrintOnly,
  ScreenOnly,
  PageHeaderLine,
  PageFooterLine,
  LetterheadBar,
  SoftShadowEmulation,
} from './print/index.jsx';

// Export metadata components
export {
  InlineKicker,
  MetaRow,
  SubsectionLabel,
  GreyLabelCaps,
  SmallCapsHeading,
} from './metadata/index.jsx';

// Export container components
export {
  MutedPanel,
  AccentCalloutPanel,
  SoftCardOutline,
  RoleBlockFramed,
} from './containers/index.jsx';

// Export tag components
export { ToolTagRibbon } from './tags/index.jsx';

// Export badge components
export { BadgeRowOutline } from './badges/index.jsx';

// Package metadata
export const version = '0.2.0';
