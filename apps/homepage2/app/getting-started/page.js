import { CLISection } from './components/CLISection';
import { HostingSection } from './components/HostingSection';

export const metadata = {
  title: 'Getting Started - JSON Resume',
  description: 'Getting started with JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/getting-started/',
};

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
