import { tool } from 'ai';
import { z } from 'zod';

/**
 * Tool to update the user's resume with partial changes
 * Returns data for client-side processing via useToolHandler
 */
export const updateResume = tool({
  description: `Update the user's resume by providing ONLY the changes/additions.
IMPORTANT: The 'changes' object should contain ONLY fields being modified or added.
- To ADD a new work entry: include just that one entry in the work array
- To UPDATE basics.name: include just { basics: { name: "New Name" } }
- To DELETE an entry: include the entry with _delete: true
DO NOT include unchanged fields or the entire resume.`,
  inputSchema: z.object({
    changes: z
      .object({
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
                  network: z.string().optional(),
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
              name: z.string().optional(),
              position: z.string().optional(),
              url: z.string().optional(),
              startDate: z.string().optional(),
              endDate: z.string().optional(),
              summary: z.string().optional(),
              highlights: z.array(z.string()).optional(),
              technologies: z.array(z.string()).optional(),
              _delete: z.boolean().optional(),
            })
          )
          .optional(),
        education: z
          .array(
            z.object({
              institution: z.string().optional(),
              area: z.string().optional(),
              studyType: z.string().optional(),
              startDate: z.string().optional(),
              endDate: z.string().optional(),
              score: z.string().optional(),
              _delete: z.boolean().optional(),
            })
          )
          .optional(),
        skills: z
          .array(
            z.object({
              name: z.string().optional(),
              level: z.string().optional(),
              keywords: z.array(z.string()).optional(),
              _delete: z.boolean().optional(),
            })
          )
          .optional(),
      })
      .describe('Partial update - include ONLY fields being modified'),
    explanation: z.string().describe('Friendly explanation of changes'),
  }),
  execute: async ({ changes, explanation }) => {
    return {
      success: true,
      changes,
      explanation,
      message: explanation || 'Resume updated',
    };
  },
});

export const resumeTools = { updateResume };
