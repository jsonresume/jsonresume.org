import { Switch, Option } from '../styles/StyledComponents';
import { INTERVIEWER, CANDIDATE } from '../constants/roles';

export function PositionSwitch({ position, onToggle }) {
  return (
    <Switch>
      <Option active={position === INTERVIEWER} onClick={onToggle}>
        Interviewer
      </Option>
      <Option active={position === CANDIDATE} onClick={onToggle}>
        Candidate
      </Option>
    </Switch>
  );
}
