---
'jsonresume-theme-coastal-creative': patch
'jsonresume-theme-community-garden': patch
'jsonresume-theme-investor-brief': patch
'jsonresume-theme-minimalist-grid': patch
'jsonresume-theme-product-manager-canvas': patch
---

Fix contact info not rendering: ContactInfo was called with unsupported per-field props (`type`/children) and returned null; now uses the supported `basics` prop.
