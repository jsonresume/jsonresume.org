import { toBuffer } from 'qrcode';

/**
 * A QR code for a resume's page, as a PNG: for printed resumes and slides.
 * Small and with low error correction, like the registry's, so it stays
 * scannable when printed at an inch.
 */
export const qrPng = (url: string): Promise<Uint8Array<ArrayBuffer>> =>
  toBuffer(url, {
    type: 'png',
    errorCorrectionLevel: 'L',
    margin: 1,
    scale: 8,
  }).then((buffer) => new Uint8Array(buffer));
