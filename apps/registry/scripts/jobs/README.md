- Scripts live in apps/registry/scripts/jobs
- needs openai and supabase env tokens

1. Find latest Who is Hiring Post
  - currently not implemented
  - should run on every 12/X hours
  - needs to get the thread id
  - thread id gets passed as artefact to next job

2. Needs to run hackernews.js
  - Looks up thread id via hackernews api
  - Finds all top level comments via hn algolia
  - Stores comment/thread id/content as artefact and passes to next job

3a.  Store hackernews thread ids as "jobs" (from artefactr)
  - Save them to supabase 
  - Static/Source-To-Truth: Publish to something gh-pages (published reference passed as artefact)
  - put it on ipfs you cunt

3b. Convert hacker news job comments into job schemas(gpted.js)
  - Loops over artefacts from 2.
  - Passes them in a prompt to openai, gets back a converted job in the schema
  - prompt contains (original job comment, company dossier, instructions, example job schema)
  - Should be parallelized

3b.1 Store converted jobs in supabase
  - Static/Source-To-Truth: Publish to something gh-pages (published reference passed as artefact)
  - Store in supabase 


3b->4. Create embeddings for the "jobs.gpt_content" column using openai
  - stores it in a vector column called "jobs.embedding_v5"
  - Should be parallelized 


## notes
 - when converting hn comments to gpt-content, should save outputs as an artefact
 - create another job that then takes artefacts and stores them in supabase 
    - 





## todo 
4. Create company dossiers out of all new "jobs" (companyData.js)
 - this step is currently disabled and could exist in better places
 - uses perplexity to do a search for company and its recent news, stores in db
 - can be parallelized (also can ignore this step for now)
 - need a runner to emulate what github workflows does or something