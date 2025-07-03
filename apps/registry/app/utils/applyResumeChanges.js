// Utility: applyResumeChanges
// Deep-merge resume changes, supporting `_delete: true` to remove items from arrays.
// This can be reused anywhere we need to merge partial resume updates into an existing
// JSON-Resume-format object.

import cloneDeep from 'lodash/cloneDeep';

/**
 * Apply a patch representing resume changes on top of a previous resume object.
 * The patch supports:
 *  - Deep merging of nested objects.
 *  - Replacing primitives and arrays by index.
 *  - Removing array items by specifying `{ _delete: true }` for the position.
 *
 * @param {object} prev  The existing resume object.
 * @param {object} changes  The patch describing desired changes.
 * @returns {object} A NEW resume object with the changes applied.
 */
export default function applyResumeChanges(prev, changes) {
  const next = cloneDeep(prev);

  function recurse(target, patch) {
    for (const key of Object.keys(patch)) {
      const patchVal = patch[key];

      // Handle array patches
      if (Array.isArray(patchVal)) {
        if (!Array.isArray(target[key])) target[key] = [];

        patchVal.forEach((item, idx) => {
          // Deletion marker
          if (item && typeof item === 'object' && item._delete) {
            target[key] = target[key].filter((_, i) => i !== idx);
            return;
          }

          // Try to merge with an existing matching object (e.g. work entry)
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            const matchIdx = target[key].findIndex(
              (t) =>
                t &&
                typeof t === 'object' &&
                t.name === item.name &&
                t.position === item.position,
            );
            if (matchIdx !== -1) {
              recurse(target[key][matchIdx], item);
              return;
            }
          }

          // Merge/replace by array index
          if (target[key][idx] !== undefined) {
            if (
              typeof item === 'object' &&
              typeof target[key][idx] === 'object'
            ) {
              recurse(target[key][idx], item);
            } else {
              // Primitive or different types – replace
              target[key][idx] = item;
            }
          } else {
            // Append new entry
            target[key].push(item);
          }
        });
      } else if (patchVal && typeof patchVal === 'object') {
        // Handle object patches
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = cloneDeep(patchVal);
        } else {
          recurse(target[key], patchVal);
        }
      } else {
        // Primitive replacement
        target[key] = patchVal;
      }
    }
  }

  recurse(next, changes);
  return next;
}
