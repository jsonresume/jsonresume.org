/**
 * Hover information panel component
 * @param {Object} hoverNode - Currently hovered node
 */
export function HoverInfo({ hoverNode }) {
  if (!hoverNode) return null;

  return (
    <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg">
      <h3 className="font-bold">{hoverNode.id}</h3>
      <p>{hoverNode.count} resumes</p>
      <p className="text-sm text-gray-600">Click to view a sample resume</p>
    </div>
  );
}
