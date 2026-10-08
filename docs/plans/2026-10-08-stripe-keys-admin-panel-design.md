# Design Document: Stripe Keys Management via Admin Panel

**Date:** 2026-10-08  
**Topic:** stripe-keys-admin-panel  
**Status:** Approved  

---

## 1. Overview

Currently, Stripe credentials (`STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET`) are configured solely via environment variables. This feature allows administrators to manage Stripe keys and switch between **Test** and **Production (Live)** modes directly from the admin interface (`/admin/parametres`), with sensitive keys encrypted at rest in the PostgreSQL database and automatic fallback to environment variables when database settings are absent.

---

## 2. Architecture & Data Model

### 2.1 Prisma Schema (`AppSetting`)

A generic key-value store in `prisma/schema.prisma` enables storing application configurations without schema redesigns for future features:

```prisma
model AppSetting {
  key       String   @id
  value     String
  isSecret  Boolean  @default(false)
  updatedAt DateTime @updatedAt
}
```

### 2.2 Managed Keys
The following setting keys will be stored:
- `stripe_mode`: `"test"` | `"live"` (default: `"live"`)
- `stripe_test_secret_key`: Encrypted Stripe test secret key (`sk_test_...` or `rk_test_...`)
- `stripe_test_webhook_secret`: Encrypted Stripe test webhook signing secret (`whsec_...`)
- `stripe_live_secret_key`: Encrypted Stripe production secret key (`sk_live_...` or `rk_live_...`)
- `stripe_live_webhook_secret`: Encrypted Stripe production webhook signing secret (`whsec_...`)

### 2.3 Encryption at Rest (`lib/crypto.ts`)
- **Algorithm**: AES-256-GCM.
- **Master Secret**: Key derived from `ADMIN_SESSION_SECRET` (or dedicated `APP_ENCRYPTION_KEY` if provided).
- **Format**: `iv:authTag:ciphertext` encoded in hex.
- **Safety**: Functions for `encryptSecret`, `decryptSecret`, and `maskSecret` (e.g., `sk_test_••••••••a1b2`).

### 2.4 Configuration Service (`lib/stripe-config.ts`)
- `getActiveStripeCredentials()`:
  1. Reads `stripe_mode` (defaults to `"live"`).
  2. Selects appropriate keys based on active mode.
  3. Decrypts secrets.
  4. **Fallback**: If any key is missing from the database, seamlessly falls back to `process.env.STRIPE_SECRET_KEY` and `process.env.STRIPE_WEBHOOK_SECRET`.
- `getStripeSettingsForAdmin()`: Returns active mode and masked key representations so secrets are never exposed in browser HTML/DOM.

---

## 3. Admin User Interface & Server Actions

### 3.1 Navigation & Pages
- **Route**: `/admin/parametres` (`nextjs_space/app/admin/(protected)/parametres/page.tsx`).
- **Header**: Adds **Paramètres** link to `/admin/(protected)/layout.tsx`.

### 3.2 UI Components
- **Environment Switcher**: Visual toggle between **Mode Test** (yellow/amber badge) and **Mode Production** (green badge).
- **Credentials Cards**:
  - Test mode credentials form (`sk_test_...`, `whsec_...`) with "Tester la connexion (Test)" button.
  - Production mode credentials form (`sk_live_...`, `whsec_...`) with "Tester la connexion (Live)" button.
- **Webhook Helper**: Displays webhook endpoint URL (`https://www.preceptfrance.fr/api/webhook`) with a copy button.
- **Masking & Reversion**: Inputs display masked values (`sk_...••••1234`) for existing keys. Empty submission preserves existing keys; an explicit "Effacer" action reverts to `.env`.

### 3.3 Server Actions (`app/admin/(protected)/parametres/actions.ts`)
- `testStripeConnection(mode, candidateKey)`:
  - Validates key against Stripe API (`stripe.balance.retrieve()`).
  - Verifies mode matches key prefix.
  - Returns clear validation message or error description.
- `saveStripeSettings(formData)`:
  - Validates key prefixes (`sk_test_`, `sk_live_`, `whsec_`).
  - Encrypts and persists values in `AppSetting`.
  - Revalidates admin pages and clears runtime in-memory caches.

---

## 4. Runtime Integration & Webhooks

### 4.1 Stripe Client Factory (`lib/stripe.ts`)
- Updated to async: `export async function getStripe(): Promise<Stripe>`.
- Dynamically loads credentials using `getActiveStripeCredentials()`.
- Caches client instances in-memory to prevent repeated DB reads, invalidated upon configuration update.

### 4.2 Callsite Updates
- `/app/api/checkout/route.ts`: Uses `await getStripe()` and uses active mode settings.
- `/app/api/webhook/route.ts`: Uses active `webhookSecret` for signature verification; falls back to `.env.STRIPE_WEBHOOK_SECRET`.
- `/lib/checkout-session.ts`: Uses `await getStripe()` for order verification on checkout completion.

---

## 5. Error Handling & Safeguards

1. **Prefix Mismatch Prevention**: Rejects saving test keys as live or live keys as test.
2. **Missing Configuration**: Returns explicit 500 error log if neither DB nor `.env` provides credentials.
3. **Graceful Fallback**: If DB is temporarily unavailable, falls back to environment variables.
4. **Non-destructive Migration**: Adding `AppSetting` preserves all existing order and product data.

---

## 6. Testing Plan

1. **Crypto Unit Tests**: Validate encrypt/decrypt round-trip and masking formatting.
2. **Admin Connection Test**: Validate real API responses for valid and invalid keys.
3. **End-to-End Test Purchase**:
   - Enable Mode Test in admin.
   - Enter test keys.
   - Execute checkout in boutique with Stripe test card.
   - Verify webhook receives and processes order correctly.
