A bunch of scripts to facilitate scraping, storing and creating vectors for jobs lives here.

### Hacker News - Who Is Hiring

1. Search API for latest Who is Hiring post
2. Get all top level comments (postings) from post
3. Store all job postings in database
   - make sure not to store duplicates
4. Generate more fluffy postings using GPT-4 JD template
   - try really hard to avoid hallucinations
5. Generate embeddings for job posts and store in pinecone
6. Set up a cronjob on vercel to run this every 14 days
   - try to sync with the day of month hn creates the thread
