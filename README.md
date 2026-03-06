# Campus Nest

> A platform for college students — find PG accommodations and share rides.

**Auth:** Custom auth (bcrypt + JWT). Only **college emails** allowed (e.g. `btech25043.24@bitmesra.ac.in`). Domain set via `ALLOWED_EMAIL_DOMAIN` in `.env`.

## Database setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` (e.g. [Neon](https://neon.tech)).
2. Run `npm run db:migrate` (creates tables). If the schema has a `password` field on `User`, run migrate again if needed (e.g. name: `add-password`).
3. Generate client: `npm run db:generate`.

## Project structure

campus_nest/
│
├── app/
│   ├── layout.tsx
│   ├── page.tsx                → Landing page
│
│   ├── dashboard/
│   │   ├── page.tsx            → Dashboard home
│   │   ├── add-pg/
│   │   │   └── page.tsx
│   │   ├── add-ride/
│   │   │   └── page.tsx
│   │
│   ├── pg/
│   │   ├── page.tsx            → All PG listings
│   │   └── [id]/
│   │       └── page.tsx        → Single PG page
│   │
│   ├── rides/
│   │   └── page.tsx            → Ride listing page
│   │
│   ├── profile/
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   │
│   │   ├── pg/
│   │   │   ├── route.ts        → GET, POST PG
│   │   │   └── [id]/
│   │   │       └── route.ts    → GET single PG
│   │   │
│   │   ├── rides/
│   │   │   ├── route.ts        → GET, POST rides
│   │   │   └── book/
│   │   │       └── route.ts    → POST book ride
│   │   │
│   │   ├── reviews/
│   │   │   └── route.ts
│   │
│   └── globals.css
│
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │
│   ├── pg/
│   │   ├── PGCard.tsx
│   │   ├── PGFilter.tsx
│   │
│   ├── rides/
│   │   ├── RideCard.tsx
│   │
│   └── common/
│       ├── Loader.tsx
│       ├── EmptyState.tsx
│
├── lib/
│   ├── prisma.ts
│   ├── auth.ts
│   ├── utils.ts
│
├── prisma/
│   └── schema.prisma
│
├── middleware.ts
├── .env.example
├── package.json

## Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel.
2. Set the following environment variables in Vercel project settings:
   - `DATABASE_URL`: Your PostgreSQL database URL (e.g., from Neon)
   - `JWT_SECRET`: A secure random string for JWT signing
   - `ALLOWED_EMAIL_DOMAIN`: College email domain (e.g., `bitmesra.ac.in`)
3. Deploy the application.

The database should be set up with the same PostgreSQL instance used in development (e.g., Neon).