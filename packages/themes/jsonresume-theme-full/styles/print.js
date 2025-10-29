export default `@media print {
  section.heading .profiles .profile:not(.print),
  section.publications .item .website {
    display: none;
  }
}

@media print {
  body {
    font-size: 11pt;
    margin: 0;
    padding: 0;
  }
}`;
