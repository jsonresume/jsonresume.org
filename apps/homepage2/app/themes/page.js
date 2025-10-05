import { themes } from './data/themes';
import { ThemeCard } from './components/ThemeCard';
import { ThemesInfo } from './components/ThemesInfo';

export const metadata = {
  title: 'Themes — JSON Resume',
  description: 'Themes for JSON Resume',
  image: 'https://jsonresume.org/images/logo.png',
  url: 'https://jsonresume.org/themes/',
};

export default function GettingStarted() {
  return (
    <>
      <header id="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <h1>Themes</h1>
            </div>
          </div>
        </div>
      </header>
      <div id="themes" className="container">
        <ThemesInfo />
        <br />
        <div className="row">
          {themes.map((theme) => (
            <ThemeCard key={theme.slug} theme={theme} />
          ))}
        </div>
      </div>
    </>
  );
}
