import { format as formatTemplate } from './template/format';
import logger from '../logger';

// Vercel functions have no browser installed, so production uses the
// serverless Chromium build from @sparticuz/chromium. Elsewhere (local dev,
// CI) use the browser installed by `playwright install`.
async function getBrowser() {
  const { chromium } = await import('playwright-core');
  if (process.env.VERCEL) {
    const { default: serverlessChromium } = await import('@sparticuz/chromium');
    return chromium.launch({
      executablePath: await serverlessChromium.executablePath(),
      args: serverlessChromium.args,
      headless: true,
    });
  }
  const { chromium: localChromium } = await import('playwright');
  return localChromium.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
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
    // Not a theme bug, and the browser error is not for the client: report
    // a plain PDF_RENDER_FAILED instead of a stack trace
    throw Object.assign(new Error('pdf-render-failed'), {
      code: 'PDF_RENDER_FAILED',
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const exports = { format };

export default exports;
