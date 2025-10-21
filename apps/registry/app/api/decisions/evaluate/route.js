import { openai } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';
import { NextResponse } from 'next/server';

// Zod schemas for each decision criterion
// AI SDK v5 uses tool() helper with inputSchema
const tools = {
  checkRequiredSkills: tool({
    description:
      "Evaluate the candidate's skill match percentage with required job skills. Calculate what percentage of required skills they have. IMPORTANT: Search the ENTIRE resume including work.highlights, work.summary, projects.highlights, and education - not just the skills array. Skills and technologies can be mentioned anywhere. Be realistic - candidates can learn missing skills.",
    inputSchema: z.object({
      matchPercentage: z
        .number()
        .min(0)
        .max(1)
        .describe(
          'Percentage of required skills the candidate has (0.0 to 1.0). E.g., 0.75 means 75% match. >=0.8 is excellent, >=0.5 is acceptable, <0.5 is insufficient.'
        ),
      matchedSkills: z
        .array(z.string())
        .describe('List of required skills the candidate HAS'),
      missingSkills: z
        .array(z.string())
        .describe('List of required skills the candidate is missing'),
      reasoning: z
        .string()
        .describe(
          'Brief explanation of the skill match percentage and what it means'
        ),
    }),
  }),

  checkExperience: tool({
    description:
      'Evaluate if the candidate has enough years of experience for the role.',
    inputSchema: z.object({
      hasEnoughExperience: z
        .boolean()
        .describe('True if experience meets or exceeds requirement'),
      candidateYears: z.number().describe('Total years of relevant experience'),
      requiredYears: z.number().describe('Years of experience required by job'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkWorkRights: tool({
    description:
      'Check if the candidate has legal work authorization if required by the job.',
    inputSchema: z.object({
      hasWorkRights: z
        .boolean()
        .describe('True if work rights verified or not required'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkLocation: tool({
    description:
      'Evaluate location compatibility considering remote work options.',
    inputSchema: z.object({
      locationCompatible: z
        .boolean()
        .describe('True if location is compatible'),
      isRemote: z.boolean().describe('True if job allows remote work'),
      candidateLocation: z.string().describe('Candidate location'),
      jobLocation: z.string().describe('Job location'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkTimezone: tool({
    description:
      'Check timezone compatibility if location failed. Only relevant for remote positions with timezone requirements.',
    inputSchema: z.object({
      timezoneCompatible: z
        .boolean()
        .describe('True if timezones are compatible'),
      candidateTimezone: z.string().describe('Candidate timezone'),
      requiredTimezone: z.string().describe('Required timezone'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkAvailability: tool({
    description: 'Check if candidate can start within the required timeframe.',
    inputSchema: z.object({
      availableInTime: z
        .boolean()
        .describe('True if available within required timeframe'),
      candidateWeeks: z.number().describe('Weeks until candidate is available'),
      requiredWeeks: z
        .number()
        .describe('Maximum weeks job is willing to wait'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkSalary: tool({
    description: 'Evaluate if salary expectations align with the job offer.',
    inputSchema: z.object({
      salaryAligned: z
        .boolean()
        .describe('True if salary expectations are compatible'),
      candidateExpectation: z
        .number()
        .optional()
        .describe('Candidate salary expectation'),
      jobRange: z
        .object({
          min: z.number(),
          max: z.number(),
        })
        .optional()
        .describe('Job salary range'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),

  checkBonusSkills: tool({
    description:
      'Check for nice-to-have skills that make the candidate stand out.',
    inputSchema: z.object({
      hasBonusSkills: z
        .boolean()
        .describe('True if candidate has significant bonus skills'),
      matchedSkills: z
        .array(z.string())
        .describe('List of matched bonus skills'),
      reasoning: z.string().describe('Brief explanation of the decision'),
    }),
  }),
};

export async function POST(request) {
  try {
    const { resume, job, preferences = {} } = await request.json();

    console.log('=== AI EVALUATION DEBUG ===');
    console.log('Resume basics:', resume.basics?.name, resume.basics?.label);
    console.log('Job title:', job.title, 'Company:', job.company);

    if (!resume || !job) {
      return NextResponse.json(
        { error: 'Resume and job are required' },
        { status: 400 }
      );
    }

    // Parse job GPT content if available
    const gptJob = job.gpt_content ? JSON.parse(job.gpt_content) : {};
    console.log('GPT Job parsed:', {
      hasContent: !!job.gpt_content,
      skills: gptJob.skills?.length || 0,
      title: gptJob.title,
    });

    // Prepare FULL resume context for AI - send everything!
    const resumeContext = JSON.stringify(resume, null, 2);

    const jobContext = JSON.stringify(
      {
        title: gptJob.title || job.title,
        company: gptJob.company || job.company,
        location: gptJob.location || job.location,
        remote: gptJob.remote,
        description: job.description,
        skills: gptJob.skills || [],
        bonusSkills: gptJob.bonusSkills || [],
        minYearsExperience: gptJob.minYearsExperience || 0,
        salary: gptJob.salary || { min: 0, max: 999999 },
        startWithinWeeks: gptJob.startWithinWeeks || 12,
        workRightsRequired: gptJob.workRightsRequired !== false,
        timezone: gptJob.timezone,
      },
      null,
      2
    );

    console.log('Resume context length:', resumeContext.length);
    console.log('Job context length:', jobContext.length);
    console.log('User preferences:', preferences);

    // Build user preferences context
    const preferencesInfo = Object.entries(preferences)
      .map(([key, pref]) => {
        if (pref.enabled === false) {
          return `- ${key}: DISABLED (user doesn't care about this criterion)`;
        }
        if (pref.value && Object.keys(pref.value).length > 0) {
          return `- ${key}: ENABLED with custom values: ${JSON.stringify(
            pref.value
          )}`;
        }
        return `- ${key}: ENABLED (use standard evaluation)`;
      })
      .join('\n');

    const prompt = `You are an expert technical recruiter evaluating a candidate-job match.

CANDIDATE RESUME:
${resumeContext}

JOB POSTING:
${jobContext}

USER EVALUATION PREFERENCES:
The user has specified the following preferences for evaluation criteria:
${
  preferencesInfo ||
  'No custom preferences set - use standard evaluation for all criteria'
}

IMPORTANT INSTRUCTIONS:
- You MUST evaluate ALL criteria by calling every tool, regardless of whether earlier checks passed or failed
- For criteria marked as DISABLED, still call the tool but be lenient in your evaluation
- For criteria with custom values (e.g., salary ranges), use those values instead of the job's requirements
- Provide comprehensive feedback on all dimensions to give the candidate a complete picture
- CRITICAL: When checking for skills, search the ENTIRE resume including work.highlights, work.summary, projects, education, not just the skills array. Skills can be mentioned anywhere in the resume.

Call ALL of these tools in order:
1. checkRequiredSkills - Calculate skill match percentage (0.0-1.0). Search the ENTIRE resume (skills, work experience, projects, highlights) for evidence of each required skill. >=0.8 excellent, >=0.5 acceptable, <0.5 insufficient. ${
      preferences.skills?.enabled === false
        ? '(User disabled - be very lenient)'
        : ''
    }
2. checkExperience - Does candidate have enough years of experience? ${
      preferences.experience?.enabled === false
        ? '(User disabled - be lenient)'
        : ''
    }
3. checkWorkRights - Does candidate have work authorization if required?
4. checkLocation - Is location compatible (considering remote options)? ${
      preferences.location?.enabled === false
        ? '(User disabled - be lenient)'
        : ''
    }
5. checkTimezone - Is timezone compatible for remote work? ${
      preferences.timezone?.enabled === false
        ? '(User disabled - be lenient)'
        : ''
    }
6. checkAvailability - Can candidate start within required timeframe?
7. checkSalary - Are salary expectations aligned? ${
      preferences.salary?.enabled === false
        ? '(User disabled - be lenient)'
        : preferences.salary?.value?.min
        ? `(User expects ${preferences.salary.value.min}-${preferences.salary.value.max})`
        : ''
    }
8. checkBonusSkills - Does candidate have valuable bonus skills? ${
      preferences.skills?.enabled === false
        ? '(User disabled - be lenient)'
        : ''
    }

Be thorough, honest, and realistic in your evaluation. Even if the candidate fails one check, continue evaluating all remaining criteria.`;

    console.log('Prompt length:', prompt.length);
    console.log('Number of tools:', Object.keys(tools).length);

    // Call AI with tool definitions
    console.log('Calling generateText...');
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      prompt,
      tools,
      maxSteps: 10, // Allow multiple tool calls
    });

    console.log('generateText result keys:', Object.keys(result));
    console.log('toolCalls:', result.toolCalls);
    console.log('toolCalls length:', result.toolCalls?.length || 0);
    console.log('text response:', result.text?.substring(0, 200));

    // Process tool call results
    const decisions = {};
    if (result.toolCalls) {
      console.log('Processing', result.toolCalls.length, 'tool calls');
      for (const toolCall of result.toolCalls) {
        console.log('Tool call:', toolCall.toolName, 'Input:', toolCall.input);
        decisions[toolCall.toolName] = toolCall.input; // Use .input instead of .args
      }
    } else {
      console.log('NO TOOL CALLS RETURNED!');
    }

    console.log('Final decisions:', JSON.stringify(decisions, null, 2));
    console.log('=== END DEBUG ===');

    return NextResponse.json({ decisions });
  } catch (error) {
    console.error('Error evaluating match:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: 'Failed to evaluate match', details: error.message },
      { status: 500 }
    );
  }
}
