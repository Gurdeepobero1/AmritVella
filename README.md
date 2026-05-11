# AmritVella

Production-grade Sikh discipline, healing, career, and self-mastery tracker built with Next.js, TypeScript, Tailwind CSS, PostgreSQL, and Prisma.

The app is designed as a full-history system, not a same-day habit checklist. It currently opens directly into the app with one automatic owner account, while every log is still stored with `userId` so the schema can support multi-user auth later.

## Core Modules

- Dashboard with score, Nitnem progress, Simran minutes, career hours, emotional status, fitness, seva, streaks, averages, weakest area, and corrective action.
- Daily Sikh routine tracker with Beginner, Intermediate, and Full modes plus a visible all-path Nitnem board.
- Gurbani / Path Library with nullable verified content fields. No Gurbani text is invented.
- Simran counter with timer, mala/custom count, silent mode, vibration, and reflection.
- Emotional trigger tracker and emergency mode.
- Career execution, CAD/CAM skill practice, outreach, and revenue logs.
- Fitness, Five Thieves, and Seva tracker.
- Weekly and monthly reviews.
- Analytics charts with history filters.
- JSON export/import, monthly markdown report, and local-cache reset.
- PWA manifest and service worker.
- `DESIGN.md` with the Mistral-inspired editorial typography, orange/cream palette, sober 8/12px geometry, sunset stripe, and mobile-first UI rules.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

3. Set these variables:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/amritvella?schema=public"
```

4. Generate Prisma client and run migrations:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Seed placeholder library content and the direct-access owner:

```bash
npm run prisma:seed
```

6. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Gurbani Content Policy

The seed script creates placeholder rows for paths and healing categories only. `gurmukhiText`, `transliteration`, `englishMeaning`, and `verifiedSourceUrl` are nullable by design. Add text only from verified sources.

## Database

The Prisma schema includes persistent tables for:

- `User`
- `DailyLog`
- `PathCompletion`
- `SimranSession`
- `CareerTask`
- `FitnessLog`
- `EmotionalTrigger`
- `EmergencyModeUsage`
- `SevaAction`
- `FiveThievesRating`
- `WeeklyReview`
- `MonthlyReview`
- `JournalEntry`
- `RevenueLog`
- `OutreachLog`
- `SkillPracticeLog`
- `GurbaniContent`
- `PlaylistLink`
- `AppSetting`

Initial migration: `prisma/migrations/20260510170000_init/migration.sql`.
