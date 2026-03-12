import { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { h } from './h.js';

const ICONS = {
  interested: '⭐',
  applied: '📨',
  maybe: '❓',
  not_interested: '✗',
  dismissed: '👁',
  success: '✓',
  error: '✗',
  info: 'ℹ',
  export: '📄',
};

const COLORS = {
  interested: 'green',
  applied: 'cyan',
  maybe: 'yellow',
  not_interested: 'red',
  dismissed: 'gray',
  success: 'green',
  error: 'red',
  info: 'blue',
  export: 'green',
};

export function useToast(timeout = 2500) {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), timeout);
    return () => clearTimeout(timer);
  }, [toast, timeout]);

  const show = (message, type = 'info') => {
    setToast({ message, type, time: Date.now() });
  };

  return { toast, show };
}

export default function Toast({ toast }) {
  if (!toast) return null;

  const icon = ICONS[toast.type] || ICONS.info;
  const color = COLORS[toast.type] || 'blue';

  return h(
    Box,
    { paddingX: 1 },
    h(Text, { color, bold: true }, `${icon} ${toast.message}`)
  );
}
