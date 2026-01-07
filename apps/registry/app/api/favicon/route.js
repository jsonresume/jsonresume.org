import { NextResponse } from 'next/server';

/**
 * Favicon proxy API
 * Fetches favicons from company websites with fallback to Google's favicon service
 *
 * Usage: /api/favicon?url=https://company.com
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json(
      { error: 'URL parameter required' },
      { status: 400 }
    );
  }

  try {
    // Extract domain from URL
    let domain;
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      domain = urlObj.hostname;
    } catch {
      domain = url.replace(/^(https?:\/\/)?/, '').split('/')[0];
    }

    // Try Google's favicon service first (most reliable)
    const googleFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

    const response = await fetch(googleFaviconUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JSONResume/1.0)',
      },
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': response.headers.get('Content-Type') || 'image/png',
          'Cache-Control': 'public, max-age=604800, immutable', // Cache for 1 week
        },
      });
    }

    // Return a placeholder response if favicon fetch fails
    return NextResponse.json({ error: 'Favicon not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch favicon' },
      { status: 500 }
    );
  }
}
