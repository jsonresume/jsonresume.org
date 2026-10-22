import { CLISection } from './components/CLISection';
import { HostingSection } from './components/HostingSection';
import { pageMetadata } from '../lib/pageMetadata';

export const metadata = pageMetadata({
  title: 'Getting Started - JSON Resume',
  description: 'Getting started with JSON Resume',
  url: 'https://jsonresume.org/getting-started/',
});

export default function GettingStarted() {
  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Getting Started</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="getting-started" className="container">
        <div className="row">
          <CLISection />
          <HostingSection />
        </div>
      </div>
    </>
  );
}
