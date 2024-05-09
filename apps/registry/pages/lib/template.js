const { createClient } = require('@supabase/supabase-js');
const find = require('lodash/find');
const axios = require('axios');
const Validator = require('jsonschema').Validator;
const sampleResume = require('../api/samples/resume');
import schema from '../api/schema';
import template from '../api/formatters/template';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const schemaValidator = new Validator();

if (!GITHUB_TOKEN && process.env.NODE_ENV !== 'development') {
  throw new Error('GITHUB_TOKEN is not set in environment variables');
}

const failMessage = (message) => {
  return (
    message +
    ', message @ajaxdavis on twitter if you need help (or tag me in your gist comments @thomasdavis'
  );
};

const ERROR_CODES = {
  INVALID_USERNAME: 'This is not a valid Github username',
  NON_EXISTENT_GIST:
    'You have no gists named resume.json or your gist is private',
  GIST_UNKNOWN_ERROR: 'Cannot fetch gist, no idea why',
  RESUME_SCHEMA_ERROR:
    'Your resume does not conform to the schema, visit https://jsonresume.org/schema/ to double check why. But the error message below should contain all the information you need.',
  TEMPLATE_MISSING:
    'This theme is currently unsupported. Please visit this Github issue to request it https://github.com/jsonresume/jsonresume.org/issues/36 (unfortunately we have recently (11/2023) disabled a bunch of legacy themes due to critical flaws in them, please request if you would like them back.)',
  UNKNOWN_TEMPLATE_ERROR:
    'Cannot format resume, no idea why #likely-a-validation-error',
};

export default async function handler(username, options) {
  const { theme } = options;
  const formatter = template;

  // @todo - create a logging library and pipe to a service probably
  console.log('Fetching gistId');
  console.log(`https://api.github.com/users/${username}/gists`);

  let gistData = {};

  try {
    // returns a list of gists
    gistData = await axios.get(
      `https://api.github.com/users/${username}/gists?per_page=100`,
      {
        headers: {
          ...(GITHUB_TOKEN ? { Authorization: 'Bearer ' + GITHUB_TOKEN } : {}), // If we have no token and are in development, we can still make some requests.
        },
      }
    );
  } catch (e) {
    console.log(e);
    return { error: ERROR_CODES.INVALID_USERNAME };
  }

  if (!gistData.data) {
    // this is probably not worth it
    return { error: ERROR_CODES.INVALID_USERNAME };
  }

  const resumeGist = find(gistData.data, (f) => {
    // @todo - this won't work when when they have more than a 100 gist, and their resume.json
    return f.files['resume.json']; // @todo - enum the resume.json file convention
  });

  if (!resumeGist) {
    return { error: ERROR_CODES.NON_EXISTENT_GIST };
  }

  const gistId = resumeGist.id;

  // @todo - figure out a better cache buster/strategy
  const rawGistUrl =
    `https://gist.githubusercontent.com/${username}/${gistId}/raw?cachebust=` +
    new Date().getTime();

  let resumeResponse = {};

  try {
    resumeResponse = await axios({
      method: 'GET',
      headers: { 'content-type': 'application/json' },
      url: rawGistUrl,
    });
  } catch (e) {
    // @todo - If gist url is invalid, flush the gistid in cache
    console.log({ e });
    return { error: ERROR_CODES.GIST_UNKNOWN_ERROR };
  }

  // prioritize manual theme, value from resume, then default to elegant
  const selectedTheme = (
    theme ||
    (resumeResponse.data.meta && resumeResponse.data.meta.theme) ||
    'elegant'
  ) // @todo - enum themes or something
    .toLowerCase();

  const resume = resumeResponse?.data ?? sampleResume;

  const validation = schemaValidator.validate(resume, schema);

  if (!validation.valid) {
    // @todo - massively improve the UI of why the users resume is not valid - HIGH PRIORITY
    // ${JSON.stringify(validation.errors, null, 2)}
    return { error: ERROR_CODES.RESUME_SCHEMA_ERROR };
  }

  // @todo - Here we are inserting the resume into the registries database which is just used as a cache and to look at data. Need to create a terms of service and privacy policy for this. - HIGH PRIORITY

  (async () => {
    const { data, error } = await supabase
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
    // @todo - this shouldn't break the execution of this function, but the log is useful if it does
  })();

  const renderOptions = { theme: selectedTheme, username };

  let output = null;

  try {
    output = await template.format(resume, renderOptions);
  } catch (e) {
    // @todo - make error lib
    console.error(e); // Log the error on the server so we see it in the logs
    // @todo - do this A-LOT better
    if (e.message === 'theme-missing') {
      return { error: ERROR_CODES.TEMPLATE_MISSING };
    }

    return { error: ERROR_CODES.UNKNOWN_TEMPLATE_ERROR };
  }

  return { output, valid: validation.valid };
}
