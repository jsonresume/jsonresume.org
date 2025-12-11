// Utility: applyResumeChanges
// Deep-merge resume changes, supporting `_delete: true` to remove items from arrays.
// This can be reused anywhere we need to merge partial resume updates into an existing
// JSON-Resume-format object.

import cloneDeep from 'lodash/cloneDeep';

/**
 * Apply a patch representing resume changes on top of a previous resume object.
 * The patch supports:
 *  - Deep merging of nested objects.
 *  - Smart array merging: match items by identifying keys (name+position for work, institution for education, etc.)
 *  - Adding new array items that don't match existing entries.
 *  - Removing array items by specifying `{ _delete: true }` for the position.
 *
 * @param {object} prev  The existing resume object.
 * @param {object} changes  The patch describing desired changes.
 * @returns {object} A NEW resume object with the changes applied.
 */
export default function applyResumeChanges(prev, changes) {
  const next = cloneDeep(prev);

  function getItemKey(item, arrayKey) {
    // Generate a unique key for array items based on their type
    if (!item || typeof item !== 'object') return null;

    switch (arrayKey) {
      case 'work':
        // Match work entries by company name + position
        return item.name && item.position
          ? `${item.name}::${item.position}`
          : null;
      case 'education':
        // Match education entries by institution + area
        return item.institution
          ? `${item.institution}::${item.area || ''}`
          : null;
      case 'skills':
        // Match skills by name
        return item.name || null;
      case 'profiles':
        // Match profiles by network
        return item.network || null;
      case 'languages':
        // Match languages by language name
        return item.language || null;
      case 'awards':
      case 'publications':
      case 'projects':
      case 'volunteer':
        // Match by title/name
        return item.title || item.name || null;
      default:
        // For unknown arrays, try common keys
        return item.name || item.title || item.id || null;
    }
  }

  function recurse(target, patch, parentKey = '') {
    for (const key of Object.keys(patch)) {
      const patchVal = patch[key];

      // Handle array patches with smart merging
      if (Array.isArray(patchVal)) {
        if (!Array.isArray(target[key])) target[key] = [];

        // Build a map of existing items by their keys
        const existingMap = new Map();
        target[key].forEach((item, idx) => {
          const itemKey = getItemKey(item, key);
          if (itemKey) {
            existingMap.set(itemKey, idx);
          }
        });

        // Track items to delete (by index)
        const toDelete = new Set();

        patchVal.forEach((item) => {
          if (!item || typeof item !== 'object') {
            // Primitive array item - just push
            target[key].push(item);
            return;
          }

          // Deletion marker
          if (item._delete) {
            const itemKey = getItemKey(item, key);
            if (itemKey && existingMap.has(itemKey)) {
              toDelete.add(existingMap.get(itemKey));
            }
            return;
          }

          // Try to find a matching existing item
          const itemKey = getItemKey(item, key);
          if (itemKey && existingMap.has(itemKey)) {
            // Merge with existing item
            const existingIdx = existingMap.get(itemKey);
            recurse(target[key][existingIdx], item, key);
          } else {
            // No match found - this is a new item, add it
            // Remove _delete field if present and false
            const cleanItem = { ...item };
            if ('_delete' in cleanItem && !cleanItem._delete) {
              delete cleanItem._delete;
            }
            target[key].push(cleanItem);
          }
        });

        // Remove items marked for deletion (in reverse order to preserve indices)
        const sortedToDelete = Array.from(toDelete).sort((a, b) => b - a);
        for (const idx of sortedToDelete) {
          target[key].splice(idx, 1);
        }
      } else if (patchVal && typeof patchVal === 'object') {
        // Handle object patches
        if (!target[key] || typeof target[key] !== 'object') {
          target[key] = cloneDeep(patchVal);
        } else {
          recurse(target[key], patchVal, key);
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
