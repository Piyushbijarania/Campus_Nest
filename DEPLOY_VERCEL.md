# Deploy Campus Nest on Vercel (Free)

Yes, you can deploy this app on **Vercel for free** and it will work for almost everything. Here's what works and what to watch, then the exact steps.

---

## What works on Vercel (free tier)

- **Next.js app** – Full support; Vercel is built for Next.js.
- **Database** – Your **Neon** Postgres works from Vercel. No change needed if `DATABASE_URL` is set.
- **Auth** – Login, signup, JWT, cookies work. Set `JWT_SECRET` in production.
- **All pages & APIs** – PGs, tiffin, rides, reviews, profile, dashboard, etc. work as long as the DB is connected.

---

## Image uploads (free with Vercel Blob)

The app uses **Vercel Blob** for image uploads in production. On the free Hobby plan you get Blob storage included; images are stored in your Blob store and URLs are saved in the database.

- **Locally:** If `BLOB_READ_WRITE_TOKEN` is not set, uploads are saved to `public/uploads` so you can develop without a Blob store.
- **On Vercel:** Create a Blob store (see step 3b below) and the token is added automatically. Uploads then go to Blob and work correctly.

Max file size is **4 MB** per image (to stay under Vercel’s serverless request body limit).

**Prepare your local project (optional, for Blob uploads in dev):**  
Run `vercel link` then `vercel env pull` in the project folder so your local `.env` gets the latest env vars (e.g. `BLOB_READ_WRITE_TOKEN` or your custom Blob token). Then uploads will use Vercel Blob locally too.

---

## Steps to deploy on Vercel (free)

### 1. Push your code to GitHub

If you haven't already:

```bash
git add .
git commit -m "Prepare for Vercel deploy"
git remote add origin https://github.com/YOUR_USERNAME/campus_nest.git   # if needed
git push -u origin main
```

Use your real repo URL and branch name (`main` or `master`).

---

### 2. Create a Vercel account and import the project

1. Go to **[vercel.com](https://vercel.com)** and sign up (e.g. with GitHub).
2. Click **"Add New…" → "Project"**.
3. **Import** your `campus_nest` repo from GitHub (authorize Vercel if asked).
4. Leave **Framework Preset** as **Next.js** (auto-detected).

---

### 3. Set environment variables

Before deploying, add these in the Vercel project:

**Project → Settings → Environment Variables**

| Name               | Value                    | Notes                                      |
|--------------------|--------------------------|--------------------------------------------|
| `DATABASE_URL`     | Your Neon connection URL | From Neon dashboard (e.g. `postgresql://...`) |
| `JWT_SECRET`       | A long random string     | Generate one, e.g. `openssl rand -base64 32` |

Optional:

| Name                    | Value           | Notes                          |
|-------------------------|-----------------|--------------------------------|
| `ALLOWED_EMAIL_DOMAIN`  | `bitmesra.ac.in`| Restrict signup to this domain |

- Add them for **Production** (and Preview if you want same behavior in previews).
- **Save** after adding each variable.

### 3b. Enable Vercel Blob (for image uploads)

1. In your Vercel project, go to the **Storage** tab.
2. Click **Create Database** → choose **Blob**.
3. Name the store (e.g. `campus-nest-uploads`), set access to **Public** (so PG/tiffin images are viewable), and create it.
4. Vercel automatically adds **`BLOB_READ_WRITE_TOKEN`** to your project. No need to copy it manually.
5. **Redeploy** the project once so the new env var is picked up (Deployments → … on latest → Redeploy).

To use uploads **locally**, pull env vars: `npx vercel env pull` (then add `BLOB_READ_WRITE_TOKEN` to `.env` if you want local Blob uploads; otherwise uploads go to `public/uploads`).

---

### 4. Build and deploy

- **Build Command:** leave default, or set to:

  ```bash
  prisma generate && next build
  ```

  (Your `package.json` already has `"build": "prisma generate && next build"`, so Vercel will use it.)

- **Output Directory:** leave default (Vercel uses Next.js output automatically).
- **Install Command:** `npm install` (default).

Click **Deploy**. Vercel will:

1. Clone the repo  
2. Run `npm install`  
3. Run `prisma generate && next build`  
4. Deploy the app  

Your site will be at `https://your-project-name.vercel.app` (or a custom domain if you add one).

---

### 5. After first deploy

- **Neon:** Ensure your Neon project allows connections from the internet (it does by default). If you use IP allowlists, add Vercel's IPs or allow all (Neon docs).
- **Cookies:** Auth uses cookies; they work on `*.vercel.app`. For a custom domain, keep using HTTPS (Vercel provides it).
- **Uploads:** After you create the Blob store and redeploy, PG and tiffin image uploads will work; images are stored in Vercel Blob and URLs are saved in the DB.

---

## Images not working on the deployed site?

If uploads fail or images don’t show on Vercel, do this:

1. **Create a Blob store** (if you haven’t):
   - Vercel project → **Storage** tab → **Create Database** → **Blob**.
   - Name the store, set access to **Public**, create it.
   - Vercel will add the token env var (e.g. `BLOB_READ_WRITE_TOKEN` or a custom name like `PYXIS_READ_WRITE_TOKEN`) to the project.

2. **Confirm the token is set:**
   - **Settings** → **Environment Variables**.
   - You should see a variable for the Blob store (name from step 1). It must be present for **Production** (and Preview if you use preview deployments).

3. **Redeploy** after adding or changing the token:
   - **Deployments** → … on the latest deployment → **Redeploy**.

4. **If the UI shows an upload error**, check the message: it may say *"Add BLOB_READ_WRITE_TOKEN in Vercel → Project → Settings → Environment Variables..."* — that means the token isn’t available at runtime; complete steps 1–3 above.

5. **Existing listings with broken images:** If you had images from local dev (e.g. `/uploads/...`), those paths don’t exist on Vercel. Re-upload images for those listings after Blob is set up, or add new listings; new uploads will get Blob URLs and work.

---

## Summary

| Item            | Free on Vercel? | Works? |
|-----------------|-----------------|--------|
| Next.js app     | Yes             | Yes    |
| Neon Postgres   | Yes (Neon free) | Yes    |
| Auth (JWT)      | Yes             | Yes (set `JWT_SECRET`) |
| PGs, tiffin, rides, reviews | Yes | Yes    |
| Image uploads   | Yes (Vercel Blob) | Yes – create Blob store, then redeploy |

You're good to deploy with the steps above; create the Blob store so image uploads work in production.
