import { Stat, Stats } from '@jsonresume/ui';

export default function StatsDefault() {
  return (
    <Stats>
      <Stat value="67" label="Themes" />
      <Stat value="4,800+" label="Hosted resumes" />
      <Stat value="7,000+" label="GitHub stars" />
      <Stat value="2014" label="Since" />
    </Stats>
  );
}
