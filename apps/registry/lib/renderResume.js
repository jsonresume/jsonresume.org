import { readFileSync } from 'fs';
import { join } from 'path';
import Handlebars from 'handlebars';

export async function renderResume(resumeData, theme) {
  const themePath = join(process.cwd(), '..', '..', 'themes', theme);
  const templateContent = readFileSync(join(themePath, 'resume.hbs'), 'utf8');
  const template = Handlebars.compile(templateContent);

  return template(resumeData);
}
