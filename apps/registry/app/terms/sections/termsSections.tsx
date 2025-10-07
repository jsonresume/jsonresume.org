'use client';

import { TermsSection } from '../components';

export const TermsIntro = () => (
  <TermsSection number="1" title="Terms">
    <p>
      By accessing JSON Resume, you agree to be bound by these terms of service.
      These terms apply to all users of the site, including without limitation
      users who are contributors to the open-source project.
    </p>
  </TermsSection>
);

export const UseLicense = () => (
  <TermsSection number="2" title="Use License">
    <p>
      JSON Resume is an open-source project. The source code is available under
      the MIT license. You are free to use, modify, and distribute the code
      according to the terms of the MIT license.
    </p>
  </TermsSection>
);

export const Disclaimer = () => (
  <TermsSection number="3" title="Disclaimer">
    <p>
      JSON Resume is provided "as is", without warranty of any kind, express or
      implied. We make no warranties, expressed or implied, and hereby disclaim
      and negate all other warranties, including without limitation, implied
      warranties or conditions of merchantability, fitness for a particular
      purpose, or non-infringement of intellectual property.
    </p>
  </TermsSection>
);

export const Limitations = () => (
  <TermsSection number="4" title="Limitations">
    <p>
      In no event shall JSON Resume or its contributors be liable for any
      damages arising out of the use or inability to use the service. This
      includes but is not limited to damages for loss of data or profit, or due
      to business interruption.
    </p>
  </TermsSection>
);

export const UserContent = () => (
  <TermsSection number="5" title="User Content">
    <p>
      When you create or make available your resume through JSON Resume, you
      represent that:
    </p>
    <ul className="list-disc pl-6 mt-2">
      <li>
        The creation and use of your content doesn't violate any applicable laws
      </li>
      <li>Your content is your own or you have the right to use it</li>
      <li>You understand that your resume may be publicly accessible</li>
    </ul>
  </TermsSection>
);

export const ServiceModifications = () => (
  <TermsSection number="6" title="Service Modifications">
    <p>
      We reserve the right to modify or discontinue, temporarily or permanently,
      the service with or without notice. We shall not be liable to you or to
      any third party for any modification, suspension, or discontinuance of the
      service.
    </p>
  </TermsSection>
);

export const GoverningLaw = () => (
  <TermsSection number="7" title="Governing Law">
    <p>
      These terms shall be governed by and construed in accordance with the laws
      of the jurisdiction in which the project maintainers reside, without
      regard to its conflict of law provisions.
    </p>
  </TermsSection>
);
