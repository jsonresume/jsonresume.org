import { z } from 'zod';

export const resumeExtractionSchema = z.object({
  basics: z
    .object({
      name: z.string().optional(),
      label: z.string().optional(),
      email: z.string().optional(),
      phone: z.string().optional(),
      url: z.string().optional(),
      summary: z.string().optional(),
      location: z
        .object({
          address: z.string().optional(),
          postalCode: z.string().optional(),
          city: z.string().optional(),
          countryCode: z.string().optional(),
          region: z.string().optional(),
        })
        .optional(),
      profiles: z
        .array(
          z.object({
            network: z.string(),
            username: z.string().optional(),
            url: z.string().optional(),
          })
        )
        .optional(),
    })
    .optional(),
  work: z
    .array(
      z.object({
        name: z.string(),
        position: z.string(),
        url: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        summary: z.string().optional(),
        highlights: z.array(z.string()).optional(),
      })
    )
    .optional(),
  volunteer: z
    .array(
      z.object({
        organization: z.string(),
        position: z.string(),
        url: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        summary: z.string().optional(),
        highlights: z.array(z.string()).optional(),
      })
    )
    .optional(),
  education: z
    .array(
      z.object({
        institution: z.string(),
        url: z.string().optional(),
        area: z.string().optional(),
        studyType: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        score: z.string().optional(),
        courses: z.array(z.string()).optional(),
      })
    )
    .optional(),
  awards: z
    .array(
      z.object({
        title: z.string(),
        date: z.string().optional(),
        awarder: z.string(),
        summary: z.string().optional(),
      })
    )
    .optional(),
  certificates: z
    .array(
      z.object({
        name: z.string(),
        date: z.string().optional(),
        issuer: z.string(),
        url: z.string().optional(),
      })
    )
    .optional(),
  publications: z
    .array(
      z.object({
        name: z.string(),
        publisher: z.string(),
        releaseDate: z.string().optional(),
        url: z.string().optional(),
        summary: z.string().optional(),
      })
    )
    .optional(),
  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z.string().optional(),
        keywords: z.array(z.string()).optional(),
      })
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        fluency: z.string().optional(),
      })
    )
    .optional(),
  interests: z
    .array(
      z.object({
        name: z.string(),
        keywords: z.array(z.string()).optional(),
      })
    )
    .optional(),
  references: z
    .array(
      z.object({
        name: z.string(),
        reference: z.string().optional(),
      })
    )
    .optional(),
  projects: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        highlights: z.array(z.string()).optional(),
        keywords: z.array(z.string()).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        url: z.string().optional(),
        roles: z.array(z.string()).optional(),
        entity: z.string().optional(),
        type: z.string().optional(),
      })
    )
    .optional(),
});
