import type { Seniority } from '@repo/api';

/**
 * Role families: one vocabulary for the roles in job posts and the titles
 * on resumes, so a move people made ("Backend engineer" to "Engineering
 * manager") lines up with the jobs open today. Seniority is kept apart
 * (a "Senior backend engineer" is backend at senior).
 */
export const FAMILIES = [
  ['frontend', 'Frontend engineer'],
  ['backend', 'Backend engineer'],
  ['fullstack', 'Full-stack engineer'],
  ['mobile', 'Mobile engineer'],
  ['platform', 'Platform and infrastructure engineer'],
  ['sre', 'Site reliability engineer'],
  ['security', 'Security engineer'],
  ['data_engineering', 'Data engineer'],
  ['data_science', 'Data scientist or analyst'],
  ['ml', 'Machine learning engineer'],
  ['ai', 'AI and agents engineer'],
  ['research', 'Research scientist or engineer'],
  ['systems', 'Systems, compilers and performance engineer'],
  ['embedded', 'Embedded and hardware engineer'],
  ['game', 'Game developer'],
  ['blockchain', 'Blockchain engineer'],
  ['qa', 'QA and test engineer'],
  ['devrel', 'Developer relations'],
  ['solutions', 'Solutions and forward-deployed engineer'],
  ['architect', 'Software architect'],
  ['eng_manager', 'Engineering manager'],
  ['eng_executive', 'CTO or VP of engineering'],
  ['founder', 'Founder'],
  ['product', 'Product manager'],
  ['design', 'Product designer'],
  ['writer', 'Technical writer'],
  ['consultant', 'Consultant or freelancer'],
  ['educator', 'Teacher or educator'],
  ['student', 'Student or intern'],
  ['other_tech', 'Other technical role'],
  ['non_tech', 'Non-technical role'],
] as const;

export type Family = (typeof FAMILIES)[number][0];
export const FAMILY_KEYS = FAMILIES.map(
  ([key]) => key
) as ReadonlyArray<Family>;
const NAMES = new Map<string, string>(FAMILIES);

export const familyName = (family: string) => NAMES.get(family) ?? family;
export const isFamily = (value: string): value is Family => NAMES.has(value);

/** The family list as a model reads it: "key: name" per line. */
export const familyPrompt = FAMILIES.map(([k, n]) => `${k}: ${n}`).join('\n');

/** Seniority, lowest first, for comparing and for the seniority view. */
export const SENIORITY_ORDER: ReadonlyArray<Seniority> = [
  'intern',
  'junior',
  'mid',
  'senior',
  'staff_plus',
  'lead_management',
];
