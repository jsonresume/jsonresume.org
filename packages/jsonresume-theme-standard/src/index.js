import { renderToString } from 'react-dom/server';
import { ServerStyleSheet } from 'styled-components';
import Document from './ui/Document';
import Resume from './ui/Resume';

export const render = (resume) => {
  const sheet = new ServerStyleSheet();
  const html = renderToString(sheet.collectStyles(<Resume resume={resume} />));
  const body = <Resume resume={resume} />;
  const styles = sheet.getStyleElement();
  sheet.seal();
  console.log({ styles });
  return renderToString(<Document body={body} styles={styles} />);
};

export { Resume };
