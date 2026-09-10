# Precept France — Dev Notes & Change Log

## Status
- **Branch:** `main` (merged from `feature/ecommerce` on 2026-04-17)
- **Deploy target:** Vercel (pulls from GitHub `contactpreceptfrance-hub/precept_web`)
- **Local test:** `cd nextjs_space && yarn dev` → http://localhost:3000

---

## Environment Variables

Production DB: Neon project `precept-france` (`sparkling-scene-89259699`, eu-central-1),
migrated and seeded on 2026-08-25. `prisma migrate deploy` runs in the Vercel build and
needs `DATABASE_URL_UNPOOLED` — without it the build fails before `next build`.

### Required (add to `.env` locally and Vercel dashboard)
```
DATABASE_URL=postgresql://...        # Neon POOLED url (host contains "-pooler") — app traffic
DATABASE_URL_UNPOOLED=postgresql://... # Neon DIRECT url (no "-pooler") — Prisma Migrate only
STRIPE_SECRET_KEY=sk_live_...        # Available Saturday
STRIPE_WEBHOOK_SECRET=whsec_...      # From Stripe dashboard > Webhooks
NEXT_PUBLIC_BASE_URL=https://...     # Your Vercel production URL
```

See `.env.example` for the full template.

---

## What Was Merged (2026-04-17)

### From `feature/ecommerce` branch
All e-commerce work previously developed and pushed to GitHub but not yet on `main`.

| Area | Files | Notes |
|---|---|---|
| **Shop page** | `app/boutique/page.tsx` | Netflix-style catalog, dark navy, series rows |
| **Book detail** | `app/boutique/[id]/page.tsx` | Full detail page with OG metadata |
| **Stripe redirects** | `app/boutique/succes/page.tsx`, `annule/page.tsx` | Post-payment pages |
| **Shop components** | `app/components/shop/` | BookCard, CartDrawer, SeriesRows, SharePopover, ShopHero |
| **Cart state** | `lib/cart-context.tsx` | React Context + localStorage |
| **Stripe** | `lib/stripe.ts`, `app/api/checkout/route.ts`, `app/api/webhook/route.ts` | Real Stripe integration — needs `STRIPE_SECRET_KEY` |
| **Database** | `prisma/schema.prisma` | Added `series` field, `Order`, `OrderItem` models |
| **Migrations** | `prisma/migrations/20260416000000_add_series_orders/` | Run `yarn prisma migrate deploy` on DB |
| **Book data** | `data/books.json` | 26 Precept France books with series grouping |
| **Seed script** | `scripts/seed-books.ts` | `yarn db:seed` to populate DB |
| **Header** | `app/components/header.tsx` | Dark navy `#0c1f3f`, white logo, gold "FRANCE" |

### Fixes Applied During Merge
- Regenerated Prisma client (`yarn prisma generate`) after schema update
- Installed `stripe` npm package (was missing from `node_modules`)
- Updated Stripe API version `2025-01-27.acacia` → `2026-03-25.dahlia` (breaking change in new package)

---

## Before Deploying to Vercel

### Saturday checklist (when Stripe keys are ready)
- [ ] Add `STRIPE_SECRET_KEY` to `.env` and Vercel env vars
- [ ] Add `STRIPE_WEBHOOK_SECRET` to `.env` and Vercel env vars
- [ ] Set `NEXT_PUBLIC_BASE_URL` to production URL in Vercel
- [ ] Run `yarn prisma migrate deploy` against production DB
- [ ] Run `yarn db:seed` to populate books (or use `yarn prisma studio`)
- [ ] Configure Stripe webhook endpoint: `https://<your-domain>/api/webhook`
- [ ] Test a full purchase flow in Stripe test mode first

### DB commands (local)
```bash
yarn db:local    # Start local Postgres via Docker (if configured)
yarn db:seed     # Seed 26 books into DB
yarn db:studio   # Open Prisma Studio to inspect data
```

### Deploy commands
```bash
yarn build       # Runs prisma generate + next build
vercel --prod    # Manual deploy (or push to main for auto-deploy)
```

---

## Known Issues / Pending
- [ ] Book cover images: cards currently show gradient placeholders — real images to be added in `public/images/books/`
- [ ] Stripe not active until keys are added Saturday
- [ ] DB unreachable locally if Docker not running — API falls back to empty array (boutique shows empty)
- [x] `scripts/seed.ts` / `scripts/safe-seed.ts` removed; `seed-books.ts` is the only seed and
      is now what the `prisma.seed` key points at

---

## Architecture Notes

```
nextjs_space/
├── app/
│   ├── page.tsx              # Landing page (main site)
│   ├── components/
│   │   ├── header.tsx        # Dark navy, shared across pages
│   │   ├── hero.tsx
│   │   ├── mission-section.tsx
│   │   ├── youtube-section.tsx
│   │   ├── contact-section.tsx
│   │   └── shop/             # Boutique UI components
│   └── boutique/             # /boutique route
│       ├── page.tsx          # Shop catalog (Netflix-style)
│       ├── [id]/page.tsx     # Book detail
│       ├── succes/page.tsx   # Stripe success redirect
│       └── annule/page.tsx   # Stripe cancel redirect
├── lib/
│   ├── cart-context.tsx      # Cart state (React Context)
│   ├── stripe.ts             # Stripe singleton
│   └── prisma.ts             # Prisma singleton
├── data/
│   └── books.json            # 26 books — source of truth until DB is seeded
├── prisma/
│   ├── schema.prisma         # Product, Order, OrderItem, ContactSubmission
│   └── migrations/           # Run on deploy
└── scripts/
    └── seed-books.ts         # Populate DB from books.json
```
