/**
 * Rows of a CSV file (RFC 4180: quoted fields, doubled quotes, newlines
 * inside quotes, CRLF or LF), as LinkedIn's data export writes them.
 */
export const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (quoted) {
      if (c === '"' && input[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"' && field === '') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && input[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows.filter((r) => r.some((f) => f.trim() !== ''));
};

/**
 * A CSV's rows as records by header. Some LinkedIn files start with a few
 * lines of notes: the header is the first row naming `expect`.
 */
export const csvRecords = (
  text: string,
  expect: string
): Array<Record<string, string>> => {
  const rows = parseCsv(text);
  const start = rows.findIndex((r) => r.some((f) => f.trim() === expect));
  if (start < 0) return [];
  const header = (rows[start] ?? []).map((h) => h.trim());
  return rows
    .slice(start + 1)
    .map((r) =>
      Object.fromEntries(header.map((h, i) => [h, (r[i] ?? '').trim()]))
    );
};
