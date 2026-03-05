# Team Lead Guide (Member 1)

You are the **Project Setup & Database Architect** and **team leader**. Use this as your checklist.

**Auth:** We use **custom auth** (bcrypt + JWT), not NextAuth. Only **college emails** are allowed (e.g. `btech25043.24@bitmesra.ac.in`). The allowed domain is set in env as `ALLOWED_EMAIL_DOMAIN=bitmesra.ac.in`.

---

## Part 1: Get a database URL

### Neon (recommended)

1. Go to **https://neon.tech** → Sign up → **Create a project**.
2. Copy the **connection string** (e.g. `postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require`).
3. Create **`.env`** in the project root:
   ```env
   DATABASE_URL="paste-your-connection-string-here"
   ```
4. Run: **`npm run db:migrate`** and use the name `init` when asked.

If the schema was updated with a `password` field on `User`, run **`npm run db:migrate`** again (e.g. name: `add-password`) so the table has the new column.

---

## Part 2: Create your first PR (setup + database)

1. Branch: `git checkout -b member-1-setup-database`
2. Commit: `git add -A && git commit -m "Member 1: Project setup, Prisma schema, base app structure"`
3. Push: `git push -u origin member-1-setup-database`
4. Open a PR; **description**: copy everything from **`PR_DESCRIPTION.md`**.
5. Merge this PR first (base for the team).

---

## Part 3: Your UI/UX work (second PR)

After the setup PR is merged (or in parallel on a separate branch):

1. Pull latest `main`.
2. Branch: `git checkout -b member-1-ui-ux`
3. Open **`PROMPTS_FOR_TEAM.md`** and copy the **"Prompt for Member 1 (UI/UX)"** section (the whole block inside the triple backticks).
4. Paste it into a **new Cursor chat** in the project and let the AI implement the UI/UX.
5. Run `npm run build`, fix any errors, then commit, push, and open a PR.

---

## Part 4: What to share with other members

Share these with the team:

| What | Details |
|------|--------|
| **1. Repo + rule** | Link to the repo. Tell them: after Member 1’s setup PR is merged, **pull latest `main`** and create their branch from `main`. |
| **2. Database URL** | Either share one Neon `DATABASE_URL` in a private channel, or ask everyone to create their own Neon project and use their own URL in `.env`. |
| **3. Documents** | Document 1 (Project Execution Guide) and Document 2 (Permanent API Contract). |
| **4. Cursor prompts** | From **`PROMPTS_FOR_TEAM.md`**: send **Member 2** only “Prompt for Member 2”, **Member 3** only “Prompt for Member 3”, etc. |
| **5. Auth** | Tell them we use **custom auth** (bcrypt + JWT). College email only; format like `btech25043.24@bitmesra.ac.in`. Allowed domain: `ALLOWED_EMAIL_DOMAIN=bitmesra.ac.in` in `.env`. No NextAuth/Google. |

**Merge order:** 1 (setup) → 1 (UI/UX) or 2 → 2 (auth) → 3 (PG) → 4 (rides) → 5 (reviews + deploy). Your UI/UX PR can be merged after 2 so the app already has login/signup when you polish the nav.

---

## Env vars for deployment (Vercel)

When Member 5 deploys, they will need:

- `DATABASE_URL` – PostgreSQL (e.g. Neon)
- `JWT_SECRET` – same as local (e.g. `openssl rand -base64 32`)
- `ALLOWED_EMAIL_DOMAIN` – e.g. `bitmesra.ac.in`

No NextAuth or Google env vars.

---

## Quick reference

| Task | Action |
|------|--------|
| Get DB URL | neon.tech → Create project → copy connection string |
| Local .env | `DATABASE_URL="..."`, then `JWT_SECRET` and `ALLOWED_EMAIL_DOMAIN=bitmesra.ac.in` when Member 2 is done |
| Create tables | `npm run db:migrate` (names: `init`, then `add-password` if schema has password) |
| Your setup PR | Branch → commit → push → paste `PR_DESCRIPTION.md` into PR |
| Your UI/UX | Use “Prompt for Member 1 (UI/UX)” from `PROMPTS_FOR_TEAM.md` in Cursor → then branch, commit, push, PR |
| Share with team | Repo link, merge order, Document 1 & 2, each member’s prompt, and note: custom auth, college email only |
