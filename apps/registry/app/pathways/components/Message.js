import Part from './Part';

export default function Message({ message }) {
  return (
    <div className="space-y-1">
      <strong className="capitalize text-xs">{`${message.role}: `}</strong>
      {message.parts.map((part, idx) => (
        <Part key={idx} part={part} />
      ))}
    </div>
  );
}
