import { useState, useEffect, useRef } from 'react';
import { logger } from '@/lib/logger';
import { v4 as uuidv4 } from 'uuid';
import { INTERVIEWER, CANDIDATE } from '../constants/roles';
import { streamInterviewResponse } from '../utils/interviewApi';

export function useInterviewMessages(username, position) {
  const initialMessage =
    position === CANDIDATE
      ? {
          position: INTERVIEWER,
          content: 'Hello, I am here to interview you',
        }
      : { position: CANDIDATE, content: 'Hi, I am ready to be interviewed' };

  const [messages, setMessages] = useState([initialMessage]);
  const [text, setText] = useState('');
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(null);
  const bottomRef = useRef(null);
  const textInput = useRef(null);

  const postMessage = async () => {
    setReplying(true);
    const prompt = text;

    try {
      await streamInterviewResponse(
        username,
        prompt,
        position,
        messages.slice(-6),
        (streamReply) => setReply(streamReply)
      );
      setReplying(false);
    } catch (error) {
      logger.error({ error: error.message }, 'Interview API error:');
      setReplying(false);
    }
  };

  const handleInputChange = (ev) => {
    setText(ev.target.value);
  };

  const handleInputKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      setMessages([
        ...messages,
        {
          id: uuidv4(),
          content: ev.target.value,
          position,
        },
      ]);
      postMessage();
      setText('');
    }
  };

  useEffect(() => {
    if (replying !== null && reply !== '') {
      setMessages([
        ...messages,
        {
          id: uuidv4(),
          content: reply,
          position: position === INTERVIEWER ? CANDIDATE : INTERVIEWER,
        },
      ]);
      setReply('');
      textInput?.current?.focus();
    }
  }, [messages, position, reply, replying]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return {
    messages,
    setMessages,
    text,
    reply,
    replying,
    bottomRef,
    textInput,
    handleInputChange,
    handleInputKeyPress,
  };
}
