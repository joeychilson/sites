import type { MarkdownDocument } from '@tanstack/markdown';
import { Markdown, type MarkdownComponents } from '@tanstack/markdown/react';

import { CodeBlock } from '@/components/code-block';

const components = {
  'code-block': CodeBlock,
  img: ({ alt, ...props }) => <img alt={alt} {...props} loading="lazy" decoding="async" />,
} satisfies MarkdownComponents;

export function PostBody({ body }: { body: MarkdownDocument }) {
  return (
    <div className="prose mt-8 motion-safe:rise-1">
      <Markdown components={components} headingAnchors>
        {body}
      </Markdown>
    </div>
  );
}
