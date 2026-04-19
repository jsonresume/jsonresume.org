'use client';

import { Children, isValidElement, useEffect, useRef, useState, type ReactNode } from 'react';

// Diagram-kind keywords. Match via regex (keyword followed by whitespace
// or end) so the check works after text.trim() strips trailing newlines.
const MERMAID_START_RE = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram(?:-v2)?|erDiagram|gantt|pie|gitGraph|journey|mindmap|timeline|quadrantChart|requirementDiagram)(\s|$)/;

function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  let result = '';
  Children.forEach(children, (child) => {
    if (typeof child === 'string') result += child;
    else if (isValidElement(child) && (child.props as { children?: ReactNode })?.children) {
      result += extractText((child.props as { children?: ReactNode }).children);
    }
  });
  return result;
}

function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState('');

  useEffect(() => {
    import('mermaid').then(async (mod) => {
      const mermaid = mod.default;
      // 'strict' forbids click handlers and inline JS in rendered SVG —
      // required because diagram source is LLM-generated and may contain
      // hostile nodes. Theme follows prefers-color-scheme so the diagram
      // matches the page rather than hard-coding dark.
      const prefersDark = typeof window !== 'undefined'
        && window.matchMedia
        && window.matchMedia('(prefers-color-scheme: dark)').matches;
      mermaid.initialize({
        startOnLoad: false,
        theme: prefersDark ? 'dark' : 'default',
        securityLevel: 'strict',
      });
      try {
        const id = 'mermaid-' + Math.random().toString(36).slice(2);
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch {
        setSvg('<pre style="color:red">Invalid Mermaid diagram</pre>');
      }
    });
  }, [chart]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: svg }} className="my-4 flex justify-center" />;
}

export function Pre(props: React.ComponentProps<'pre'>) {
  const text = extractText(props.children);
  if (text && MERMAID_START_RE.test(text.trim())) {
    return <MermaidDiagram chart={text} />;
  }
  return <pre {...props} />;
}
