import type { Data, Entry, SectionId } from './types.js';
export declare function entry(id: SectionId, item: Data, locale: string, present: string): Entry;
export declare const hasContent: (item: Entry) => boolean;
