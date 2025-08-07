import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

const resumeExtractionSchema = z.object({
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

async function convertFileToDataURL(file) {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = file.type || 'application/octet-stream';
  return `data:${mimeType};base64,${base64}`;
}

async function extractTextFromFile(file) {
  if (file.type === 'text/plain') {
    return await file.text();
  }

  // For other file types, we'll let the AI model handle them via multi-modal processing
  return null;
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files provided' }, { status: 400 });
    }

    console.log(`Processing ${files.length} file(s) for resume extraction`);

    const extractedData = [];

    for (const file of files) {
      console.log(
        `Processing file: ${file.name} (${file.type}, ${(
          file.size /
          1024 /
          1024
        ).toFixed(2)}MB)`
      );

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        return Response.json(
          {
            error: `File "${file.name}" is too large. Maximum size is 10MB.`,
          },
          { status: 400 }
        );
      }

      let prompt = '';
      let messageParts = [];

      // Handle text files directly
      const textContent = await extractTextFromFile(file);
      if (textContent) {
        prompt = `Extract structured resume data from this text content and format it according to the JSON Resume schema.

        Extract the following sections if available:
        - basics: name, label (job title), email, phone, url, summary, location (city, region), profiles
        - work: company name, position, dates, summary, highlights
        - education: institution, area, studyType (degree), dates, courses
        - skills: name, level, keywords
        - awards: title, date, awarder, summary
        - projects: name, description, highlights, dates, url
        - languages: language, fluency
        - interests: name, keywords
        - volunteer: organization, position, dates, summary
        - certificates: name, date, issuer, url
        - publications: name, publisher, releaseDate, url
        
        Use empty arrays for missing sections and omit optional fields that are not found.
        
        Text content:
        ${textContent}`;
      } else {
        // Handle binary files (PDF, images, etc.) via multi-modal
        const dataURL = await convertFileToDataURL(file);

        prompt = `Extract structured resume data from this document/image and format it according to the JSON Resume schema.

        Extract the following sections if available:
        - basics: name, label (job title), email, phone, url, summary, location (city, region), profiles
        - work: company name, position, dates, summary, highlights
        - education: institution, area, studyType (degree), dates, courses
        - skills: name, level, keywords
        - awards: title, date, awarder, summary
        - projects: name, description, highlights, dates, url
        - languages: language, fluency
        - interests: name, keywords
        - volunteer: organization, position, dates, summary
        - certificates: name, date, issuer, url
        - publications: name, publisher, releaseDate, url
        
        Use empty arrays for missing sections and omit optional fields that are not found.`;

        messageParts = [
          { type: 'text', text: prompt },
          { type: 'image', image: dataURL },
        ];
      }

      try {
        console.log('Sending to AI model for extraction...');
        console.log('Using text content:', !!textContent);
        console.log('Prompt length:', prompt.length);

        const result = await generateObject({
          model: textContent ? openai('gpt-4.1') : openai('gpt-4o'), // Use GPT-4.1 for text, GPT-4o for multi-modal
          schema: resumeExtractionSchema,
          schemaName: 'ResumeData',
          schemaDescription:
            'Structured resume data extracted from uploaded document',
          prompt: textContent ? prompt : messageParts,
          experimental_telemetry: { isEnabled: true },
        });

        console.log('AI model response received');
        console.log(
          'Extracted resume object:',
          JSON.stringify(result.object, null, 2)
        );

        extractedData.push({
          filename: file.name,
          data: result.object,
        });
      } catch (extractionError) {
        console.error(
          `Error extracting data from ${file.name}:`,
          extractionError
        );
        return Response.json(
          {
            error: `Failed to extract data from "${file.name}". Please ensure the file contains resume information and is not corrupted.`,
            details: extractionError.message,
          },
          { status: 500 }
        );
      }
    }

    console.log('All files processed successfully');

    return Response.json(
      {
        success: true,
        extractedData,
        message: `Successfully processed ${files.length} file(s)`,
      },
      {
        headers: {
          'Cache-Control': 'no-store', // Don't cache file processing results
        },
      }
    );
  } catch (error) {
    console.error('File upload processing error:', error);
    return Response.json(
      {
        error: 'Internal server error during file processing',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
