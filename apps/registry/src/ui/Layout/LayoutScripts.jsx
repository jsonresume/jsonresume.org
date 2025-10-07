import Image from 'next/image';

export function LayoutScripts() {
  return (
    <>
      <script
        async
        data-id="101412017"
        src="https://static.getclicky.com/js"
      ></script>
      <noscript>
        <p>
          <Image
            alt="Clicky"
            width="1"
            height="1"
            src="https://in.getclicky.com/101412887ns.gif"
          />
        </p>
      </noscript>
      <style jsx global>{`
        body {
          margin: 0px;
          padding: 0px;
          background-color: #f5f5f5;
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
    </>
  );
}
