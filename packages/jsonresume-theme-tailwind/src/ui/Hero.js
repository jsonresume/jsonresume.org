const HeroComponent = ({ basics }) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1 space-y-1.5">
        <h1 className="text-2xl font-bold">{basics.name}</h1>
        <p className="max-w-md text-pretty font-mono text-sm text-muted-foreground">
          {basics.label}
        </p>
        <p className="max-w-md items-center text-pretty font-mono text-xs text-muted-foreground">
          <a
            className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
            href={basics.location.city}
            target="_blank"
          >
            {basics.location.city}
          </a>
        </p>
      </div>
    </div>
  );
};

export default HeroComponent;
