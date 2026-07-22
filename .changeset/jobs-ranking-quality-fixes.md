---
'@jsonresume/jobs': patch
---

Match quality overhaul (client side): the CLI table and TUI list now display the score the server actually sorts by (decay/rerank blend) instead of raw similarity, the TUI runs its background AI rerank pass on every view (previously only custom searches), and `search` gains a `--fast` flag to skip reranking. Pairs with the registry-side ranking fixes: 300-candidate retrieval pool, 0.95/0.05 recency decay, deep (150-job) location-aware listwise reranking on by default, real min-salary filtering backed by normalized salary data, word-boundary keyword search, prompt-first HyDE for custom searches, and rate-limited resume-body matching.
