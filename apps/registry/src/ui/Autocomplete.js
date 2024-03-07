import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  input {
    border: 1px solid #999;
    padding: 8px;
    width: 100%;
  }
  .autocomplete-container {
    position: absolute;
    top: 40px;
    left: 0;
  }
  .no-autocomplete {
    color: #999;
    padding: 8px;
  }
  .autocomplete {
    border: 1px solid #999;
    border-top-width: 0;
    list-style: none;
    margin-top: 0;
    max-height: 143px;
    overflow-y: auto;
    padding-left: 0;
    width: calc(300px + 1rem);
  }
  .autocomplete li {
    padding: 8px;
    background: #fff;
  }
  .autocomplete > .active,
  .autocomplete li:hover {
    background-color: darkgray;
    cursor: pointer;
    font-weight: 700;
  }
  .autocomplete li:not(:last-of-type) {
    border-bottom: 1px solid #999;
  }
`;

const Autocomplete = ({ suggestions, onChange, defaultValue }) => {
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [input, setInput] = useState(defaultValue || '');

  const onChangeInput = (e) => {
    const input = e.currentTarget.value;
    const newFilteredSuggestions = suggestions.filter(
      (suggestion) => suggestion.toLowerCase().indexOf(input.toLowerCase()) > -1
    );
    setActive(0);
    setFiltered(newFilteredSuggestions);
    setIsShow(true);
    setInput(e.currentTarget.value);
  };

  const onClick = (e) => {
    setActive(0);
    setFiltered([]);
    setIsShow(false);
    onChooseValue(e.currentTarget.innerText);
  };

  const onChooseValue = (value) => {
    setInput(value);
    onChange(value);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      setActive(0);
      setIsShow(false);
      onChooseValue(filtered[active]);
    } else if (e.keyCode === 38) {
      return active === 0 ? null : setActive(active - 1);
    } else if (e.keyCode === 40) {
      return active - 1 === filtered.length ? null : setActive(active + 1);
    }
  };

  const renderAutocomplete = () => {
    if (isShow && input) {
      if (filtered.length) {
        return (
          <ul className="autocomplete">
            {filtered.map((suggestion, index) => {
              let className;
              if (index === active) {
                className = 'active';
              }
              return (
                <li className={className} key={suggestion} onClick={onClick}>
                  {suggestion}
                </li>
              );
            })}
          </ul>
        );
      } else {
        return (
          <div className="no-autocomplete">
            <em>Not found</em>
          </div>
        );
      }
    }
    return <></>;
  };
  return (
    <Container>
      <input
        type="text"
        onChange={onChangeInput}
        onKeyDown={onKeyDown}
        value={input}
      />
      <div className="autocomplete-container">{renderAutocomplete()}</div>
    </Container>
  );
};
export default Autocomplete;
