# JSON Resume for ChatGPT (plugin package)

The package submitted to OpenAI to list JSON Resume in the ChatGPT app
directory: `plugin.json` (listing, review cases, release notes),
`mcp.json` (the MCP server at https://jsonresume.org/mcp, OAuth with
dynamic client registration) and `assets/` (icons from the site's logo).

## Submitting

1. **Verify the organization** in the OpenAI Platform (Settings → General):
   individual or business verification, as the publisher "JSON Resume". You
   need to be an owner, or have Apps Management Write.
2. **Record the demo**: in ChatGPT with Developer mode on, add a connector
   for `https://jsonresume.org/mcp` (OAuth), sign in as the review account,
   and run the five positive test cases in `plugin.json`. Upload the video
   somewhere viewable without signing in, and put its URL in
   `review.demo_recording_url`.
3. **Zip this folder** (plugin.json at the root of the zip):
   `cd packages/mcp/openai-plugin && python3 -m zipfile -c ../jsonresume-chatgpt.zip plugin.json mcp.json assets`
4. **Upload**: OpenAI Platform → Plugins → Upload new plugin, choose the
   developer identity, upload the zip, and fix anything the automated checks
   report.
5. **Connect the MCP server**: under MCPs, choose Connect. For domain
   verification, put the challenge token on the server and restart:
   `OPENAI_APPS_CHALLENGE=<token>` in `/etc/jsonresume/app.env`, then
   `sudo systemctl restart jsonresume@app`. It is served at
   https://jsonresume.org/.well-known/openai-apps-challenge. Authorize as the
   review account and wait for the tool scan.
6. **Review details**: the review account is in `/etc/jsonresume/review.env`
   on the box (`sudo cat` it): sign-in URL https://jsonresume.org/signin,
   email and password, no MFA. It has a sample resume (Jane Developer) and a
   few marked jobs.
7. **Countries**: leave `publication.countries` out to offer it everywhere.
8. **Submit for review**, complete the attestations, and watch email for the
   decision. After approval, choose Publish.

Tool changes after publication are picked up by OpenAI's daily scan of the
server; listing changes need a new zip.
