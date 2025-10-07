export default `body {
  color: var(--copy-color);
  display: flex;
  font: var(--base-font-size) 'Open Sans', Helvetica, Arial, sans-serif;
  justify-content: center;
  line-height: 1.25;
  -webkit-print-color-adjust: exact;
}

em {
  color: var(--grey);
}

p {
  font-size: 90%;
}

a {
  color: var(--anchor-color);
  font-weight: 400;
  text-decoration: none;
}

ul {
  margin-bottom: 0;
}

section {
  margin: var(--spacing) 0 var(--spacing-double);
}

blockquote {
  margin-bottom: 0 0 var(--spacing);
}

#resume {
  background: var(--white);
  margin: var(--spacing) var(--spacing-double);
  max-width: 760px;
}

section h2 {
  color: var(--accent);
  font-size: 135%;
  font-weight: 400;
  margin: 0 0 var(--spacing-double);
  position: relative;
  text-transform: uppercase;
}
section h2::after {
  background: var(--accent);
  bottom: -10px;
  content: ' ';
  display: inline-block;
  height: 3px;
  left: 0;
  position: absolute;
  width: 2.5rem;
}
section header h3 {
  margin: 0;
  font-weight: 600;
}`;
