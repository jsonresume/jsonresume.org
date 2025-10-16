/**
 * PDF fetching and parsing utilities
 */

import { logger } from '@/lib/logger';

/**
 * Dynamic import to avoid webpack bundling issues
 */
async function getPDFParser() {
  const pdf = (await import('pdf-parse')).default;
  return pdf;
}

/**
 * Fetch and parse PDF for a user
 * @param {string} username - Username
 * @param {string} theme - Theme name
 * @returns {Promise<Object>} Parsed PDF data {text, numpages}
 */
export async function fetchAndParsePDF(username, theme) {
  // Use localhost in development, production domain otherwise
  const isDev = process.env.NODE_ENV === 'development';
  const baseUrl = isDev
    ? 'http://localhost:3000'
    : process.env.NEXT_PUBLIC_BASE_URL || 'https://registry.jsonresume.org';

  // Fetch PDF
  const pdfUrl = `${baseUrl}/${username}.pdf?theme=${theme}`;
  logger.debug({ pdfUrl, isDev }, 'Fetching PDF for analysis');

  const pdfResponse = await fetch(pdfUrl);

  if (!pdfResponse.ok) {
    logger.error(
      {
        status: pdfResponse.status,
        statusText: pdfResponse.statusText,
        pdfUrl,
      },
      'PDF fetch failed'
    );
    throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
  }

  const pdfBuffer = Buffer.from(await pdfResponse.arrayBuffer());

  // Parse PDF
  const pdfParser = await getPDFParser();
  const pdfData = await pdfParser(pdfBuffer);

  return {
    text: pdfData.text,
    numpages: pdfData.numpages,
  };
}
