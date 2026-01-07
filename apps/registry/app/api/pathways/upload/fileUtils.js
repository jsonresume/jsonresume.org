const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function convertFileToDataURL(file) {
  const arrayBuffer = await file.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString('base64');
  const mimeType = file.type || 'application/octet-stream';
  return `data:${mimeType};base64,${base64}`;
}

export async function extractTextFromFile(file) {
  if (file.type === 'text/plain') {
    return await file.text();
  }
  // For other file types, we'll let the AI model handle them via multi-modal processing
  return null;
}

export function validateFileSize(file) {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" is too large. Maximum size is 10MB.`,
    };
  }
  return { valid: true };
}

export const EXTRACTION_PROMPT = `Extract structured resume data from this content and format it according to the JSON Resume schema.

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
