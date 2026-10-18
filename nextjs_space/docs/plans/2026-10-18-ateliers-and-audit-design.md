# Design Document — Audit Fixes (Phase 1) & Ateliers Page (Phase 2)

**Date:** 2026-10-18  
**Project:** Precept France (`nextjs_space`)

---

## Overview

This design covers two phases:
1. **Phase 1 — Audit Fixes & Codebase Improvements:** Resolving inconsistencies found during the codebase audit (reusable `SharePopover` with canonical `SITE_URL`, single source of truth for sample/brochure PDFs, and local filesystem fallback for book cover uploads in development).
2. **Phase 2 — Dynamic `/ateliers` Page & `/admin/ateliers` Back-Office:** Adding a weekly virtual Zoom workshops page where visitors can join Zoom meetings for free, optionally buy the linked study book, download the free sample/workshop PDF (especially helpful for participants who cannot purchase the book), add the session to their calendar (Google Calendar / `.ics`), and share the workshop via social media or WhatsApp group invite.

---

## Phase 1: Audit Fixes & Codebase Cleanup

### 1.1 Unified & Reusable `SharePopover` (`app/components/shop/share-popover.tsx`)
- Replace hardcoded `'https://www.preceptfrance.fr'` with `SITE_URL` from `lib/site.ts`.
- Support flexible sharing props so the same component works for both **Books** (`/boutique/[id]`) and **Ateliers** (`/ateliers#atelier-[id]`), with customizable `urlPath`, `whatsappText`, `emailSubject`, and `inviteMessage`.

### 1.2 Single Source of Truth for Sample PDFs & Brochures (`lib/book-pdfs.ts` & `lib/sample-pdfs.ts`)
- Consolidate the book-title-to-PDF mapping into `lib/book-pdfs.ts` (`AVAILABLE_PDF_GROUPS`) and derive `SAMPLE_PDFS_BY_TITLE` / `getSamplePdfUrl()` in `lib/sample-pdfs.ts` directly from it.
- Move `/public/images/Choisir-letude-ideale-7-26.pdf` to `/public/pdfs/brochures_outils/Choisir-letude-ideale-7-26.pdf`, update `app/etude/page.tsx`, `app/ressources/page.tsx`, and `lib/book-pdfs.ts` to reference the unified path, and remove duplicate PDFs from `/public/images/`.

### 1.3 Local Dev Fallback for Cover Uploads (`lib/book-images.ts`)
- Mirror the local fallback pattern from `lib/book-pdfs.ts`: when `BLOB_READ_WRITE_TOKEN` is not configured in local dev, save uploaded covers under `/public/images/books/uploads/` and clean them up in `removeCover()`.

---

## Phase 2: `/ateliers` & `/admin/ateliers` Architecture

### 2.1 Data Model (`prisma/schema.prisma`)
Add `Atelier` model with an optional foreign key to `Product` (`onDelete: SetNull`):
- `id`: `String @id @default(cuid())`
- `title`: `String`
- `description`: `String`
- `scheduleText`: `String` (e.g., `"Tous les mardis de 20h00 à 21h30"`)
- `nextDate`: `DateTime?` (optional date/time of the next session for spotlight & calendar export)
- `durationMin`: `Int @default(90)`
- `leaderName`: `String?`
- `zoomUrl`: `String`
- `zoomInfo`: `String?` (optional Meeting ID / Passcode)
- `productId`: `String?` (optional relation to `Product`)
- `customImageUrl`: `String?`
- `customPdfUrl`: `String?`
- `featured`: `Boolean @default(false)`
- `published`: `Boolean @default(true)`
- `sortOrder`: `Int @default(0)`
- `createdAt` / `updatedAt`: `DateTime`

### 2.2 Public `/ateliers` Page (`app/ateliers/page.tsx`)
- **Navigation & Sitemap:** Linked in `app/components/header.tsx`, `app/components/footer.tsx`, and `app/sitemap.ts`.
- **Reassurance Banner:** Explicitly states that joining the weekly Zoom meetings is **100% free** and open to all; buying the book is optional.
- **Featured / Next Atelier Spotlight:** Highlights the `featured` atelier (or the next upcoming session) at the top of the page.
- **Atelier Cards:**
  - Displays book cover (inherited from `product.imageUrl` or `customImageUrl`), title, schedule, optional `nextDate`, leader name, and description.
  - **Primary CTA:** `Rejoindre sur Zoom` (`zoomUrl` + `zoomInfo`).
  - **Free PDF CTA:** `Télécharger l'extrait gratuit (PDF)` (from `customPdfUrl || product.samplePdfUrl || getSamplePdfUrl(product.name)`), allowing participants without the book to follow along.
  - **Optional Book Link:** `Acheter le livre (facultatif — XX,XX €)` linking to `/boutique/[productId]` when a book is linked.
  - **Calendar Helper:** `Ajouter à mon agenda` (Google Calendar link + `.ics` download) including the Zoom link in the event description/location.
  - **Social & WhatsApp Share:** Uses `SharePopover` pre-populated with a friendly WhatsApp invitation containing the topic, schedule, Zoom link, and `/ateliers` URL.

### 2.3 Admin Back-Office (`app/admin/(protected)/ateliers/`)
- Server-rendered CRUD matching `/admin/livres`:
  - List view (`/admin/ateliers`) with filters (`Tous`, `Masqués`), quick toggles (`Afficher/Masquer`, `À la une`), and `up`/`down` ordering.
  - Create (`/admin/ateliers/nouveau`) and Edit (`/admin/ateliers/[id]`) forms with book selector dropdown, Zoom fields, schedule fields, and optional custom PDF/image upload.
  - On-demand ISR revalidation (`revalidatePath('/ateliers')`, `revalidatePath('/sitemap.xml')`, `revalidatePath('/admin')`).
