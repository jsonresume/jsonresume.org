'use client';

import { Toaster } from 'sonner';
import SwipeInterface from './SwipeInterface';
import { PathwaysProvider } from '../context/PathwaysContext';

export default function SwipePage() {
  return (
    <PathwaysProvider>
      <SwipeInterface />
      <Toaster position="bottom-right" richColors closeButton />
    </PathwaysProvider>
  );
}
