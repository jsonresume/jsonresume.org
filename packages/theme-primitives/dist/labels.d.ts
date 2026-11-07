import type { SectionId } from './types.js';
export declare const order: SectionId[];
export declare function labels(language: string): {
    language: string;
    present: string;
    section: (id: SectionId) => string;
};
