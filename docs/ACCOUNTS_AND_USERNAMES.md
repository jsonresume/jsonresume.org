# Accounts and usernames

How `jsonresume.org/@username` decides whose resume to show. Agreed
2026-10-23; items marked _default_ were not discussed and can be revisited.

Built (2026-10-23): ghosts, email and GitHub sign-up and sign-in, the
reservations, verification (7-day holds), GitHub linking with ghost merges,
and gist or uploaded resumes. Not built yet: renames (and their 90-day
redirects), account deletion, and the registry.jsonresume.org redirects.

## Kinds of profile

- **Account**: someone who signed up, with email and password or with GitHub,
  and holds a username. May have a GitHub account linked.
- **Ghost**: a profile with no owner, created the first time `/@foo` is
  requested and GitHub user `foo` has a `resume.json` gist. It mirrors that
  gist and nothing else.

## Resolving `/@foo`

1. `foo` is a retired name (from a rename): 301 to the current name.
2. An account holds `foo`: show its resume, but only once its email is
   verified and it has a resume; otherwise 404.
3. Otherwise, GitHub user `foo` has a resume gist: create or refresh the ghost
   and show it.
4. Otherwise: 404.

`/@Foo` 301s to `/@foo` (_default_: names are case-insensitive, stored
lowercase).

## Usernames

- Follow GitHub's rules: letters, digits and single hyphens, up to 39
  characters. Some names are reserved (`admin`, `api`, `jsonresume`, …)
  (_default_).
- **Signing up** can't take a name that belongs to a GitHub login with a
  resume gist. Signup checks GitHub live, so the name is protected even if
  nobody has visited `/@foo` yet. If GitHub is down, signup is refused and
  can be retried (_default_: fail closed). A GitHub login with no resume gist
  doesn't protect its name.
- **Held at signup, public once verified.** The name is locked at signup, and
  `/@foo` stays a 404 until the email is verified and a resume is saved.
  Unverified holds expire after 7 days.
- **Renames** are allowed. The old name 301s to the new one and stays retired
  for 90 days, then is free.
- **Deleting** an account frees the name immediately. If GitHub `foo` has a
  resume gist, `/@foo` becomes a ghost again.

## GitHub

- **Sign in with GitHub** is a login option alongside email and password. The
  first GitHub sign-in creates an account:
  - It claims the ghost if there is one; otherwise it takes the GitHub login
    as the username if that is free.
  - If an email account already holds the login (it took the name before the
    gist existed), the person picks another free name. Their gist is served
    there. The email account keeps `/@foo`.
- **Linking** GitHub `bar` to account `foo` proves ownership. If `bar` was a
  ghost, it merges into the account: `/@bar` 301s to `/@foo` and `bar` stays
  reserved for them.
- A GitHub account links to one account at most (_default_).
- Links are by GitHub's numeric user ID, not the login (_default_):
  - A renamed GitHub login keeps its account and gist sync.
  - A GitHub login that is later reused by someone else can't take over.
  - An unclaimed ghost is only a mirror: when the login moves or is reused,
    the ghost follows whoever holds the login on GitHub.

## Where the resume comes from

- Ghosts, and claimed accounts that haven't edited here: the gist, fetched
  live with a short cache. A deleted gist or GitHub user means 404, and the
  ghost and its name protection go away.
- Once the owner saves an edit on jsonresume.org, the stored copy is used. They
  can switch back to gist sync.
- Email-only accounts: the stored copy.
- `?gistname=other.json` keeps working for gist-backed profiles.

## Search engines and old URLs

- Every public profile is indexable, ghosts included.
- `registry.jsonresume.org/foo` 301s to `jsonresume.org/@foo`, keeping the
  extension and query (`/foo.json?theme=x` goes to `/@foo.json?theme=x`).
