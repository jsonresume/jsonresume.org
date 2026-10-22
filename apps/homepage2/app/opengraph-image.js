import { ImageResponse } from 'next/og';

export const alt =
  'JSON Resume — the open-source, JSON-based standard for resumes';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Link-preview card for every page (pages may override with their own).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: '#fff18f',
          color: '#222',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ fontSize: 40, opacity: 0.7, marginBottom: 24 }}>
          {'{ "resume": "json" }'}
        </div>
        <div style={{ fontSize: 96, fontWeight: 700 }}>JSON Resume</div>
        <div style={{ fontSize: 40, marginTop: 24, maxWidth: 900 }}>
          The open-source initiative to create a JSON-based standard for
          resumes.
        </div>
        <div style={{ fontSize: 32, marginTop: 48, opacity: 0.7 }}>
          jsonresume.org
        </div>
      </div>
    ),
    size
  );
}
