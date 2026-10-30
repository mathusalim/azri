# ერთი თემა — Trending Questions (Georgian)

A Georgian-language trending questions and discussion platform inspired by OneTopic.

## Tech Stack

- **Framework:** TanStack Start (React, SSR, file-based routing)
- **UI:** Radix UI primitives + Tailwind CSS
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** Better Auth (email + Google OAuth)
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 1. Install dependencies

```bash
cd onetopic-ge
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your `DATABASE_URL` and `BETTER_AUTH_SECRET`.

### 3. Set up the database

```bash
# Push schema to database
npm run db:push

# Seed with sample data
npm run db:seed
```

### 4. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── routes/           # File-based routing (TanStack Start)
│   ├── __root.tsx    # Root layout with nav
│   ├── index.tsx     # Trending feed (home)
│   ├── question.$questionId.tsx  # Question detail + vote + discussion
│   ├── category.$slug.tsx       # Browse by category
│   ├── archive.tsx   # Past questions
│   ├── search.tsx    # Search
│   ├── login.tsx     # Login
│   ├── register.tsx  # Registration
│   ├── profile.tsx   # User profile
│   └── api/
│       └── auth.$.ts # Better Auth catch-all
├── components/       # Reusable UI components
├── lib/
│   ├── schema.ts     # Drizzle schema definitions
│   ├── db.ts         # Database client
│   ├── auth.ts       # Better Auth server config
│   ├── auth-client.ts # Better Auth React client
│   └── queries.ts    # Database query functions
├── styles/
│   └── app.css       # Tailwind + theme tokens
└── utils/
    └── seo.ts        # SEO meta tag helper
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run db:push` | Push schema to database |
| `npm run db:generate` | Generate migration files |
| `npm run db:migrate` | Run migrations |
| `npm run db:studio` | Open Drizzle Studio |
| `npm run db:seed` | Seed sample data |