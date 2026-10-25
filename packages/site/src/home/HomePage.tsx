import { ForDevelopers } from './ForDevelopers';
import { HomeHero } from './HomeHero';
import { HowItWorks } from './HowItWorks';
import { OpenSourceBand } from './OpenSourceBand';
import { ProjectStats } from './ProjectStats';
import { ThemeShowcase } from './ThemeShowcase';

export function HomePage() {
  return (
    <>
      <HomeHero />
      <ProjectStats />
      <HowItWorks />
      <ThemeShowcase />
      <ForDevelopers />
      <OpenSourceBand />
    </>
  );
}
