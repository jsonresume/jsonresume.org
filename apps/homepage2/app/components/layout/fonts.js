import { Ubuntu, Lato, Open_Sans } from 'next/font/google';

export const ubuntu = Ubuntu({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-ubuntu',
  weight: ['300', '400', '500', '700'],
});

export const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-open-sans',
  weight: ['300', '400', '600', '700', '800'],
});

export const lato = Lato({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lato',
  weight: ['100', '300', '400', '700', '900'],
});

export const fontVariables = `${lato.variable} ${openSans.variable} ${ubuntu.variable}`;
