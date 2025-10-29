import styled from 'styled-components';
import Date from './Date';

const DateRangeText = styled.p`
  color: #999;
  font-size: 0.95rem;
  font-style: italic;
`;

const DateRange = ({ startDate, endDate }) => {
  if (!startDate) return null;

  return (
    <DateRangeText>
      <Date date={startDate} /> -{' '}
      {endDate ? <Date date={endDate} /> : 'Present'}
    </DateRangeText>
  );
};

export default DateRange;
