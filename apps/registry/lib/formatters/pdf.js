import { format as formatTemplate } from './template/format';
import logger from '../logger';

let chromiumModule;

async function getBrowser() {
  if (!chromiumModule) {
    chromiumModule = await import('playwright');
  }
  const browser = await chromiumModule.chromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  return browser;
}

const format = async function format(resume, options) {
  const { content: html } = await formatTemplate(resume, options);

  let browser;
  try {
    browser = await getBrowser();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.setContent(html, { waitUntil: 'networkidle' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    });

    await context.close();

    return {
      content: Buffer.from(pdfBuffer),
      headers: [
        { key: 'Content-Type', value: 'application/pdf' },
        {
          key: 'Content-Disposition',
          value: `inline; filename="${options?.username || 'resume'}.pdf"`,
        },
        { key: 'Cache-Control', value: 'public, max-age=90' },
      ],
    };
  } catch (err) {
    logger.error(
      { error: err.message, stack: err.stack },
      'PDF generation failed'
    );
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const exports = { format };

export default exports;
