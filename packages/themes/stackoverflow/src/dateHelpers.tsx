import moment from 'moment';

export const MY = (date: string) =>
  moment(date, ['YYYY-MM-DD', 'YYYY-MM', 'YYYY']).format('MMM YYYY');

export const Y = (date: string) =>
  moment(date, ['YYYY-MM-DD', 'YYYY-MM', 'YYYY']).format('YYYY');

export const DMY = (date: string) =>
  moment(date, ['YYYY-MM-DD', 'YYYY-MM', 'YYYY']).format('D MMM YYYY');
