import moment from 'moment';
import pluralize from 'pluralize';

export default function (startDate, endDate) {
  let text = '';
  startDate = moment(startDate);
  if (endDate === null || endDate === '' || endDate === undefined) {
    endDate = moment();
  } else {
    endDate = moment(endDate);
  }
  let years = endDate.diff(startDate, 'years');
  startDate.add(years, 'years');
  let months = endDate.diff(startDate, 'months');

  if (years > 0) {
    text += `${years} ${pluralize('years', years)}`;
  }
  if (months > 0) {
    if (years > 0) {
      text += ' ';
    }
    text += `${months} ${pluralize('months', months)}`;
  }

  return text;
}
