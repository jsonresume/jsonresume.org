---
'@jsonresume/jobs': minor
---

Tier-based match experience: the TUI now groups jobs into Strong/Good/Stretch bands with colored tier chips (raw cosine numbers retired from the list), shows a grounded "Why: …" line per match in the detail pane, a "N jobs · X strong · Z new since last visit" digest header, and honest empty states that name the filters that eliminated everything. Server-side (registry): hybrid vector+full-text retrieval fused with RRF, listwise tiers + grounded reasons from the reranker, and Rocchio relevance feedback so interested/applied marks pull the ranking toward what you actually like.
