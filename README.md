# Precept France

Site et boutique en ligne de [Precept France](https://www.preceptfrance.fr) — études bibliques inductives.
Catalogue de 42 titres, panier et paiement Stripe.

> **Connaître Dieu profondément. Vivre autrement.**

---

## Sommaire

- [Pile technique](#pile-technique)
- [Structure du dépôt](#structure-du-dépôt)
- [Démarrage local](#démarrage-local)
- [Variables d'environnement](#variables-denvironnement)
- [Scripts](#scripts)
- [Base de données](#base-de-données)
- [Rendu et performance](#rendu-et-performance)
- [Déploiement](#déploiement)
- [Conventions](#conventions)

---

## Pile technique

| | |
|---|---|
| Framework | Next.js 14 (App Router) |
| Langage | TypeScript |
| Styles | Tailwind CSS, composants shadcn/ui + Radix |
| Base de données | PostgreSQL (Neon en production) via Prisma 6 |
| Paiement | Stripe Checkout |
| Hébergement | Vercel |

## Structure du dépôt

L'application vit dans `nextjs_space/`. La racine ne contient que de la documentation
et du matériel de référence (brochures PDF, maquettes) qui n'est pas déployé.

```
nextjs_space/
├── app/
│   ├── page.tsx              Accueil
│   ├── layout.tsx            Layout racine, métadonnées globales
│   ├── boutique/             Catalogue et fiches produits
│   ├── etude/                « Trouvez une étude »
│   ├── cgv/ confidentialite/ mentions-legales/
│   ├── sitemap.ts robots.ts  Générés depuis l'origine canonique
│   ├── api/
│   │   ├── products/         Catalogue groupé par série
│   │   ├── checkout/         Création de la session Stripe
│   │   ├── webhook/          Confirmation de paiement Stripe
│   │   └── contact/          Formulaire de contact
│   └── components/           Composants propres aux pages
├── components/ui/            Primitives shadcn/ui
├── lib/
│   ├── prisma.ts             Client Prisma paresseux
│   ├── products.ts           Catalogue groupé — partagé page + API
│   ├── site.ts               Origine canonique, indexabilité
│   ├── cart-context.tsx      État du panier
│   ├── stripe.ts  legal.ts  types.ts
├── prisma/
│   ├── schema.prisma         Product, Order, OrderItem, ContactSubmission
│   └── migrations/
├── scripts/seed-books.ts     Peuple le catalogue depuis data/books.json
├── data/books.json           Les 42 titres
├── public/images/books/      84 couvertures (recto + verso)
└── docs/CHANGES.md           Journal de développement
```

## Démarrage local

Prérequis : Node 18+, Yarn 4 (`corepack enable`) et un PostgreSQL local.

```bash
cd nextjs_space
yarn install

# Base locale : crée le schéma puis charge les 42 livres
yarn db:local
yarn db:seed

yarn dev          # http://localhost:3000
```

Les scripts `db:*` surchargent `DATABASE_URL` en ligne pour viser
`postgresql://postgres:password@localhost:5432/precept_france`. Ils ne touchent
jamais la base de production.

> [!WARNING]
> `nextjs_space/.env` pointe sur la base **de production**. Pour développer contre
> la base locale, créez un `.env.local` — il est prioritaire et déjà ignoré par git.

## Variables d'environnement

| Variable | Requise | Rôle |
|---|---|---|
| `DATABASE_URL` | oui | PostgreSQL. Sur Neon, l'hôte **pooler**. |
| `DATABASE_URL_UNPOOLED` | oui | Hôte **direct**, exigé par Prisma Migrate. |
| `NEXT_PUBLIC_BASE_URL` | oui en prod | Origine canonique. Sert aux URL de redirection Stripe, aux balises canoniques, au sitemap et à robots.txt. |
| `STRIPE_SECRET_KEY` | pour payer | Clé secrète Stripe. |
| `STRIPE_WEBHOOK_SECRET` | pour payer | Signature du webhook `/api/webhook`. |
| `VERCEL_ENV` | auto | Fourni par Vercel. Seul `production` autorise l'indexation. |

`NEXT_PUBLIC_BASE_URL` n'est pas optionnelle en production : `/api/checkout` refuse
de construire ses URL de redirection à partir des en-têtes de la requête, et renvoie
une erreur 500 plutôt que de faire confiance à `Host`.

## Scripts

| | |
|---|---|
| `yarn dev` | Serveur de développement |
| `yarn build` | `prisma generate` → `prisma migrate deploy` → `next build` |
| `yarn start` | Serveur de production |
| `yarn lint` | ESLint — **le build échoue sur une erreur de lint** |
| `yarn db:local` | Applique le schéma à la base locale |
| `yarn db:seed` | Charge les 42 livres dans la base locale |
| `yarn db:studio` | Prisma Studio sur la base locale |

## Base de données

Quatre modèles : `Product` (le catalogue), `Order` et `OrderItem` (les commandes,
écrites par le webhook Stripe), `ContactSubmission` (le formulaire de contact).

Les migrations sont dans `prisma/migrations/`. `yarn build` lance
`prisma migrate deploy`, donc une base joignable est un prérequis du build.

Pour peupler une base distante, surchargez l'URL plutôt que d'utiliser `db:seed` :

```bash
DATABASE_URL="<url>" npx tsx scripts/seed-books.ts
```

`seed-books.ts` fait des `upsert` sur un identifiant dérivé du nom de fichier de la
couverture — il est donc rejouable sans créer de doublons.

## Rendu et performance

La plupart des pages sont prérendues statiquement. Une seule règle à retenir :

> **Aucune page ne doit appeler d'API dynamique** (`headers()`, `cookies()`).
> Une seule suffit à sortir tout le site du rendu statique.

C'est pourquoi l'origine canonique se lit dans `lib/site.ts`, depuis
l'environnement, et jamais depuis les en-têtes de la requête.

| Route | Rendu |
|---|---|
| `/`, `/etude`, `/cgv`, `/confidentialite`, `/mentions-legales` | statique |
| `/boutique` | statique, revalidée toutes les heures (ISR) |
| `/boutique/[id]` | à la demande |
| `/api/*` | à la demande |

Les images passent toutes par `next/image` — aucune balise `<img>` brute — et Vercel
les sert redimensionnées en AVIF ou WebP. Une couverture de 56 Ko est livrée en
environ 6 Ko dans une vignette de catalogue.

## Déploiement

Vercel, projet `contactpreceptfrance-hub-precept_web` (équipe `precept-projects`),
déploiement automatique depuis `main`.

Deux choses à savoir avant de toucher aux dépendances ou aux previews :

- **Vercel construit ce projet avec Yarn 1**, qui ignore le lockfile Yarn 4. Les
  versions doivent donc rester **figées à l'exact** dans `package.json` — pas de
  `^` ni de `~` — sinon une dépendance peut dériver entre deux builds.
- **Les déploiements de prévisualisation sont protégés par le SSO Vercel.** Un
  `curl` ordinaire y reçoit la page de connexion Vercel avec un code 200 : cela ne
  prouve rien. Utilisez `vercel curl <url>`, qui s'authentifie.

## Conventions

- Le lint tourne au build. Une erreur ESLint fait échouer le déploiement.
- Les versions de dépendances sont figées à l'exact (voir ci-dessus).
- Le journal de développement est dans [`nextjs_space/docs/CHANGES.md`](nextjs_space/docs/CHANGES.md).
