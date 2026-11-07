export interface FontPair {
  display: string;
  body: string;
}

const pairs: Record<string, FontPair[]> = {
  classic: [
    { display: 'Source Serif 4', body: 'Source Sans 3' },
    { display: 'Libre Baskerville', body: 'Inter' },
    { display: 'Crimson Pro', body: 'Work Sans' },
    { display: 'Literata', body: 'Public Sans' },
    { display: 'EB Garamond', body: 'Lato' },
  ],
  minimal: [
    { display: 'Inter', body: 'Inter' },
    { display: 'Public Sans', body: 'Public Sans' },
    { display: 'IBM Plex Sans', body: 'IBM Plex Sans' },
    { display: 'Source Sans 3', body: 'Source Sans 3' },
    { display: 'DM Sans', body: 'DM Sans' },
  ],
  modern: [
    { display: 'Manrope', body: 'Inter' },
    { display: 'Figtree', body: 'Figtree' },
    { display: 'DM Sans', body: 'Public Sans' },
    { display: 'Plus Jakarta Sans', body: 'Source Sans 3' },
    { display: 'Lato', body: 'Lato' },
  ],
  editorial: [
    { display: 'DM Serif Display', body: 'Source Sans 3' },
    { display: 'Newsreader', body: 'Work Sans' },
    { display: 'Bodoni Moda', body: 'Inter' },
    { display: 'Libre Caslon Display', body: 'Literata' },
    { display: 'Cormorant Garamond', body: 'Public Sans' },
  ],
  technical: [
    { display: 'IBM Plex Mono', body: 'IBM Plex Sans' },
    { display: 'Space Grotesk', body: 'Inter' },
    { display: 'Roboto Slab', body: 'Source Sans 3' },
    { display: 'Space Mono', body: 'Public Sans' },
    { display: 'JetBrains Mono', body: 'Source Sans 3' },
  ],
  bold: [
    { display: 'Archivo Black', body: 'Inter' },
    { display: 'Barlow Condensed', body: 'Public Sans' },
    { display: 'Oswald', body: 'Source Sans 3' },
    { display: 'League Spartan', body: 'Lato' },
    { display: 'Anton', body: 'Inter' },
  ],
  creative: [
    { display: 'DM Serif Display', body: 'DM Sans' },
    { display: 'Fraunces', body: 'Work Sans' },
    { display: 'Bricolage Grotesque', body: 'Inter' },
    { display: 'Cormorant Garamond', body: 'Figtree' },
    { display: 'Lora', body: 'Public Sans' },
  ],
  retro: [
    { display: 'Libre Baskerville', body: 'Source Sans 3' },
    { display: 'DM Serif Display', body: 'Work Sans' },
    { display: 'Space Grotesk', body: 'Inter' },
    { display: 'Bitter', body: 'Lato' },
    { display: 'IBM Plex Mono', body: 'IBM Plex Sans' },
  ],
  playful: [
    { display: 'Nunito Sans', body: 'Nunito Sans' },
    { display: 'Quicksand', body: 'Public Sans' },
    { display: 'Bricolage Grotesque', body: 'Figtree' },
    { display: 'Space Mono', body: 'DM Sans' },
  ],
};

export function fontPair(
  style: string,
  index: number,
  key: string,
  language: string
): FontPair {
  const script: Record<string, string> = {
    ar: 'Noto Sans Arabic',
    ja: 'Noto Sans JP',
    hi: 'Noto Sans Devanagari',
    ko: 'Noto Sans KR',
  };
  if (script[language])
    return { display: script[language], body: script[language] };
  if (key === 'paper-plain') return { display: 'Georgia', body: 'DM Sans' };
  if (key === 'easy-print') return { display: 'Georgia', body: 'Arial' };
  if (key === 'bare-serif') return { display: 'Literata', body: 'Literata' };
  if (key === 'large-type')
    return { display: 'Atkinson Hyperlegible', body: 'Atkinson Hyperlegible' };
  if (key === 'clear-reading')
    return { display: 'Source Sans 3', body: 'Source Sans 3' };
  if (key === 'telegram')
    return { display: 'IBM Plex Mono', body: 'Public Sans' };
  if (key === 'seventies') return { display: 'Fraunces', body: 'DM Sans' };
  if (key === 'swiss-archive') return { display: 'Inter', body: 'Inter' };
  if (key === 'mono-minimal')
    return { display: 'IBM Plex Mono', body: 'Public Sans' };
  if (key === 'quant') return { display: 'Roboto Slab', body: 'Inter' };
  const family = pairs[style] ?? pairs.modern;
  const chosen = family[index % family.length];
  return ['bookplate', 'longform', 'essay'].includes(key)
    ? { ...chosen, body: 'Literata' }
    : chosen;
}

export function googleFonts(pair: FontPair): string[] {
  // These display families only supply regular; requesting nonexistent weights
  // makes Google's entire stylesheet request fail.
  const regular = new Set([
    'DM Serif Display',
    'Libre Caslon Display',
    'Archivo Black',
    'Anton',
  ]);
  return [...new Set([pair.display, pair.body])]
    .filter((name) => !['Georgia', 'Arial'].includes(name))
    .map(
      (name) =>
        `${name}:wght@${
          regular.has(name)
            ? '400'
            : [
                'Space Mono',
                'Libre Baskerville',
                'Atkinson Hyperlegible',
              ].includes(name)
            ? '400;700'
            : '400;600;700'
        }`
    );
}
