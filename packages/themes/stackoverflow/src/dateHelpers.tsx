import moment from 'moment';

export const MY = (date: string) =>
  moment(date, ['YYYY-MM-DD']).format('MMM YYYY');

export const Y = (date: string) => moment(date, ['YYYY-MM-DD']).format('YYYY');
export const DMY = (date: string) =>
  moment(date, ['YYYY-MM-DD']).format('D MMM YYYY');
