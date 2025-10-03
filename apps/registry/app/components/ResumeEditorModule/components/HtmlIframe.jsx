import { useRef, useEffect } from 'react';

export const HtmlIframe = ({ htmlString }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const iframeDocument = iframeRef.current.contentDocument;
    iframeDocument.open();
    iframeDocument.write(htmlString);
    iframeDocument.close();
  }, [htmlString]);

  return <iframe ref={iframeRef} className="w-full h-full overflow-auto" />;
};
