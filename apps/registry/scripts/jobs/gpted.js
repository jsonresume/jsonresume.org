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

// const exampleJob = `
// {
//   "title": "Software Developer",
//   "company": "TechCorp",
//   "location": {
//     "address": "123 Main Street",
//     "postalCode": "12345",
//     "city": "Anytown",
//     "countryCode": "US",
//     "region": "State"
//   },
//   "type": "Full-time",
//   "remote": "FULL",
//   "salary": "100000",
//   "date": "2022-03-01",
//   "description": "We are seeking a skilled Software Developer to join our dynamic team...",
//   "responsibilities": [
//     "Design and implement software solutions",
//     "Collaborate with cross-functional teams to deliver high-quality code",
//     "Conduct code reviews and provide constructive feedback"
//   ],
//   "qualifications": [
//     "Bachelor's degree in Computer Science or related field",
//     "Proven experience in software development",
//     "Proficiency in JavaScript, Python, and React"
//   ],
//   "skills": [
//     "JavaScript",
//     "Python",
//     "React"
//   ],
//   "experience": "Mid-level",
//   "education": "Bachelor's Degree",
//   "application": "To apply, please send your resume and cover letter to careers@techcorp.com",
//   "perks": [
//     "Competitive salary",
//     "Flexible work hours",
//     "Healthcare benefits",
//     "Professional development opportunities",
//     "Casual dress code",
//     "Company-sponsored events and outings"
//   ]
// }
// `;

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

const jobDescriptionToSchemaFunction = {
  name: 'jobDescriptionToSchema',
  description: 'Takes a fluid job description and turns it into a JSON schema',
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
};

async function main() {
  console.log('fetching');

  const { data } = await supabase
    .from('jobs')
    .select()
    .gte(
      'created_at',
      new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
    );

  for (let index = 0; index < data.length; index++) {
    const job = data[index];

    const jobDescription = job.content;

    const messages = [
      {
        role: 'system',
        content: `
Turn a Job Description into Structured JSON Data

You are a human assistant working for a recruiter. Your role is to transform job descriptions into structured JSON data. Follow the guidelines below to ensure high-quality and consistent results.

### Task:
Carefully analyze the given job description and convert it into a structured JSON format based on the schema provided.

### Key Details:
1. **JSON Schema**:
   Use the following JSON schema to guide your output:

   ${JSON.stringify(jobSchema, null, 2)}

2. **Remote Property**:
   - Identify whether the position is remote.
   - Possible values:
     - "Full": Fully remote.
     - "Hybrid": Combination of on-site and remote work.
     - "None": Fully on-site.
   - If unclear, set the value to null.

3. **Filling Properties**:
   - Make every effort to populate **all** fields. If information is missing, make educated guesses based on the context.
   - **Responsibilities**, **Qualifications**, and **Skills** must not be null. Infer likely values based on the job's context.
   - For the **Position** (title), if unspecified, provide your best guess based on the description.

4. **Concise Descriptions**:
   - Keep all values short and to the point, especially for arrays such as **responsibilities** and **skills**.

5. **Formatting and Validation**:
   - The output must strictly adhere to the schema format. Ensure data types, enumerations, and patterns are correctly followed.
   - For example:
     - Dates should follow ISO 8601 format.
     - Location fields such as 'countryCode' must comply with ISO-3166-1 ALPHA-2 codes (e.g., US, IN).

6. Make sure the company description is a minimum of three sentences.

### Example Output:
To help guide you, here is an example of a properly formatted job description in JSON:

{
  "title": "Web Developer",
  "company": "Microsoft",
  "type": "Full-time",
  "date": "2023-04",
  "description": "Develop and maintain web applications.",
  "location": {
    "address": "123 Main Street\nSuite 500",
    "postalCode": "12345",
    "city": "Seattle",
    "countryCode": "US",
    "region": "WA"
  },
  "remote": "Hybrid",
  "salary": "100000",
  "experience": "Mid-level",
  "responsibilities": [
    "Build and maintain web APIs.",
    "Collaborate with cross-functional teams."
  ],
  "qualifications": [
    "Bachelor's degree in Computer Science.",
    "3+ years of experience in web development."
  ],
  "skills": [
    {
      "name": "Web Development",
      "level": "Expert",
      "keywords": ["HTML", "CSS", "JavaScript"]
    }
  ],
  "meta": {
    "canonical": "http://example.com/job-schema/v1",
    "version": "v1.0.0",
    "lastModified": "2024-11-19T12:00:00"
  }
}

**Example Job Description**:
   Here is the job description for you to process:  
   ${jobDescription}

### Final Output:
Using the instructions and example above, transform the provided job description into a structured JSON document.`,
      },
    ];

    if (!job.gpt_content) {
      console.log('Found job without gpt_content', job);
      const chat = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.75,
        messages,
        functions: [jobDescriptionToSchemaFunction],
        function_call: 'auto',
      });

      try {
        const details = chat.choices[0].message.function_call?.arguments;

        const jobJson = JSON.parse(details);

        console.log({ jobJson });

        const { company } = jobJson;

        console.log({ company });

        const { data: companyData, error: companyError } = await supabase
          .from('companies')
          .select()
          .eq('name', company);

        if (companyData && companyData[0]) {
          const parsedCompanyData = JSON.parse(companyData[0].data);

          const companyDetails = parsedCompanyData.choices[0].message.content;

          console.log({ companyDetails, companyError });

          messages.push({
            role: 'system',
            content: `Here is more information about the company;
            
            ${companyDetails}
            `,
          });
        }

        // regenerate gpt content now that we have more context

        console.log({ messages });

        const chat2 = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          temperature: 0.75,
          messages,
          functions: [jobDescriptionToSchemaFunction],
          function_call: 'auto',
        });

        try {
          const details2 = chat2.choices[0].message.function_call?.arguments;
          const jobJson2 = JSON.parse(details2);

          console.log({ jobJson2 });

          // now i want to run one more pass through the ai but this time, don't call a function, just return a text response of all the job description in natural language

          messages.push({
            role: 'system',
            content: `Transform the structured job information into a comprehensive, natural-language job description. Write it as if it were a professional job posting that would appear on a career site. Include all details about the role, company, requirements, and benefits in a flowing narrative format. Focus on using industry-standard terminology and keywords that would naturally appear in relevant resumes. Make sure to incorporate all the technical skills, qualifications, and responsibilities in a way that would maximize semantic matching with candidate resumes.`,
          });

          const chat3 = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            temperature: 0.75,
            messages,
          });

          const content = chat3.choices[0].message.content;

          try {
            console.log({ chat3, content });
            const { error } = await supabase
              .from('jobs')
              .update({
                gpt_content: details,
                gpt_content_json_extended: jobJson2,
                gpt_content_full: content,
              })
              .eq('id', job.id);
            console.log({ error });
          } catch (e) {
            console.log({ e });
          }
        } catch (e) {
          console.log({ e });
        }
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
  }
}

main();
