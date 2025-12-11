'use client';

import Pathways from './Pathways';
import { PathwaysProvider } from './context/PathwaysContext';

export default function PathwaysPage() {
  return (
    <PathwaysProvider>
      <Pathways />
    </PathwaysProvider>
  );
}
