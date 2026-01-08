const { z } = require('zod');

/**
 * Zod schema for job description to JSON conversion (AI SDK)
 */
const jobDescriptionSchema = z.object({
  title: z.string().optional(),
  company: z.string().optional(),
  location: z
    .object({
      address: z.string().optional(),
      postalCode: z.string().optional(),
      city: z.string().optional(),
      countryCode: z.string().optional(),
      region: z.string().optional(),
    })
    .optional(),
  position: z.string().optional(),
  type: z.string().optional(),
  salary: z.string().optional(),
  date: z.string().optional(),
  remote: z.string().optional(),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).optional(),
  qualifications: z.array(z.string()).optional(),
  skills: z
    .array(
      z.object({
        name: z.string().optional(),
        level: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
    )
    .optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
  application: z.string().optional(),
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
