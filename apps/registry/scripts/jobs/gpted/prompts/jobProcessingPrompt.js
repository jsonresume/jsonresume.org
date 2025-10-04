const jobSchema = require('../jobSchema');

/**
 * Generates the system prompt for initial job processing
 */
function getJobProcessingPrompt(jobDescription) {
  return `
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
    "address": "123 Main Street\\nSuite 500",
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
Using the instructions and example above, transform the provided job description into a structured JSON document.`;
}

module.exports = { getJobProcessingPrompt };
