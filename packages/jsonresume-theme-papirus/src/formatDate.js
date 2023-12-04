import moment from 'moment';

export default (date) => {
  if (typeof date === 'undefined') {
    return 'now';
  }
  return moment(date).format('MMM YYYY');
};
