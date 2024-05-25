import schema from './schema';
import buildError, { ERROR_CODES } from './error/buildError';
import getResumeGist from './getResumeGist';
import formatters from './formatters/formatters';

const Validator = require('jsonschema').Validator;

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const EXTENSIONS = new Set(['qr', 'json', 'tex', 'txt', 'template', 'yaml']);

const generateResume = async (username, extension = 'template', query = {}) => {
  const { theme } = query;
  const formatter = formatters[extension];

  if (!EXTENSIONS.has(extension)) {
    return buildError(ERROR_CODES.INVALID_EXTENSION);
  }

  if (!formatter) {
    return buildError(ERROR_CODES.UNKNOWN_FORMATTER);
  }

  // retrieve the users github gist
  const { error: gistError, resume } = await getResumeGist(username);

  if (gistError) {
    return buildError(gistError);
  }

  const v = new Validator();
  const validation = v.validate(resume, schema);

  if (!validation.valid) {
    return buildError(ERROR_CODES.RESUME_SCHEMA_ERROR, {
      validation: validation.errors,
    });
  }

  let selectedTheme = theme || resume.meta?.theme || 'elegant';

  selectedTheme = selectedTheme.toLowerCase();

  // @todo - using as a resume cache for extra features
  (async () => {
    try {
      await supabase
        .from('resumes')
        .upsert(
          {
            username,
            resume: JSON.stringify(resume),
            updated_at: new Date(),
          },
          { onConflict: 'username' }
        )
        .select();
    } catch (error) {
      console.error('Failed to cache resume:', error);
    }
  })();

  const options = { ...query, theme: selectedTheme, username };

  let formatted = {};

  try {
    formatted = await formatter.format(resume, options);
  } catch (e) {
    console.error(e);
    // @todo - do this better
    if (e.message === 'theme-missing') {
      return buildError(ERROR_CODES.TEMPLATE_MISSING);
    }

    return buildError(ERROR_CODES.UNKNOWN_TEMPLATE_ERROR);
  }

  return { content: formatted.content, headers: formatted.headers || [] };
};

export default generateResume;
