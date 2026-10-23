const longDate = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

/** '2014-07-31' -> '31 July 2014', the same on the server and in the browser. */
export const formatDate = (isoDate: string) =>
  longDate.format(new Date(`${isoDate}T00:00:00Z`));
