import { BorderStyle, type IStylesOptions } from 'docx';

const INK = '1F2933';
const MUTED = '5F6B7A';

/**
 * One plain layout: Calibri 11pt, Word's own Title and Heading styles
 * (so the navigation pane and outline work), and a muted Details style
 * for dates, places and links.
 */
export const styles: IStylesOptions = {
  default: {
    document: {
      run: { font: 'Calibri', size: 22, color: INK },
      paragraph: { spacing: { after: 80, line: 276 } },
    },
    title: {
      run: { font: 'Calibri', size: 48, bold: true, color: INK },
      paragraph: { spacing: { after: 40 } },
    },
    heading1: {
      run: { font: 'Calibri', size: 26, bold: true, color: INK },
      paragraph: {
        spacing: { before: 280, after: 120 },
        keepNext: true,
        border: {
          bottom: {
            style: BorderStyle.SINGLE,
            size: 6,
            color: 'BFC5CC',
            space: 2,
          },
        },
      },
    },
    heading2: {
      run: { font: 'Calibri', size: 23, bold: true, color: INK },
      paragraph: { spacing: { before: 160, after: 20 }, keepNext: true },
    },
  },
  paragraphStyles: [
    {
      id: 'Details',
      name: 'Details',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { size: 20, color: MUTED },
      paragraph: { spacing: { after: 60 }, keepNext: true },
    },
    {
      id: 'Headline',
      name: 'Headline',
      basedOn: 'Normal',
      next: 'Normal',
      quickFormat: true,
      run: { size: 26, color: MUTED },
      paragraph: { spacing: { after: 80 } },
    },
  ],
};
