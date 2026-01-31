import styled from 'styled-components';
import Date from './Date.jsx';

const Range = styled.div`
  display: flex;
`;

const DateRange = ({ startDate, endDate }) => {
  return (
    <Range>
      <Date date={startDate} />—
      <Date date={endDate} />
    </Range>
  );
};

export default DateRange;
