import { describe, it, expect } from 'vitest';
import React from 'react';
import styled from 'styled-components';
import { renderResumeDocument, googleFontsLinks } from '../index.js';

const Box = styled.div`
  color: rgb(7, 8, 9);
`;

describe('theme-kit SSR re-export', () => {
  it('re-exports renderResumeDocument from @jsonresume/core/ssr', () => {
    const out = renderResumeDocument(<Box>Hi</Box>, { fonts: ['Inter'] });
    expect(out.startsWith('<!DOCTYPE html>')).toBe(true);
    expect(out).toContain('Hi');
    expect(out).toContain('color:rgb(7, 8, 9)');
    expect(out).toContain('family=Inter');
  });

  it('re-exports googleFontsLinks', () => {
    expect(googleFontsLinks(['Inter'])).toContain('family=Inter');
  });
});
