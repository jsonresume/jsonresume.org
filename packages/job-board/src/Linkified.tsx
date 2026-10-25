const LINK =
  /(https?:\/\/[^\s<>"')]+[^\s<>"').,;:!?]|[\w.+-]+@[\w-]+\.[\w.-]*\w)/g;

/** Text with its URLs and email addresses as links. */
export function Linkified({ text }: { text: string }) {
  return (
    <>
      {text.split(LINK).map((part, i) =>
        i % 2 === 0 ? (
          part
        ) : (
          <a
            key={i}
            href={
              part.includes('@') && !part.startsWith('http')
                ? `mailto:${part}`
                : part
            }
            rel="nofollow noopener"
          >
            {part}
          </a>
        )
      )}
    </>
  );
}

/** Where the apply button goes: a URL, or an email address as mailto. */
export const applyHref = (apply: string | null): string | null => {
  if (!apply) return null;
  const match = apply.match(LINK);
  const target = match?.[0];
  if (!target) return null;
  return target.startsWith('http') ? target : `mailto:${target}`;
};
