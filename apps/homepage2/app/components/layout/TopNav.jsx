import Image from 'next/image';
import Link from 'next/link';

export function TopNav() {
  return (
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

              <Link href="https://docs.jsonresume.org" target="_blank">
                Docs
              </Link>

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
  );
}
