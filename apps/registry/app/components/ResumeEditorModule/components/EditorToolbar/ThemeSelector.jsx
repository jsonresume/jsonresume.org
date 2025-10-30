import { Palette } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/ui';
import { THEME_NAMES } from '@/lib/formatters/template/themeConfig';

const AVAILABLE_THEMES = THEME_NAMES;

export const ThemeSelector = ({ selectedTheme, setSelectedTheme }) => {
  return (
    <div
      className="flex items-center gap-2"
      role="navigation"
      aria-label="Theme selection"
    >
      <Palette className="w-4 h-4 text-gray-500" aria-hidden="true" />
      <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Theme:
      </label>
      <Select value={selectedTheme} onValueChange={setSelectedTheme}>
        <SelectTrigger className="w-[180px]" aria-label="Select resume theme">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          {AVAILABLE_THEMES.map((theme) => (
            <SelectItem key={theme} value={theme}>
              {theme}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
