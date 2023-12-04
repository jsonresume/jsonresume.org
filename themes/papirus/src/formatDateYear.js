import moment from 'moment';
export default function (date) {
  if (typeof date === 'undefined') {
    return 'now';
  }
  return moment(date).format('YYYY');
}
