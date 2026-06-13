'use client';

import { useState } from 'react';

export function ThemeCard({ theme }) {
  const [imgFailed, setImgFailed] = useState(false);
  const previewUrl = `https://registry.jsonresume.org/thomasdavis?theme=${theme.slug}`;
  const screenshot = theme.screenshot || `/img/themes/${theme.slug}.png`;

  return (
    <div className="col-sm-4 col-md-3">
      <div className="theme">
        <div className="row">
          <div className="col-sm-12 col-xs-6">
            <a href={previewUrl}>
              <div
                style={{
                  height: '100px',
                  overflow: 'hidden',
                  position: 'relative',
                  background: '#f5f5f5',
                }}
              >
                {imgFailed ? (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '12px',
                      textAlign: 'center',
                      padding: '0 8px',
                    }}
                  >
                    Preview {theme.name}
                  </div>
                ) : (
                  <img
                    style={{
                      width: '100%',
                      height: 'auto',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                    alt={theme.name}
                    src={screenshot}
                    onError={() => setImgFailed(true)}
                  />
                )}
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
            <a href={previewUrl} className="btn">
              Preview theme
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
