const { z } = require('zod');

/**
 * Zod schema for job description to JSON conversion (AI SDK)
 * Uses .nullable() instead of .optional() for OpenAI structured output compatibility
 */
const jobDescriptionSchema = z.object({
  title: z.string().nullable(),
  company: z.string().nullable(),
  location: z
    .object({
      address: z.string().nullable(),
      postalCode: z.string().nullable(),
      city: z.string().nullable(),
      countryCode: z.string().nullable(),
      region: z.string().nullable(),
    })
    .nullable(),
  position: z.string().nullable(),
  type: z.string().nullable(),
  salary: z.string().nullable(),
  date: z.string().nullable(),
  remote: z.string().nullable(),
  description: z.string().nullable(),
  responsibilities: z.array(z.string()).nullable(),
  qualifications: z.array(z.string()).nullable(),
  skills: z
    .array(
      z.object({
        name: z.string().nullable(),
        level: z.string().nullable(),
        keywords: z.array(z.string()).nullable(),
      })
    )
    .nullable(),
  experience: z.string().nullable(),
  education: z.string().nullable(),
  application: z.string().nullable(),
});

/**
 * AI SDK tool definition for job description parsing
 * Using Zod schema for type safety and automatic JSON Schema conversion
 */
const jobDescriptionTool = {
  description: 'Takes a fluid job description and turns it into a JSON schema',
  parameters: jobDescriptionSchema,
};

module.exports = { jobDescriptionSchema, jobDescriptionTool };
