import { Predicate } from 'effect';

/** A BCP 47 tag in its usual shape: en, pt-BR, zh-Hant-TW. */
const TAG = /^[a-z]{2,3}(?:-[a-z0-9]{2,8})*$/i;
const HTML = /<html\b[^>]*>/i;
const LANG = /\slang\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/i;

/** The resume's `meta.language` (#288), when it is a usable tag. */
export const resumeLanguage = (resume: unknown): string | undefined => {
  const meta =
    Predicate.isObject(resume) && 'meta' in resume ? resume.meta : undefined;
  const language =
    Predicate.isObject(meta) && 'language' in meta ? meta.language : undefined;
  return Predicate.isString(language) && TAG.test(language.trim())
    ? language.trim()
    : undefined;
};

/**
 * The page says the language the resume is written in, so browsers,
 * screen readers and search engines read it as that language. Themes
 * mostly hard-code `lang="en"`; a resume without `meta.language` keeps it.
 */
export const withResumeLanguage = (html: string, resume: unknown): string => {
  const language = resumeLanguage(resume);
  const tag = HTML.exec(html)?.[0];
  if (!language || !tag) return html;
  const attribute = ` lang="${language}"`;
  const next = LANG.test(tag)
    ? tag.replace(LANG, attribute)
    : tag.replace(/^<html\b/i, `<html${attribute}`);
  return html.replace(tag, next);
};
