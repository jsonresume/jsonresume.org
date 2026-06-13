/**
 * Public type surface for @jsonresume/utils.
 *
 * The runtime is plain JS (src/*.js); these declarations type the public API
 * against @jsonresume/types so consumers get full inference.
 */
import type {
  Resume,
  ResumeLocation,
  WorkItem,
  VolunteerItem,
  EducationItem,
  SkillItem,
} from '@jsonresume/types';

// --- dates ---

export interface DateRangeOptions {
  startDate?: string | Date;
  endDate?: string | Date | null;
  format?: 'short' | 'long' | 'numeric';
  locale?: string;
  numberingSystem?: string;
  presentLabel?: string;
}

export function formatDateRange(options: DateRangeOptions): string;
export function getRelativeTime(date: string | Date, ago?: boolean): string;
export function getDuration(
  startDate: string | Date,
  endDate?: string | Date
): string;
export function normalizeDates(resume: Resume): Resume;

// --- metrics ---

export interface KeyMetric {
  label: string;
  value: string | number;
}

export function calculateTotalExperience(work?: WorkItem[]): number;
export function calculateCurrentRoleExperience(work?: WorkItem[]): number;
export function countCareerPositions(work?: WorkItem[]): number;
export function getCareerProgressionRate(work?: WorkItem[]): number;
export function countTotalHighlights(work?: WorkItem[]): number;
export function countCompanies(work?: WorkItem[]): number;
export function countProjects(projects?: unknown[]): number;
export function countPublications(publications?: unknown[]): number;
export function countAwards(awards?: unknown[]): number;
export function countTotalSkills(skills?: SkillItem[]): number;
export function countSkillCategories(skills?: SkillItem[]): number;
export function countLanguages(languages?: unknown[]): number;
export function calculateEducationYears(education?: EducationItem[]): number;
export function getHighestDegree(education?: EducationItem[]): string;
export function calculateVolunteerYears(volunteer?: VolunteerItem[]): number;
export function getUniqueIndustries(work?: WorkItem[]): string[];
export function getCurrentEmployer(work?: WorkItem[]): WorkItem | null;
export function isCurrentlyEmployed(work?: WorkItem[]): boolean;
export function calculateKeyMetrics(resume: Resume): KeyMetric[];

// --- url ---

export function safeUrl(url: string): string | null;
export function getLinkRel(url: string, openInNewTab?: boolean): string;
export function sanitizeHtml(html: string): string;
export function isExternalUrl(
  url: string,
  currentOrigin?: string | null
): boolean;
export function formatUrlForDisplay(url: string): string;

// --- resume shape ---

export function formatLocation(location?: ResumeLocation): string;
export function normalizeResume(resume?: Partial<Resume>): Resume;
