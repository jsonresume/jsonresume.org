// load all the resumes from the database
// and pass it to a template function for openai to turn a job description schema in a json representation

require('dotenv').config({ path: __dirname + '/./../../.env' });

const { createClient } = require('@supabase/supabase-js');
const OpenAI = require('openai');

const supabaseUrl = 'https://itxuhvvwryeuzuyihpkp.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*
- multpple positions
- needs ENUM values for skill levels etc
- location
- remote
- date
- propose a standard for hacker news post
- textbox for the job you want 
- a vote system for how shit the job translation was (3+)
*/

const exampleJob = `
{
  "title": "Software Developer",
  "company": "TechCorp",
  "location": {
    "address": "123 Main Street",
    "postalCode": "12345",
    "city": "Anytown",
    "countryCode": "US",
    "region": "State"
  },
  "type": "Full-time",
  "remote": "FULL",
  "salary": "100000",
  "date": "2022-03-01",
  "description": "We are seeking a skilled Software Developer to join our dynamic team...",
  "responsibilities": [
    "Design and implement software solutions",
    "Collaborate with cross-functional teams to deliver high-quality code",
    "Conduct code reviews and provide constructive feedback"
  ],
  "qualifications": [
    "Bachelor's degree in Computer Science or related field",
    "Proven experience in software development",
    "Proficiency in JavaScript, Python, and React"
  ],
  "skills": [
    "JavaScript",
    "Python",
    "React"
  ],
  "experience": "Mid-level",
  "education": "Bachelor's Degree",
  "application": "To apply, please send your resume and cover letter to careers@techcorp.com",
  "perks": [
    "Competitive salary",
    "Flexible work hours",
    "Healthcare benefits",
    "Professional development opportunities",
    "Casual dress code",
    "Company-sponsored events and outings"
  ]
}
`;

const jobSchema = {
  $schema: 'http://json-schema.org/draft-04/schema#',
  additionalProperties: false,
  definitions: {
    iso8601: {
      type: 'string',
      description:
        'Similar to the standard date type, but each section after the year is optional. e.g. 2014-06-29 or 2023-04',
      pattern:
        '^([1-2][0-9]{3}-[0-1][0-9]-[0-3][0-9]|[1-2][0-9]{3}-[0-1][0-9]|[1-2][0-9]{3})$',
    },
  },
  properties: {
    title: {
      type: 'string',
      description: 'e.g. Web Developer',
    },
    company: {
      type: 'string',
      description: 'Microsoft',
    },
    type: {
      type: 'string',
      description: 'Full-time, part-time, contract, etc.',
    },

    date: {
      $ref: '#/definitions/iso8601',
    },
    description: {
      type: 'string',
      description: 'Write a short description about the job',
    },
    location: {
      type: 'object',
      additionalProperties: true,
      properties: {
        address: {
          type: 'string',
          description:
            'To add multiple address lines, use \n. For example, 1234 Glücklichkeit Straße\nHinterhaus 5. Etage li.',
        },
        postalCode: {
          type: 'string',
        },
        city: {
          type: 'string',
        },
        countryCode: {
          type: 'string',
          description: 'code as per ISO-3166-1 ALPHA-2, e.g. US, AU, IN',
        },
        region: {
          type: 'string',
          description:
            'The general region where you live. Can be a US state, or a province, for instance.',
        },
      },
    },

    remote: {
      type: 'string',
      description: 'the level of remote work available',
      enum: ['Full', 'Hybrid', 'None'],
    },
    salary: {
      type: 'string',
      description: '100000',
    },
    experience: {
      type: 'string',
      description: 'Senior or Junior or Mid-level',
    },
    responsibilities: {
      type: 'array',
      description: 'what the job entails',
      additionalItems: false,
      items: {
        type: 'string',
        description: 'e.g. Build out a new API for our customer base.',
      },
    },
    qualifications: {
      type: 'array',
      description: 'List out your qualifications',
      additionalItems: false,
      items: {
        type: 'string',
        description: 'undergraduate degree, etc.  ',
      },
    },
    skills: {
      type: 'array',
      description: 'List out your professional skill-set',
      additionalItems: false,
      items: {
        type: 'object',
        additionalProperties: true,
        properties: {
          name: {
            type: 'string',
            description: 'e.g. Web Development',
          },
          level: {
            type: 'string',
            description: 'e.g. Master',
          },
          keywords: {
            type: 'array',
            description: 'List some keywords pertaining to this skill',
            additionalItems: false,
            items: {
              type: 'string',
              description: 'e.g. HTML',
            },
          },
        },
      },
    },
    meta: {
      type: 'object',
      description:
        'The schema version and any other tooling configuration lives here',
      additionalProperties: true,
      properties: {
        canonical: {
          type: 'string',
          description:
            'URL (as per RFC 3986) to latest version of this document',
          format: 'uri',
        },
        version: {
          type: 'string',
          description: 'A version field which follows semver - e.g. v1.0.0',
        },
        lastModified: {
          type: 'string',
          description: 'Using ISO 8601 with YYYY-MM-DDThh:mm:ss',
        },
      },
    },
  },
  title: 'Resume Schema',
  type: 'object',
};

async function main() {
  console.log('fetching');

  const { data, error } = await supabase
    .from('jobs')
    .select()
    .is('gpt_content', null);

  console.log('fetched', data, error);
  for (let index = 0; index < data.length; index++) {
    const job = data[index];

    const jobDescription = job.content;
    console.log('job', index);
    const messages = [
      {
        role: 'system',
        content: `You are a human assistant to a recruiter. You are helping them turn a job description into structured data. Try to understand if the position is remote or not. make sure to include the remote property. 
        
        Possible values for remote are: FULL, HYBRID, NONE.
        
        The job description should be in JSON format. 
        
        
        Where no value can be ascertained simply return null. Here is an example of a job description as a schema in JSON format: ${jobSchema}`,
      },
      {
        role: 'assistant',
        content: `This is the json example for a job: ${exampleJob}`,
      },
      {
        role: 'assistant',
        content: `Here is an example of a job description in JSON schema format: ${JSON.stringify(
          jobSchema
        )}`,
      },
      {
        role: 'assistant',
        content: `This is the job description ${jobDescription}`,
      },
      {
        role: 'user',
        content: `Make sure to include every property. Try really hard to fill out every property. 
        
        For responsibilities and skills. Take a really hard attempt to come up with likely values. They should not be null.

        Make sure things are too long. Be short and succint.

        Make sure position is filled out, come up with your best guess.
        
        Translate this job description into a JSON schema`,
      },
    ];
    if (!job.gpt_content) {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.8,
        messages,
        functions: [
          {
            name: 'jobDescriptionToSchema',
            description:
              'Takes a fluid job description and turns it into a JSON schema',
            parameters: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                company: { type: 'string' },
                location: {
                  type: 'object',
                  properties: {
                    address: { type: 'string' },
                    postalCode: { type: 'string' },
                    city: { type: 'string' },
                    countryCode: { type: 'string' },
                    region: { type: 'string' },
                  },
                },
                position: { type: 'string' },
                type: { type: 'string' },
                salary: { type: 'string' },
                date: { type: 'string' },
                remote: { type: 'string' },
                description: { type: 'string' },
                responsibilities: {
                  type: 'array',
                  items: { type: 'string' },
                },
                qualifications: {
                  type: 'array',
                  items: { type: 'string' },
                },
                skills: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                      level: { type: 'string' },
                      keywords: {
                        type: 'array',
                        items: { type: 'string' },
                      },
                    },
                  },
                },
                experience: { type: 'string' },
                education: { type: 'string' },
                application: { type: 'string' },
              },
              required: [],
            },
          },
        ],
        function_call: 'auto',
      });
      // console.log(chat.data);
      console.log({ jobDescription });

      console.log('AFASDASDAS');
      console.log('AFASDASDAS');
      console.log('AFASDASDAS');
      console.log('AFASDASDAS');
      console.log('AFASDASDAS');
      console.log('AFASDASDAS');
      console.log(chat);
      try {
        const details = chat.choices[0].message.function_call?.arguments;
        console.log(JSON.parse(details));
        const { error } = await supabase
          .from('jobs')
          .update({
            gpt_content: details,
          })
          .eq('id', job.id);
        console.log({ error });
      } catch (e) {
        console.error(e);
        await supabase
          .from('jobs')
          .update({
            gpt_content: 'FAILED',
          })
          .eq('id', job.id);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // sleep for 5 seconds
  }
}

main();
