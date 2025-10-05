interface ProjectCardProps {
  name: string;
  description: string;
  link: string;
  language: string;
}

export function ProjectCard({
  name,
  description,
  link,
  language,
}: ProjectCardProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        marginBottom: '15px',
      }}
    >
      <div
        style={{
          flexWrap: 'wrap',
          minWidth: '200px',
          maxWidth: '200px',
          wordWrap: 'break-word',
        }}
      >
        <a href={link}>{name}</a>
      </div>
      <div
        style={{
          minWidth: '100px',
        }}
      >
        {language}
      </div>
      <div
        style={{
          flexGrow: 1,
        }}
      >
        {description}
      </div>
    </div>
  );
}
