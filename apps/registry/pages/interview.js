import { Button } from 'ui';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import Layout from '../ui/Layout';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const InputContainer = styled.div`
  position: fixed;
  background: #fff18f;
  bottom: 0;
  left: 0;
  width: 100vw;
  height: 120px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  bottom: 50px;
  height: 50px;
  border: none;
  border-radius: 5px;
  padding: 20px;
  font-size: 20px;
  box-sizing: border-box;
  outline: none;
  background-color: #fff;
  width: 100%;
  max-width: 570px;
  margin: 0 30px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
  &:disabled {
    background-color: #f5f5f5;
  }
`;

// switch is fixed to the center top
const Switch = styled.div`
  position: fixed;
  top: 50px;
  width: 300px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Option = styled.div`
  background-color: ${(props) => (props.active ? '#df4848' : '#999')};
  width: 140px;
  cursor: pointer;
  height: 30px;

  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.active ? '#fbfbfb' : '#222')};
  &:hover {
    background-color: #ea8989;
  }

  &:first-child {
    border-radius: 5px 0px 0px 5px;
  }
  &:last-child {
    border-radius: 0px 5px 5px 0px;
  }
`;

const MessagesContainer = styled.div`
  background: #fbfbfb;
  max-width: 600px;
  padding: 90px 30px;
  width: 100%;
  height: calc(100vh - 170px);
`;

const Messages = styled.div`
  background: yellow;
  background: #fbfbfb;
  padding-bottom: 200px;
`;
const Message = styled.div`
  background: blue;
  background: #fbfbfb;
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
`;

const Name = styled.span`
  font-weight: 600;
  flex: 0 0 100px;
  display: inline-block;
  text-align: right;
  margin-right: 5px;
`;

const Helper = styled.div`
  font-size: 13px;
  margin-bottom: 15px;
  & a {
    text-decoration: none;
    font-weight: 600;
  }
  & a:hover {
    text-decoration: underline;
    color: #df4848;
  }
  & a:visited {
    color: #000;
  }
`;

const INTERVIEWER = 'interviewer';
const CANDIDATE = 'candidate';

const interviewId = 'axyz';

export default function Talk() {
  const router = useRouter();
  const parts = router.asPath.split('/');
  const username = parts[1];
  console.log({ username });
  const [text, setText] = useState('');
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState(CANDIDATE);
  const initialMessage =
    position === CANDIDATE
      ? {
          position: INTERVIEWER,
          content: 'Hello, I am here to interview you',
        }
      : { position: CANDIDATE, content: 'Hi, I am ready to be interviewed' };
  const [messages, setMessages] = useState([initialMessage]);

  const bottomRef = useRef(null);
  const textInput = useRef(null);

  const togglePosition = () => {
    setMessages([initialMessage]);
    setPosition(position === INTERVIEWER ? CANDIDATE : INTERVIEWER);
  };

  const postMessage = async () => {
    setReplying(true);
    console.log('what is the value of text', text);
    // const message = {
    //   id: uuidv4(),
    //   content: faker.lorem.lines({ min: 1, max: 10 }),
    // };
    // setMessages([...messages, message]);
    const prompt = text;

    const response = await fetch('/api/interview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        prompt,
        position,
        messages: messages.slice(-6),
      }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const data = response.body;
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let reply = '';
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      reply = reply + chunkValue;
      setReply(reply);
    }
    console.log('set reply');
    console.log({ reply });
    console.log('sdasdasda', { messages });

    setReplying(false);
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
  }, [replying]);

  console.log({ messages });

  const handleInputChange = (ev) => {
    setText(ev.target.value);
  };

  const handleInputKeyPress = (ev) => {
    if (ev.key === 'Enter') {
      console.log('do validate');
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

  const onShowAbout = () => {
    console.log('show about');
    // toggle showAbout
    setShowAbout(!showAbout);
  };

  console.log({ showAbout });

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Layout>
      {!showAbout && (
        <>
          <Switch>
            <Option active={position === INTERVIEWER} onClick={togglePosition}>
              Interviewer
            </Option>
            <Option active={position === CANDIDATE} onClick={togglePosition}>
              Candidate
            </Option>
          </Switch>
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
          <InputContainer>
            {position === INTERVIEWER && (
              <Helper>
                You are currentlying interviewing&nbsp;
                <a href={`https://registry.jsonresume.org/${username}`}>
                  {username}
                </a>
              </Helper>
            )}
            {position === CANDIDATE && (
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
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
              disabled={replying}
              value={replying ? 'Thinking...' : text}
              ref={textInput}
            />
          </InputContainer>
        </>
      )}
    </Layout>
  );
}
