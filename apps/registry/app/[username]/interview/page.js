'use client';

import { useState, use } from 'react';
import { INTERVIEWER, CANDIDATE } from './InterviewModule/constants/roles';
import { useInterviewMessages } from './InterviewModule/hooks/useInterviewMessages';
import { PositionSwitch } from './InterviewModule/components/PositionSwitch';
import { MessageList } from './InterviewModule/components/MessageList';
import { InterviewInput } from './InterviewModule/components/InterviewInput';

export default function Talk({ params }) {
  const { username } = use(params);
  const [showAbout] = useState(false);
  const [position, setPosition] = useState(CANDIDATE);

  const {
    messages,
    setMessages,
    text,
    reply,
    replying,
    bottomRef,
    textInput,
    handleInputChange,
    handleInputKeyPress,
  } = useInterviewMessages(username, position);

  const togglePosition = () => {
    const initialMessage =
      position === INTERVIEWER
        ? { position: CANDIDATE, content: 'Hi, I am ready to be interviewed' }
        : {
            position: INTERVIEWER,
            content: 'Hello, I am here to interview you',
          };
    setMessages([initialMessage]);
    setPosition(position === INTERVIEWER ? CANDIDATE : INTERVIEWER);
  };

  return (
    <>
      {!showAbout && (
        <>
          <PositionSwitch position={position} onToggle={togglePosition} />
          <MessageList
            messages={messages}
            replying={replying}
            reply={reply}
            position={position}
            bottomRef={bottomRef}
          />
          <InterviewInput
            username={username}
            position={position}
            text={text}
            replying={replying}
            textInput={textInput}
            onInputChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
          />
        </>
      )}
    </>
  );
}
