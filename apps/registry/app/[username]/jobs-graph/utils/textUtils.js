/**
 * Highlights matching text within a string
 * @param {string} text - Text to search in
 * @param {string} searchText - Text to highlight
 * @returns {string|JSX} Text with highlighted matches
 */
export const highlightText = (text, searchText) => {
  if (!searchText || !text) return text;
  const parts = text.toString().split(new RegExp(`(${searchText})`, 'gi'));
  return parts.map((part, index) =>
    part.toLowerCase() === searchText.toLowerCase() ? (
      <span key={index} className="bg-yellow-200">
        {part}
      </span>
    ) : (
      part
    )
  );
};
