function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function highlightText(text, filter) {
  if (!text || !filter) return text;
  const parts = text.split(new RegExp(`(${escapeRegex(filter)})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === filter.toLowerCase() ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}
