# @repo/api

The jsonresume.org HTTP API, defined once with Effect `HttpApi`: groups,
endpoints and their schemas. No server code, so clients can import it.
The server implements it (see `apps/app/server`) and mounts it at `/api`.
