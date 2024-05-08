import moment from 'moment';
import pluralize from 'pluralize';

export const dateDiff = (startDate, endDate) => {
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
};

export const formatDate = (date) => {
  if (typeof date === 'undefined') {
    return 'now';
  }
  return moment(date).format('MMM YYYY');
};

export const formatDateYear = (date) => {
  if (typeof date === 'undefined') {
    return 'now';
  }
  return moment(date).format('YYYY');
};

export const networkIcon = (network) => {
  if (network === 'StackOverflow') {
    return 'stack-overflow';
  } else {
    return network.toLowerCase();
  }
};
export const wordWrap = (str) => {
  str = str.replace(/\//g, '/ ');
  return str.replace('/ / ', '//');
};
