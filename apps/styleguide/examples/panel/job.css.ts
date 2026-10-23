import { style } from '@vanilla-extract/css';
import { vars } from '@jsonresume/ui/tokens';

export const root = style({ width: 'min(100%, 26rem)' });

export const copy = style({ marginTop: vars.space[4] });
