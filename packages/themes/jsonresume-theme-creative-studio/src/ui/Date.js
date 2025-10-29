const Date = ({ date }) => {
  if (!date) return null;

  const dateObj = new window.Date(date);
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();

  return `${month} ${year}`;
};

export default Date;
