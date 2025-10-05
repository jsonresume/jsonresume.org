import { Palette } from 'lucide-react';

const AVAILABLE_THEMES = [
  'ace',
  'actual',
  'autumn',
  'cora',
  'cv',
  'elegant',
  'el-santo',
  'even',
  'flat',
  'full',
  'github',
  'github2',
  'jacrys',
  'kards',
  'kendall',
  'lucide',
  'macchiato',
  'mantra',
  'minyma',
  'mocha-responsive',
  'msresume',
  'one',
  'onepage',
  'onepage-plus',
  'onepageresume',
  'orbit',
  'paper',
  'paper-plus-plus',
  'papirus',
  'professional',
  'pumpkin',
  'relaxed',
  'rickosborne',
  'rocketspacer',
  'simple-red',
  'spartan',
  'spartacus',
  'stackoverflow',
  'standard',
  'standard-resume',
  'tan-responsive',
  'techlead',
];

export const ThemeSelector = ({ selectedTheme, setSelectedTheme }) => {
  return (
    <div
      className="flex items-center gap-2"
      role="navigation"
      aria-label="Theme selection"
    >
      <Palette className="w-4 h-4 text-gray-500" aria-hidden="true" />
      <label
        htmlFor="theme-select"
        className="text-sm font-medium text-gray-700 whitespace-nowrap"
      >
        Theme:
      </label>
      <select
        id="theme-select"
        value={selectedTheme}
        onChange={(e) => setSelectedTheme(e.target.value)}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
        aria-label="Select resume theme"
      >
        {AVAILABLE_THEMES.map((theme) => (
          <option key={theme} value={theme}>
            {theme}
          </option>
        ))}
      </select>
    </div>
  );
};
