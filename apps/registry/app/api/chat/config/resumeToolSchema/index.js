import { basicsSchema } from './basicsSchema';
import { workSchema } from './workSchema';
import { educationSchema } from './educationSchema';
import { skillsSchema } from './skillsSchema';

export const RESUME_TOOL_SCHEMA = {
  update_resume: {
    description: 'Update specific sections of the resume with new information',
    parameters: {
      type: 'object',
      properties: {
        changes: {
          type: 'object',
          description: 'Changes to apply to the resume',
          properties: {
            basics: basicsSchema,
            work: workSchema,
            education: educationSchema,
            skills: skillsSchema,
          },
        },
        explanation: {
          type: 'string',
          description:
            'A brief, friendly explanation of the changes being made',
        },
      },
      required: ['changes', 'explanation'],
    },
  },
};
