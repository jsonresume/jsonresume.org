import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { resumeExtractionSchema } from './resumeSchema';
import {
  convertFileToDataURL,
  extractTextFromFile,
  validateFileSize,
  EXTRACTION_PROMPT,
} from './fileUtils';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return Response.json({ error: 'No files provided' }, { status: 400 });
    }

    const extractedData = [];

    for (const file of files) {
      const sizeValidation = validateFileSize(file);
      if (!sizeValidation.valid) {
        return Response.json({ error: sizeValidation.error }, { status: 400 });
      }

      let prompt = '';
      let messageParts = [];

      const textContent = await extractTextFromFile(file);
      if (textContent) {
        prompt = `${EXTRACTION_PROMPT}\n\nText content:\n${textContent}`;
      } else {
        const dataURL = await convertFileToDataURL(file);
        prompt = EXTRACTION_PROMPT;
        messageParts = [
          { type: 'text', text: prompt },
          { type: 'image', image: dataURL },
        ];
      }

      try {
        const result = await generateObject({
          model: textContent ? openai('gpt-4.1') : openai('gpt-4o'),
          schema: resumeExtractionSchema,
          schemaName: 'ResumeData',
          schemaDescription:
            'Structured resume data extracted from uploaded document',
          prompt: textContent ? prompt : messageParts,
          experimental_telemetry: { isEnabled: true },
        });

        extractedData.push({
          filename: file.name,
          data: result.object,
        });
      } catch (extractionError) {
        return Response.json(
          {
            error: `Failed to extract data from "${file.name}". Please ensure the file contains resume information and is not corrupted.`,
            details: extractionError.message,
          },
          { status: 500 }
        );
      }
    }

    return Response.json(
      {
        success: true,
        extractedData,
        message: `Successfully processed ${files.length} file(s)`,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    return Response.json(
      {
        error: 'Internal server error during file processing',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
