import Link from 'next/link';

export function Footer() {
  return (
    <footer id="footer" className="container">
      <div className="row">
        <div className="col-sm-12">
          <p>JSON Resume is open source</p>
          <p>
            <Link href="https://github.com/jsonresume">View on GitHub</Link>
          </p>
          <p>
            <Link href="/ai/">AI</Link>&nbsp;|&nbsp;
            <Link href="/blog/">Blog</Link>&nbsp;|
          </p>
        </div>
      </div>
    </footer>
  );
}
