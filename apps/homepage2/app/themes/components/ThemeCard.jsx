import Image from 'next/image';

export function ThemeCard({ theme }) {
  return (
    <div className="col-sm-4 col-md-3">
      <div className="theme">
        <div className="row">
          <div className="col-sm-12 col-xs-6">
            <a
              href={`https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}`}
            >
              <Image
                style={{ height: '100px' }}
                height="129"
                width="163"
                alt={theme.name}
                src={`/img/themes/${theme.slug}.png`}
              />
            </a>
          </div>
          <div className="col-sm-12 col-xs-6 meta">
            <div className="name">{theme.name}</div>
            <div className="author">
              by{' '}
              <a href={`${theme.link}`} target="_blank" rel="noreferrer">
                {theme.author}
              </a>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12">
            <a
              href={`https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}`}
              className="btn"
            >
              Preview theme
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
