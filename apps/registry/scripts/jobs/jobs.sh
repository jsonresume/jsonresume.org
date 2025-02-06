# Fetch job listings from Hacker News "Who is Hiring?" thread and store in database
node hackernews.js

# Process job listings through GPT to standardize format and extract structured data
node gpted.js

# Generate embeddings for job listings to enable semantic search functionality
node vectorize.js