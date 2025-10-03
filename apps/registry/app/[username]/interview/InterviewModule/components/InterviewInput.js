import { InputContainer, Input, Helper } from '../styles/StyledComponents';
import { INTERVIEWER } from '../constants/roles';

export function InterviewInput({
  username,
  position,
  text,
  replying,
  textInput,
  onInputChange,
  onKeyPress,
}) {
  return (
    <InputContainer>
      {position === INTERVIEWER && (
        <Helper>
          You are currentlying interviewing&nbsp;
          <a href={`https://registry.jsonresume.org/${username}`}>{username}</a>
        </Helper>
      )}
      {position !== INTERVIEWER && (
        <Helper>
          You are being interviewed as&nbsp;
          <a
            target="__blank"
            href={`https://registry.jsonresume.org/${username}`}
          >
            {username}
          </a>
        </Helper>
      )}
      <Input
        placeholder="Write here..."
        autoFocus
        onChange={onInputChange}
        onKeyPress={onKeyPress}
        disabled={replying}
        value={replying ? 'Thinking...' : text}
        ref={textInput}
      />
    </InputContainer>
  );
}
