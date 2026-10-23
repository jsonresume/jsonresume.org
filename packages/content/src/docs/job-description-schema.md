---
title: Job description schema
description: JSONJob is an open-source, standardized JSON format for job descriptions. Includes an example job.json.
---

## What is it?

The JSONJob schema is a standardized format designed to simplify and streamline job descriptions. It ensures that job postings are clear, consistent and easy to read, no matter where they're published. By using JSONJob, employers can create structured job listings that help candidates quickly understand the role and its requirements.

This improves the job search experience and makes the hiring process more efficient, benefiting both employers and job seekers. It's ideal for developers looking for a professional and effective way to manage job descriptions.

## Open source

The schema is [open source](https://github.com/jsonresume/jsonresume.org/blob/master/packages/schema/job-schema.json) and community-driven. We release everything we do under the MIT license.

## LLMs

Working with LLMs is also much easier, as you can ask them to turn your resumes or job descriptions into formatted data, since they have been trained on these schemas.

## Example job.json

An example `job.json` (version 1.0.0):

```json
{
  "title": "Web Developer",
  "company": "Microsoft",
  "type": "Full-time",
  "date": "2024-07",
  "description": "We are looking for a skilled Web Developer to join our team. The role involves building and maintaining web applications.",
  "location": {
    "address": "1234 Glücklichkeit Straße\nHinterhaus 5. Etage li.",
    "postalCode": "10115",
    "city": "Berlin",
    "countryCode": "DE",
    "region": "Berlin"
  },
  "remote": "Hybrid",
  "salary": "100000",
  "experience": "Mid-level",
  "responsibilities": [
    "Develop and maintain web applications",
    "Collaborate with cross-functional teams",
    "Ensure the technical feasibility of UI/UX designs",
    "Optimize applications for maximum speed and scalability"
  ],
  "qualifications": [
    "Bachelor's degree in Computer Science or related field",
    "3+ years of experience in web development",
    "Strong understanding of JavaScript, HTML, and CSS"
  ],
  "skills": [
    {
      "name": "Web Development",
      "level": "Master",
      "keywords": ["HTML", "CSS", "JavaScript", "React", "Node.js"]
    },
    {
      "name": "Database Management",
      "level": "Intermediate",
      "keywords": ["SQL", "NoSQL", "MongoDB"]
    }
  ]
}
```
