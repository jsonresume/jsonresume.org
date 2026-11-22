import type { ElementType } from 'react';
/**
 * Resume prose with its inline Markdown rendered (#600): **strong**,
 * *emphasis*, `code` and [links](https://example.com). The shared renderer
 * escapes the text first and keeps only http(s) and mailto links, so every
 * theme shows the same, safe result.
 */
export declare function Prose({ as: Tag, text, className, }: {
    as?: ElementType;
    text: string;
    className?: string;
}): import("react").JSX.Element;
