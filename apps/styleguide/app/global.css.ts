import { globalStyle } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

globalStyle('html', { scrollPaddingTop: vars.space[4] });

globalStyle('body', { minHeight: '100vh' });
