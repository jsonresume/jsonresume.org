import Section from './Section';

const About = ({ basics }) => {
  return (
    <Section>
      <h2 className="text-xl font-bold">About</h2>
      <p className="text-pretty font-mono text-sm text-muted-foreground">
        {basics.summary}
      </p>
    </Section>
  );
};

export default About;
