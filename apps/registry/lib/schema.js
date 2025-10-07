import { definitions } from './schema/definitions';
import { basics } from './schema/basics';
import { work } from './schema/work';
import { volunteer } from './schema/volunteer';
import { education } from './schema/education';
import { awards } from './schema/awards';
import { certificates } from './schema/certificates';
import { publications } from './schema/publications';
import { skills } from './schema/skills';
import { languages } from './schema/languages';
import { interests } from './schema/interests';
import { references } from './schema/references';
import { projects } from './schema/projects';
import { meta } from './schema/meta';

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  additionalProperties: false,
  definitions,
  properties: {
    $schema: {
      type: 'string',
      description:
        'link to the version of the schema that can validate the resume',
      format: 'uri',
    },
    basics,
    work,
    volunteer,
    education,
    awards,
    certificates,
    publications,
    skills,
    languages,
    interests,
    references,
    projects,
    meta,
  },
  title: 'Resume Schema',
  type: 'object',
};

export default schema;
