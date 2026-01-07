'use client';

import { Toaster } from 'sonner';
import Pathways from './Pathways';
import { PathwaysProvider } from './context/PathwaysContext';

export default function PathwaysPage() {
  return (
    <PathwaysProvider>
      <Pathways />
      <Toaster position="bottom-right" richColors closeButton />
    </PathwaysProvider>
  );
}
