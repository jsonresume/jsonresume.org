import { TabNav, TabNavLink } from '@jsonresume/ui';

// Each tab is a real page. With Next.js: <TabNavLink asChild><Link href=… /></TabNavLink>.
export default function TabNavProfile() {
  return (
    <TabNav label="Profile">
      <TabNavLink href="#dashboard" active>
        Dashboard
      </TabNavLink>
      <TabNavLink href="#jobs">Jobs</TabNavLink>
      <TabNavLink href="#timeline">Timeline</TabNavLink>
      <TabNavLink href="#ats">ATS score</TabNavLink>
      <TabNavLink href="#letter">Cover letter</TabNavLink>
    </TabNav>
  );
}
