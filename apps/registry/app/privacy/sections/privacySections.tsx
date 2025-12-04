'use client';

import { PrivacySection } from '../components';

export const InformationWeCollect = () => (
  <PrivacySection number="1" title="Information We Collect">
    <p>
      When you use JSON Resume, we collect and process the following
      information:
    </p>
    <ul className="list-disc pl-6 mt-2">
      <li>GitHub authentication data (when you sign in with GitHub)</li>
      <li>Resume data that you explicitly provide</li>
      <li>Basic usage analytics (page views, error logs)</li>
    </ul>
  </PrivacySection>
);

export const HowWeUseInfo = () => (
  <PrivacySection number="2" title="How We Use Your Information">
    <p>We use the collected information for the following purposes:</p>
    <ul className="list-disc pl-6 mt-2">
      <li>To provide and maintain the JSON Resume service</li>
      <li>To authenticate you via GitHub</li>
      <li>To store and display your resume data</li>
      <li>To improve the service through analytics</li>
    </ul>
  </PrivacySection>
);

export const DataStorage = () => (
  <PrivacySection number="3" title="Data Storage and Security">
    <p>
      Your resume data is stored in GitHub Gists under your control. We do not
      maintain a separate database of resume content. Authentication is handled
      securely through GitHub's OAuth system.
    </p>
  </PrivacySection>
);

export const DataSharing = () => (
  <PrivacySection number="4" title="Data Sharing">
    <p>
      We do not sell or share your personal information with third parties. Your
      resume data is public or private according to your GitHub Gist settings.
      We recommend reviewing your GitHub privacy settings to ensure your resume
      data is shared according to your preferences.
    </p>
  </PrivacySection>
);

export const CookiesAndTracking = () => (
  <PrivacySection number="5" title="Cookies and Tracking">
    <p>
      We use minimal cookies necessary for authentication and basic site
      functionality. We may use basic analytics to understand site usage
      patterns, but we do not track individual users or collect detailed
      personal information.
    </p>
  </PrivacySection>
);

export const YourRights = () => (
  <PrivacySection number="6" title="Your Rights">
    <p>You have the right to:</p>
    <ul className="list-disc pl-6 mt-2">
      <li>Access your resume data (through your GitHub account)</li>
      <li>Delete your resume data (by deleting your GitHub Gist)</li>
      <li>Delete your cached resume data (see section 7 below)</li>
      <li>Revoke JSON Resume's access to your GitHub account</li>
      <li>Request information about what data we have about you</li>
    </ul>
  </PrivacySection>
);

export const ChildrensPrivacy = () => (
  <PrivacySection number="8" title="Children's Privacy">
    <p>
      Our service is not directed to children under 13. We do not knowingly
      collect personal information from children under 13. If you are under 13,
      please do not use our service or provide any personal information.
    </p>
  </PrivacySection>
);

export const PolicyChanges = () => (
  <PrivacySection number="9" title="Changes to This Policy">
    <p>
      We may update this privacy policy from time to time. We will notify users
      of any material changes by posting the new privacy policy on this page.
    </p>
  </PrivacySection>
);
