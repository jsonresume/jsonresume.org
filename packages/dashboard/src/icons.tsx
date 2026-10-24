/** Small line icons for the sidebar (16px, currentColor). */
const Icon = ({ d }: { d: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d={d}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ChartIcon = () => <Icon d="M2 13.5h12M4 11V8m4 3V4m4 7V6.5" />;
export const FileIcon = () => (
  <Icon d="M4 1.75h5L12.25 5v9.25H4zM9 1.75V5h3.25M6 8.5h4M6 11h4" />
);
export const GearIcon = () => (
  <Icon d="M8 10.25a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5ZM8 1.5v1.75M8 12.75v1.75M1.5 8h1.75M12.75 8h1.75M3.4 3.4l1.25 1.25M11.35 11.35l1.25 1.25M3.4 12.6l1.25-1.25M11.35 4.65l1.25-1.25" />
);
export const OpenIcon = () => (
  <Icon d="M9.5 2.25h4.25V6.5M13.5 2.5 7.75 8.25M12 9.5v4.25H2.25V4H6.5" />
);
export const PenIcon = () => <Icon d="M10.5 2.5l3 3L5 14H2v-3zM9 4l3 3" />;
