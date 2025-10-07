export default `section.heading header h1 {
  font-size: 180%;
  font-weight: 300;
  margin: 0;
}
section.heading header h2 {
  font-size: 140%;
  font-weight: 400;
  margin: 0;
}
section.heading header h2::after {
  display: none;
}
section.heading header .contact {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--spacing);
}
@media (min-width: 567px) {
  section.heading header .contact {
    flex-direction: row;
    justify-content: space-between;
  }
}
section.heading header address {
  font-size: 90%;
  font-style: normal;
  padding-bottom: var(--spacing);
}
section.heading .profiles {
  display: flex;
  flex-direction: column;
  padding-bottom: var(--spacing);
}
@media (min-width: 567px) {
  section.heading .profiles {
    flex-direction: row;
    justify-content: start;
  }
}
section.heading .profiles .profile.print {
  display: none;
}
@media print {
  section.heading .profiles .profile.print {
    display: block;
  }
}
section.heading .profiles strong {
  margin: 0 var(--spacing-small) 0 0;
}
section.heading .profiles span {
  margin: 0 var(--spacing-double) 0 0;
}`;
