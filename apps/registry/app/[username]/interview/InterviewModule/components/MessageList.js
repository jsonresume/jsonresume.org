import {
  MessagesContainer,
  Messages,
  Message,
  Name,
} from '../styles/StyledComponents';
import { capitalizeFirstLetter } from '../utils/textUtils';
import { INTERVIEWER, CANDIDATE } from '../constants/roles';

export function MessageList({
  messages,
  replying,
  reply,
  position,
  bottomRef,
}) {
  return (
    <MessagesContainer>
      <Messages>
        {messages.map((message) => {
          return (
            <Message key={message.id}>
              <Name>{capitalizeFirstLetter(message.position)}:</Name>{' '}
              {message.content}
            </Message>
          );
        })}
        {replying && (
          <Message key="replying">
            <Name>
              {capitalizeFirstLetter(
                position === INTERVIEWER ? CANDIDATE : INTERVIEWER
              )}
              :
            </Name>{' '}
            {reply}
          </Message>
        )}
        <div ref={bottomRef} />
      </Messages>
    </MessagesContainer>
  );
}
