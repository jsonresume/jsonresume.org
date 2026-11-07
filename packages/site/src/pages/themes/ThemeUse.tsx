import { Button, CodeBlock } from '@jsonresume/ui';
import type { ThemeSummary } from '@repo/domain';
import { paths } from '../../links';
import * as s from './themeUse.css';
import { UseTheme } from './UseTheme';

/** Every way to put a theme on your own resume, from the preview. */
export function ThemeUse({ theme }: { theme: ThemeSummary }) {
  const meta = `"meta": { "theme": "${theme.slug}" }`;
  return (
    <section className={s.use} aria-labelledby="theme-use">
      <h3 id="theme-use" className={s.heading}>
        Use {theme.name}
      </h3>
      <div className={s.way}>
        <h4 className={s.title}>On jsonresume.org</h4>
        <UseTheme theme={theme} />
        <p className={s.text}>
          In the editor, pick <strong>{theme.name}</strong> from the Theme menu
          and save. Your page at jsonresume.org/@you changes straight away.
        </p>
        <Button asChild variant="secondary" size="sm" className={s.action}>
          <a href={paths.dashboardEditor}>Open the editor</a>
        </Button>
        <p className={s.text}>
          No resume here yet?{' '}
          <a href={`${paths.start}?theme=${encodeURIComponent(theme.slug)}`}>
            Start one in {theme.name}
          </a>
          : upload the one you have or answer a few questions.
        </p>
      </div>
      <div className={s.way}>
        <h4 className={s.title}>In your resume.json</h4>
        <p className={s.text}>
          Set the theme in <code>meta</code>, whether your resume lives here or
          in a GitHub gist:
        </p>
        <CodeBlock code={meta} label="resume.json" />
      </div>
      <div className={s.way}>
        <h4 className={s.title}>Try it on your resume first</h4>
        <p className={s.text}>
          Add <code>?theme={theme.slug}</code> to your link, like
          jsonresume.org/@you?theme={theme.slug}. Nothing is saved.
        </p>
      </div>
      <div className={s.way}>
        <h4 className={s.title}>Ask your AI assistant</h4>
        <p className={s.text}>
          With jsonresume.org connected, say “Switch my resume theme to{' '}
          {theme.name}.”
        </p>
        <Button asChild variant="ghost" size="sm" className={s.action}>
          <a href={paths.mcp}>Connect an assistant</a>
        </Button>
      </div>
    </section>
  );
}
