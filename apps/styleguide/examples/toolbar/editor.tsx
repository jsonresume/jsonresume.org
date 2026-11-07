'use client';

import {
  Toolbar,
  ToolbarButton,
  ToolbarLink,
  ToolbarSeparator,
  ToolbarToggleGroup,
  ToolbarToggleItem,
} from '@jsonresume/ui';
import { Download, ExternalLink, Eye, Redo2, Undo2, Wand2 } from 'lucide-react';

export default function ToolbarEditor() {
  return (
    <Toolbar label="Resume editor">
      <ToolbarButton aria-label="Undo">
        <Undo2 aria-hidden="true" />
      </ToolbarButton>
      <ToolbarButton aria-label="Redo">
        <Redo2 aria-hidden="true" />
      </ToolbarButton>
      <ToolbarSeparator />
      <ToolbarToggleGroup
        type="single"
        defaultValue="split"
        aria-label="Layout"
      >
        <ToolbarToggleItem value="edit">Edit</ToolbarToggleItem>
        <ToolbarToggleItem value="split">Split</ToolbarToggleItem>
        <ToolbarToggleItem value="preview">
          <Eye aria-hidden="true" /> Preview
        </ToolbarToggleItem>
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarButton>
        <Wand2 aria-hidden="true" /> Improve with AI
      </ToolbarButton>
      <ToolbarButton>
        <Download aria-hidden="true" /> Export
      </ToolbarButton>
      {/* Navigation in a toolbar is a ToolbarLink: same look, a real link. */}
      <ToolbarLink href="https://jsonresume.org/@thomasdavis">
        <ExternalLink aria-hidden="true" /> View page
      </ToolbarLink>
    </Toolbar>
  );
}
