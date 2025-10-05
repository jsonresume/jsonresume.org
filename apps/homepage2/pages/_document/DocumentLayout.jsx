import Image from 'next/image';
import Link from 'next/link';

export function DocumentLayout({ children }) {
  return (
    <div id="main">
      <div id="viewport">
        <aside id="sidebar">
          <Link href="/">Home</Link>
          <Link href="/getting-started/">Getting Started</Link>
          <Link href="/schema/">Schema</Link>
          <Link href="/themes/">Themes</Link>
          <Link href="/projects/">Projects</Link>
          <Link href="/ai/">AI</Link>
          <Link href="/team/">Team</Link>
          <Link href="/blog/">Blog</Link>
        </aside>
        <div className="inner">
          <nav id="nav">
            <a href="#" className="lt">
              <Image
                width="18"
                height="14"
                src="/img/hamburger.png"
                alt="homepage navigation"
              />
            </a>
            <div className="container">
              <div className="row">
                <div className="col-sm-12">
                  <Link href="/">JSON Resume</Link>
                  <div className="float-right hidden-xs">
                    <Link href="/getting-started/">Getting Started</Link>
                    <Link href="/schema/">Schema</Link>
                    <Link href="/themes/">Themes</Link>
                    <Link href="/projects/">Projects</Link>
                    <Link href="/team/">Team</Link>

                    <Link
                      href="https://registry.jsonresume.org/explore"
                      target="_blank"
                    >
                      Hosting
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </nav>
          {children}

          <footer id="footer" className="container">
            <div className="row">
              <div className="col-sm-12">
                <p>JSON Resume is open source</p>
                <p>
                  <Link href="https://github.com/jsonresume">
                    View on GitHub
                  </Link>
                </p>
                <p>
                  <Link href="/ai/">AI</Link>&nbsp;|&nbsp;
                  <Link href="/blog/">Blog</Link>&nbsp;|
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
