// Foundations
export { base } from './styles/base.css';
export { visuallyHidden } from './styles/shared.css';
export { vars } from './tokens/contract.css';
export { cx } from './utils/cx';

// Actions
export { Button, type ButtonProps } from './components/button/button';

// Typography
export {
  Code,
  Heading,
  Kbd,
  Link,
  Prose,
  Text,
  type HeadingProps,
  type LinkProps,
  type ProseProps,
  type TextProps,
} from './components/typography/typography';

// Layout
export {
  Container,
  Divider,
  Grid,
  Section,
  Stack,
  type ContainerProps,
  type DividerProps,
  type GridProps,
  type SectionProps,
  type StackProps,
} from './components/layout/layout';

// Site
export {
  Feature,
  Logo,
  LogoMark,
  PageHeader,
  SiteFooter,
  SkipLink,
  type FeatureProps,
  type LogoProps,
  type PageHeaderProps,
  type SiteFooterProps,
} from './components/site/site';
export { Hero, type HeroProps } from './components/site/hero';
export {
  Step,
  Steps,
  type StepProps,
  type StepsProps,
} from './components/site/steps';
export {
  Stat,
  Stats,
  type StatProps,
  type StatsProps,
} from './components/site/stats';
export {
  SiteHeader,
  SiteHeaderLink,
  type SiteHeaderLinkProps,
  type SiteHeaderProps,
} from './components/site/site-header';

// Content and docs
export {
  LinkCard,
  SectionIntro,
  type LinkCardProps,
  type SectionIntroProps,
} from './components/content/content';
export {
  CodeTabs,
  type CodeTab,
  type CodeTabsProps,
} from './components/content/code-tabs';
export {
  ChipGroup,
  OnThisPage,
  type ChipGroupProps,
  type ChipOption,
  type OnThisPageItem,
  type OnThisPageProps,
} from './components/content/navigation';

// Forms
export {
  Field,
  Label,
  useFieldControl,
  type FieldProps,
} from './components/form/field';
export {
  Checkbox,
  Input,
  Select,
  Switch,
  Textarea,
  type CheckboxProps,
  type InputProps,
  type SelectProps,
  type SwitchProps,
} from './components/form/controls';

// Feedback and data display
export {
  Avatar,
  Badge,
  Callout,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardTitle,
  EmptyState,
  Progress,
  Skeleton,
  Spinner,
  Table,
  Td,
  Th,
  type AvatarProps,
  type BadgeProps,
  type CalloutProps,
  type CardProps,
  type CardTitleProps,
  type EmptyStateProps,
  type ProgressProps,
  type SkeletonProps,
  type SpinnerProps,
  type TableProps,
} from './components/display/display';

// Overlays, disclosure and navigation
export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  CodeBlock,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
  TooltipProvider,
  type CodeBlockProps,
  type DialogContentProps,
  type TooltipProps,
} from './components/interactive/interactive';
export {
  BreadcrumbItem,
  Breadcrumbs,
  NavList,
  NavListGroup,
  NavListItem,
  type BreadcrumbItemProps,
  type BreadcrumbsProps,
  type NavListItemProps,
  type NavListProps,
} from './components/interactive/navigation';

// Overlays
export {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  type DropdownMenuItemProps,
} from './components/overlay/menu';
export {
  Popover,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
  type PopoverContentProps,
} from './components/overlay/popover';
export {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetContentProps,
} from './components/overlay/sheet';
export {
  Toaster,
  dismissToast,
  toast,
  type ToastOptions,
  type ToasterProps,
} from './components/overlay/toast';
export { Banner, type BannerProps } from './components/banner/banner';

// Navigation
export {
  BackLink,
  LoadMore,
  Pagination,
  TabNav,
  TabNavLink,
  pageWindow,
  type BackLinkProps,
  type LoadMoreProps,
  type PaginationProps,
  type TabNavLinkProps,
  type TabNavProps,
} from './components/navigation/navigation';
export {
  AccountMenu,
  type AccountMenuProps,
} from './components/navigation/account-menu';

// Inputs
export {
  SearchField,
  type SearchFieldProps,
} from './components/inputs/search-field';
export { Chip, type ChipProps } from './components/inputs/chip';
export {
  FilterBar,
  type ActiveFilter,
  type FilterBarProps,
} from './components/inputs/filter-bar';
export {
  SegmentedControl,
  type SegmentedControlProps,
  type SegmentedOption,
} from './components/inputs/segmented-control';
export { TagInput, type TagInputProps } from './components/inputs/tag-input';
export {
  RangeSlider,
  type RangeSliderProps,
} from './components/inputs/range-slider';
export {
  Combobox,
  type ComboboxOption,
  type ComboboxProps,
} from './components/inputs/combobox';
export {
  FileDropzone,
  FileList,
  type FileDropzoneProps,
  type FileListProps,
} from './components/inputs/file-dropzone';
export { Repeater, type RepeaterProps } from './components/inputs/repeater';
export {
  ChatComposer,
  type ChatComposerProps,
} from './components/inputs/chat-composer';
export {
  CodeEditor,
  type CodeEditorProps,
  type Diagnostic,
} from './components/inputs/code-editor';

// Feedback and status
export { PageState, type PageStateProps } from './components/status/page-state';
export {
  ErrorBoundary,
  type ErrorBoundaryProps,
} from './components/status/error-boundary';
export {
  SignInGate,
  type SignInGateProps,
} from './components/status/sign-in-gate';
export {
  ScoreMeter,
  defaultBands,
  type ScoreBand,
  type ScoreMeterProps,
} from './components/status/score-meter';
export {
  StatusToggle,
  type StatusOption,
  type StatusToggleProps,
} from './components/status/status-toggle';

// Data display
export { StatTile, type StatTileProps } from './components/data/stat-tile';
export {
  DescriptionList,
  type DescriptionItem,
  type DescriptionListProps,
} from './components/data/description-list';
export {
  JobCard,
  ResumeCard,
  type JobCardProps,
  type ResumeCardProps,
} from './components/data/entity-cards';
export { Markdown, type MarkdownProps } from './components/data/markdown';
export {
  CopyButton,
  type CopyButtonProps,
} from './components/data/copy-button';
export {
  Checklist,
  type CheckResult,
  type ChecklistProps,
} from './components/data/checklist';
export {
  TaskList,
  type Task,
  type TaskListProps,
} from './components/data/task-list';
export {
  SecretField,
  type SecretFieldProps,
} from './components/data/secret-field';
export {
  ChatMessage,
  ChatMessages,
  ChatToolCall,
  type ChatMessageProps,
  type ChatMessagesProps,
  type ChatToolCallProps,
} from './components/chat/chat';
export {
  ActivityFeed,
  Timeline,
  relativeTime,
  type ActivityFeedProps,
  type ActivityItem,
  type TimelineEntry,
  type TimelineProps,
} from './components/viz/feed';
export {
  TimeSeriesChart,
  formatDay,
  type TimeSeriesChartProps,
  type TimeSeriesPoint,
  type TimeSeriesSeries,
} from './components/viz/time-series-chart';
export {
  BarList,
  type BarListItem,
  type BarListProps,
} from './components/viz/bar-list';
export { compactNumber } from './components/viz/scale';
export { Sparkline, type SparklineProps } from './components/data/sparkline';
export {
  BarChart,
  LineChart,
  RadarChart,
  type BarChartProps,
  type BarDatum,
  type LineChartProps,
  type LineSeries,
  type RadarChartProps,
} from './components/viz/charts';
export {
  CalendarHeatmap,
  type CalendarHeatmapProps,
} from './components/viz/heatmap';
export {
  PreviewFrame,
  type PreviewFrameProps,
} from './components/viz/preview-frame';
export { TreeMap } from './components/viz/tree/tree-map';
export {
  spanView,
  type TreeMapEdge,
  type TreeMapHandle,
  type TreeMapNode,
  type TreeMapProps,
  type TreeSpanView,
} from './components/viz/tree/types';
export { TREE_TONES, type TreeTone } from './components/viz/tree/render-types';
export type { TreeCamera, TreeViewport } from './components/viz/tree/scene';
export {
  layoutTree,
  treeCone,
  type PlacedEdge,
  type PlacedNode,
  type TreeBand,
  type TreeEdgeStrength,
  type TreeLayout,
  type TreeLayoutEdge,
  type TreeLayoutOptions,
} from './tree-layout';

// App: the signed-in, full-screen layout
export { AppShell, type AppShellProps } from './components/app/app-shell';
export {
  AppNav,
  type AppNavItem,
  type AppNavLinkProps,
  type AppNavProps,
} from './components/app/app-nav';
export { AppPage, type AppPageProps } from './components/app/app-page';
export { AuthCard, type AuthCardProps } from './components/app/auth-card';
export { GithubIcon } from './components/app/github-icon';

// Layout and interaction
export { Panel, type PanelProps } from './components/workspace/panel';
export {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
  type ToolbarProps,
} from './components/workspace/toolbar';
export {
  SplitView,
  type SplitViewProps,
} from './components/workspace/split-view';
export {
  VirtualList,
  type VirtualListProps,
} from './components/workspace/virtual-list';
export {
  ShortcutHelp,
  formatShortcut,
  useShortcut,
  type ShortcutGroup,
  type ShortcutHelpProps,
} from './components/workspace/shortcuts';
export {
  SwipeDeck,
  type SwipeDecision,
  type SwipeDeckProps,
} from './components/workspace/swipe-deck';
export {
  GraphControls,
  GraphLegend,
  GraphNodeCard,
  GraphOverlay,
  GraphRegion,
  type GraphControlsProps,
  type GraphRegionProps,
  type LegendEntry,
} from './components/workspace/graph';

// Hooks
export { useSettledValue } from './hooks/use-settled-value';
