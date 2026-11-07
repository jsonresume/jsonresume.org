export interface Palette {
  ink: string;
  muted: string;
  accent: string;
  rule: string;
  soft: string;
  sidebar: string;
  sidebarInk: string;
}

const schemes: Record<string, [string, string, string][]> = {
  mono: [
    ['#25282c', '#f3f4f5', '#25282c'],
    ['#17212a', '#eef1f3', '#17212a'],
    ['#383838', '#f5f5f3', '#303030'],
  ],
  blue: [
    ['#1e4b83', '#edf3fa', '#183b63'],
    ['#24566c', '#edf6f8', '#173f52'],
    ['#284c91', '#eef2fa', '#203a70'],
  ],
  green: [
    ['#215c47', '#edf5f0', '#194d3c'],
    ['#33604a', '#f0f5ef', '#294b39'],
    ['#17616a', '#edf6f5', '#164b53'],
  ],
  warm: [
    ['#854326', '#faf3ec', '#65442d'],
    ['#75512e', '#f6f2e9', '#5c452f'],
    ['#864c42', '#faf1ed', '#653b34'],
  ],
  red: [
    ['#a92335', '#fbf0f1', '#791b2a'],
    ['#9b3438', '#faf0ed', '#70272d'],
    ['#9b3027', '#fcf1ec', '#76251f'],
  ],
  purple: [
    ['#703d80', '#f5eff8', '#51265f'],
    ['#78384e', '#faf0f3', '#5a2a3d'],
    ['#4f488b', '#f2f0fa', '#38325f'],
  ],
  multi: [
    ['#264c78', '#f1f4fa', '#233b58'],
    ['#6d3c74', '#f6f0f7', '#512c56'],
    ['#1e5f59', '#eff7f5', '#174841'],
  ],
};

export function palette(color: string, index: number): Palette {
  const options = schemes[color] ?? schemes.mono;
  const [accent, soft, sidebar] = options[index % options.length];
  return {
    ink: '#20262e',
    muted: '#4b5563',
    accent,
    soft,
    sidebar,
    sidebarInk: '#ffffff',
    rule: '#c8cfd5',
  };
}
