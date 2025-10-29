export function ThemeCard({ theme }) {
  return (
    <div className="col-sm-4 col-md-3">
      <div className="theme">
        <div className="row">
          <div className="col-sm-12 col-xs-6">
            <a
              href={`https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}`}
            >
              <div
                style={{
                  height: '100px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#f5f5f5',
                }}
              >
                <img
                  style={{
                    width: '100%',
                    height: 'auto',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                  alt={theme.name}
                  src={theme.screenshot || `/img/themes/${theme.slug}.png`}
                />
              </div>
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
