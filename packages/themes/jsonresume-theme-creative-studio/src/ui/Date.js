const Date = ({ date }) => {
  if (!date) return null;

  // Use global Date constructor instead of window.Date for SSR compatibility
  const dateObj = new globalThis.Date(date);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${month} ${year}`;
};

export default Date;
