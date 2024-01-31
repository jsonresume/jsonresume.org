import styled from 'styled-components';

const Dropdown = styled.select`
  width: 100%;
  height: 40px;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  font-size: 14px;
`;

export default function Component({ onChange, options }) {
  return (
    <>
      <Dropdown onChange={onChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Dropdown>
    </>
  );
}
