export interface Recipe {
  header:
    | 'plain'
    | 'rule'
    | 'double'
    | 'frame'
    | 'band'
    | 'split'
    | 'byline'
    | 'offset'
    | 'stamp'
    | 'top';
  heading:
    | 'plain'
    | 'rule'
    | 'short'
    | 'bar'
    | 'number'
    | 'bracket'
    | 'dot'
    | 'tab'
    | 'double'
    | 'dotted'
    | 'edge';
  size: number;
  space: number;
  width: number;
  rail?: 'light' | 'line' | 'open';
  detail?: 'italic' | 'mono' | 'uppercase';
  decoration?: 'diagonal' | 'dots' | 'curve' | 'squares' | 'margin';
}
type Row = [
  string,
  Recipe['header'],
  Recipe['heading'],
  number,
  number,
  number,
  Recipe['rail']?,
  Recipe['detail']?,
  Recipe['decoration']?
];
export function recipes(rows: Row[]): Record<string, Recipe> {
  return Object.fromEntries(
    rows.map(
      ([
        key,
        header,
        heading,
        size,
        space,
        width,
        rail,
        detail,
        decoration,
      ]) => [
        key,
        { header, heading, size, space, width, rail, detail, decoration },
      ]
    )
  );
}
