/* eslint-disable no-unused-vars */
import type { JSX as ReactJSX } from 'react';

declare global {
  // Provide global JSX namespace for libraries (e.g. react-markdown@8)
  // that reference it directly instead of React.JSX (React 19 change)
  namespace JSX {
    type Element = ReactJSX.Element;
    type IntrinsicElements = ReactJSX.IntrinsicElements;
    type ElementClass = ReactJSX.ElementClass;
  }
}
