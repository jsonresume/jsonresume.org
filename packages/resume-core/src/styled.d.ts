import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors?: {
      primary?: string;
      secondary?: string;
      tertiary?: string;
      text?: string;
      link?: string;
      linkVisited?: string;
      accent?: string;
      accentLight?: string;
      accentMuted?: string;
      accentBorder?: string;
      muted?: string;
      border?: string;
      borderLight?: string;
    };
    spacing?: {
      section?: string;
      item?: string;
      small?: string;
      tight?: string;
    };
    typography?: {
      heading?: string;
      body?: string;
      small?: string;
      lineHeight?: string;
      weightMedium?: string;
      sizes?: {
        small?: string;
      };
      weights?: {
        medium?: string;
        semibold?: string;
      };
    };
    radius?: {
      sm?: string;
      md?: string;
      full?: string;
    };
  }
}
