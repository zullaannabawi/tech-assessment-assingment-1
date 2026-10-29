# Refactoring Plan — Orbit Storefront

> **Refactoring plan document** — Clean Architecture + FDD (Feature-Driven Development) + TDD (Test-Driven Development)
> Project: `tech-assessment-assignment-1` (Orbit device storefront)
> Pattern reference: `nextjs-fdd-clean-architecture` (reference codebase)
> Theory guide: reference codebase `docs/clean-architecture-nextjs-en.md`

---

## Table of Contents

1. [Context & Goals](#1-context--goals)
2. [Codebase Analysis](#2-codebase-analysis)
3. [Target Architecture](#3-target-architecture)
4. [Design Decisions](#4-design-decisions)
5. [Behavior Parity Checklist](#5-behavior-parity-checklist)
6. [Step-by-Step Implementation](#6-step-by-step-implementation)
7. [Full Test Plan](#7-full-test-plan)
8. [Verification & Acceptance Criteria](#8-verification--acceptance-criteria)

---

## 1. Context & Goals

Orbit is a demo device store (6 smartphones/tablets) with a dashboard, search, filters, sorting, a product detail page, and a simulated purchase flow with a $1,050 demo wallet. The UI is already polished, but the implementation was intentionally tangled as assessment material.

**Goals:**

| # | Goal | Success measure |
|---|---|---|
| G1 | Codebase analysis documented | `docs/refactoring-analysis.md` with code smells + justification |
| G2 | Refactor to Clean Architecture | Dependencies point inward; domain free of React/Next/fetch; zero `any` |
| G3 | Apply FDD | Code organized per feature under `src/features/*` + test-case docs per feature |
| G4 | Apply TDD | Every domain/use-case/slice/controller unit has tests written **before** implementation (Red→Green→Refactor) |
| G5 | UI & behavior 100% identical | All §5 checks pass; `globals.css` & classNames unchanged |

**Non-goals** (not in scope): visual design changes, new features, a real backend, i18n, E2E testing (Playwright).

---

## 2. Codebase Analysis

### 2.1 Code Smells

| # | Smell | Location | Impact |
|---|---|---|---|
| S1 | Mock APIs inline in components | `src/app/page.tsx:16-24` (`userApi`, `productsApi`), `src/app/product/[id]/page.tsx:20-32` | Data access cannot be swapped or tested in isolation |
| S2 | Duplicated catalogue, different shapes | `src/app/page.tsx:18-23` (array of objects, no `stock`) vs `src/app/product/[id]/page.tsx:22-28` (array of arrays, +`stock: 12`) | Product changes must be made in 2 places; drift risk |
| S3 | One giant untyped reducer | `src/app/provider.tsx:7-15` — 6 responsibilities in 1 function | No type safety; whole state selected (`useSelector((state:any)=>state)` in `src/app/page.tsx:9`) |
| S4 | `buy()` mixes everything | `src/app/product/[id]/page.tsx:44-58` — stock validation + balance check + order creation + presentation state | Business rules untested, not reusable |
| S5 | Monolithic components | Both pages are single giant JSX expressions (~40 lines per return) | Nothing reusable (header, footer, device art duplicated across pages) |
| S6 | Presentation leaking into state | `priceLabel: '$'+x.toLocaleString()` dispatched into Redux (`src/app/page.tsx:25`) | Store holds view formatting |
| S7 | Dead state | `selected` dispatched (`SELECTED`) but never read | Complexity without purpose |
| S8 | Zero tests, zero types | All `useState<any>`, `p: any`, `s: any` | Regressions undetectable |

### 2.2 Fix Mapping

| Smell | Fix | Target layer |
|---|---|---|
| S1 | `DeviceRepository` / `UserRepository` + InMemory & Api implementations | infrastructure |
| S2 | `mock-data.ts` single source of truth (+`stock`) | infrastructure |
| S3 | 3 typed slices + typed hooks | composition/store |
| S4 | Pure `purchaseDevice` use case | use-cases |
| S5 | Component decomposition (header, footer, card, toolbar, dialog, etc.) | presentation |
| S6 | `formatUsdPrice()` called in the view | shared/lib |
| S7 | Removed | — |
| S8 | Vitest + strict types | all layers |

---

## 3. Target Architecture

### 3.1 Folder Structure

```
src/
├── app/                                    # [Presentation-entry] Next.js routes — THIN only
│   ├── layout.tsx                          #   metadata + <ReduxProvider>
│   ├── page.tsx                            #   → <DiscoverPage /> (client)
│   ├── product/[id]/page.tsx               #   → unwrap params → <ProductDetailPage id={id} />
│   ├── globals.css                         #   NOT CHANGED AT ALL
│   └── api/
│       ├── products/route.ts               #   GET → catalogue JSON (for ApiDeviceRepository)
│       └── products/[id]/route.ts          #   GET → 1 device | 404
│
├── features/
│   ├── product-catalog/                    # ══ FEATURE 1 (FDD) ══
│   │   ├── domain/
│   │   │   ├── device.ts                   #   Device type, categories, filter/sort/search rules
│   │   │   └── device.test.ts
│   │   ├── use-cases/
│   │   │   ├── device-repository.ts        #   DeviceRepository interface (contract)
│   │   │   ├── get-devices.ts
│   │   │   ├── get-device-by-id.ts         #   + DeviceNotFoundError class
│   │   │   └── *.test.ts
│   │   ├── infrastructure/
│   │   │   ├── mock-data.ts                #   6 devices — ONE data source (fixes S2)
│   │   │   ├── in-memory-device-repository.ts   # 750ms/600ms delays (fixes S1)
│   │   │   └── api-device-repository.ts    #   fetch /api/products
│   │   ├── controllers/
│   │   │   ├── device-controller.ts        #   registry wiring → use case
│   │   │   └── device-controller.test.ts
│   │   └── presentation/
│   │       ├── pages/
│   │       │   ├── discover-page.tsx       #   client — replaces old dashboard page
│   │       │   └── product-detail-page.tsx #   client — replaces old detail page
│   │       └── components/
│   │           ├── site-header.tsx         #   (cross-page duplication removed)
│   │           ├── site-footer.tsx         #   2 variants via props
│   │           ├── welcome-panel.tsx       #   welcome + membership + wallet section
│   │           ├── device-art.tsx          #   CSS device illustration (back/front/cameras)
│   │           ├── device-card.tsx         #   product card (Link → /product/:id)
│   │           ├── filter-toolbar.tsx      #   category tabs + search + sort
│   │           ├── benefits-section.tsx
│   │           ├── loading-indicator.tsx
│   │           └── __tests__/
│   │               ├── device-card.test.tsx
│   │               └── filter-toolbar.test.tsx
│   │
│   ├── user-profile/                       # ══ FEATURE 2 (FDD) ══
│   │   ├── domain/user.ts (+test)          #   User + displayName()
│   │   ├── use-cases/ user-repository.ts, get-user.ts (+test)
│   │   ├── infrastructure/ mock-user.ts, in-memory-user-repository.ts (450ms)
│   │   └── controllers/ user-controller.ts (+test)
│   │
│   └── purchase/                           # ══ FEATURE 3 (FDD) ══
│       ├── domain/purchase.ts (+test)      #   PurchaseInput, PurchaseResult, OutOfStockError
│       ├── use-cases/purchase-device.ts (+test)
│       ├── controllers/purchase-controller.ts (+test)
│       └── presentation/components/
│           ├── buy-button.tsx              #   busy/pending state
│           ├── specs-grid.tsx
│           └── purchase-dialog.tsx (+__tests__)   # success/insufficient modal + focus trap
│
├── composition/                            # ══ COMPOSITION ROOT ══
│   ├── registry.ts                         #   createDeviceRepository() → InMemory, etc. (DI)
│   └── store/
│       ├── index.ts                        #   configureStore + RootState + AppDispatch
│       ├── provider.tsx                    #   'use client' ReduxProvider
│       ├── hooks.ts                        #   useAppSelector / useAppDispatch (typed)
│       ├── slices/
│       │   ├── user-slice.ts               #   { user, walletBalance }
│       │   ├── device-catalog-slice.ts     #   { devices, loading, error } — catalogue data
│       │   ├── device-filter-slice.ts      #   { search, category, sortBy } + selectFilteredDevices
│       │   └── orders-slice.ts             #   orders[]
│       └── __tests__/ *-slice.test.ts
│
└── shared/
    ├── lib/formatters.ts (+test)           #   formatUsdPrice()
    └── presentation/components/            #   shared atoms when needed
```

> `docs/` lives at the repo root (outside `src/`), following the reference codebase convention.

### 3.2 Dependency Rules (used as review checklist)

```
presentation → controllers → use-cases → domain
infrastructure → use-cases (implements interfaces)
composition → everything (the only place concrete wiring happens)
```

- `domain/` **must not** import React, Next.js, Redux, or `fetch`.
- `use-cases/` receive repositories as **function parameters** (never import concrete implementations).
- `infrastructure/` is the only place `setTimeout` (simulation) & `fetch` may appear.
- `composition/registry.ts` is the only place that chooses a concrete implementation.
- These rules are enforced automatically by ESLint `no-restricted-imports` overrides in `eslint.config.mjs`.

---

## 4. Design Decisions

| # | Decision | Reason |
|---|---|---|
| D1 | UI/behavior 100% identical — markup & classNames copied verbatim, `globals.css` untouched | Pure structural refactor (user choice) |
| D2 | Dual data source: `InMemoryDeviceRepository` (wired in registry) + `ApiDeviceRepository` + Route Handlers | Matches the reference codebase; demonstrates the value of the abstraction |
| D3 | Testing: unit (domain, use-case, slice) + component + controller | User choice (fullest scope) |
| D4 | Pages stay client components (useEffect + simulated loading) — not Server Components/Suspense | The 450/750/600/1100ms loading UX must be identical |
| D5 | `purchaseController` = plain async function (no `'use server'`) called from onClick | The button is not a form; busy-spinner UX must be identical |
| D6 | Sort moves from local `useState` → `device-filter-slice` | Consistent with the reference pattern; typed |
| D7 | `selected` state removed (dead), `orders` kept (parity) | Analysis S7 |
| D8 | Domain uses the term **Device** (not Product) following the UI language ("6 devices") | FDD ubiquitous language |
| D9 | `priceLabel` removed from state; views call `formatUsdPrice()` | S6 — formatting is a presentation concern |
| D10 | Language: code comments, `docs/`, test descriptions = **English** | Consistent with existing code & FE assessment conventions |
| D11 | ESLint (`eslint` + `eslint-config-next`) + `npm run lint`; `no-restricted-imports` guards the §3.2 layer boundaries | Dependency rules enforced automatically |
| D12 | Git: **commit per phase** (`refactor(phase-N): …`, English messages) | FDD/TDD history visible in git log |

---

## 5. Behavior Parity Checklist

> Re-checked during verification. All strings are **exact** (including the typographic apostrophe `’` and ellipsis `…`).

### 5.1 Data & Timing

| ☐ | Old behavior | New implementation |
|---|---|---|
| ☐ | User API delay **450ms** → `{id:1, first_name:'Dilan', last_name:'Morgan', email:'dilan.1995@email.com', membership:'Orbit Plus', wallet_balance:1050}` | `InMemoryUserRepository.getUser()` + snake_case→camelCase mapper in infra |
| ☐ | Products API delay **750ms** → 6 devices, full fields (`tone`, `tag`, `storage`, `screen`, `chip`, `camera`, `battery`, `os`) | `mock-data.ts` + `InMemoryDeviceRepository.getDevices()` |
| ☐ | Detail API delay **600ms** → device + **`stock: 12`**; unknown ID → reject `We couldn’t find that device.` | `getDeviceById()` throws `DeviceNotFoundError` (same message, `’` U+2019) |
| ☐ | Buy delay **1100ms**; `stock < 1` → throw `This device is out of stock.`; `price > balance` → **resolve** `{status:'insufficient_balance'}` (NOT a throw); success → `ORB-` + last 8 digits of timestamp | `purchaseDevice()` — union result; same message & ORB-XXXXXXXX format |

### 5.2 Dashboard

| ☐ | Old behavior |
|---|---|
| ☐ | Loading: `Getting your next favorites ready…` (with `…`) |
| ☐ | Error (catch Promise.all): `Something went wrong. Please refresh to try again.` with `role="alert"` |
| ☐ | User fallback while loading: name `Alex`, email `Getting your profile ready…`, membership `Orbit Plus` |
| ☐ | Balance renders `$1,050 USD` via `toLocaleString('en-US')` |
| ☐ | Category filters `All devices / Smartphones / Tablets` (LayoutGrid/Smartphone/Tablet icons), `active` class |
| ☐ | Search: `(name + brand).toLowerCase().includes(query.toLowerCase())` |
| ☐ | Sort: `featured` (original order) / `low` / `high` |
| ☐ | Result count `N devices, endless possibilities`; empty → `No devices found. Try another search.` |
| ☐ | Avatar `AM` hardcoded (by design — kept) |
| ☐ | All classNames & DOM structure identical |

### 5.3 Detail & Purchase

| ☐ | Old behavior |
|---|---|
| ☐ | Direct URL `/product/3` works (client fetch by id) |
| ☐ | Loading: `A closer look is on its way…` |
| ☐ | Unknown id: `Device not found.` + error message + `Back to dashboard` button |
| ☐ | Button `Make it yours $X`; while busy: spinner + `Making it yours…`, `disabled` |
| ☐ | Double-click while busy/done cannot trigger a duplicate POST (`if (busy \|\| done) return`) |
| ☐ | Success dialog: `It’s officially in orbit.`, order ref `ORB-XXXXXXXX` |
| ☐ | Insufficient dialog: `Insufficient balance`, shows balance & `$(price-balance)` shortfall |
| ☐ | Focus trap: Tab always returns to the `#success-cta` button; focus restored to the previous element when the dialog unmounts |
| ☐ | Balance does **not** decrease after purchase; state resets on reload |
| ☐ | Redux `orders` still receives successful orders (parity — even though the UI never reads it) |

---

## 6. Step-by-Step Implementation

> Features are built **one at a time** (FDD), and every unit follows the **TDD** cycle:
> 1. **RED** — write a failing test (module/behavior doesn't exist yet)
> 2. **GREEN** — minimal implementation to pass the test
> 3. **REFACTOR** — clean up without changing behavior (tests stay green)

### PHASE 0 — Infrastructure Setup

- **0.1** Install dependencies (vitest, testing library, eslint).
- **0.2** Read the Next.js 16 guides in `node_modules/next/dist/docs/` (params-as-Promise, Route Handlers, `'use client'`) — required by AGENTS.md.
- **0.3** `vitest.config.ts` + `vitest.setup.ts` (jsdom, globals, `@` alias).
- **0.4** `package.json` scripts (`test`, `test:watch`, `lint`) + `eslint.config.mjs` with layer-boundary rules.
- **0.5** Move `app/` → `src/app/` (`git mv`), add `"paths": {"@/*": ["./src/*"]}` to tsconfig. Gate: typecheck + build green.
- **0.6** Write docs (this file + `refactoring-analysis.md`).

### PHASE 1 — shared/lib (TDD warm-up)

`formatUsdPrice`: RED test (999→`$999`, 1050→`$1,050`, 1299→`$1,299`) → GREEN implementation → REFACTOR so no other price-formatting logic remains.

### PHASE 2 — FEATURE product-catalog (FDD + TDD)

- **2.1** `docs/test-cases/product-catalog.md` (TC tables, TC order = TDD cycle order).
- **2.2** RED→GREEN domain: `filterByCategory` / `searchDevices` / `sortDevices` (PC-01..08).
- **2.3** RED→GREEN use cases: `getDevices`, `getDeviceById` (+`DeviceNotFoundError`) with a mock repository class (PC-09..11).
- **2.4** Infrastructure: `mock-data.ts` (single source, +stock 12), `InMemoryDeviceRepository` (750/600ms delays, returns copies), `ApiDeviceRepository`, Route Handlers `/api/products` + `/api/products/[id]` (404).
- **2.5** RED→GREEN controller via registry.
- **2.6** Presentation components — markup & classNames **copied verbatim**: SiteHeader → SiteFooter (variant prop) → LoadingIndicator → DeviceArt → DeviceCard → FilterToolbar → WelcomePanel → BenefitsSection.

### PHASE 3 — FEATURE user-profile (FDD + TDD)

Test-case doc → RED→GREEN domain (`User`, `displayName()`) → use case (`UserRepository`, `getUser`) → infrastructure (snake_case source + camelCase mapper, 450ms delay) → controller. WelcomePanel falls back to `Alex` / `Getting your profile ready…` exactly.

### PHASE 4 — FEATURE purchase (FDD + TDD)

- **4.1** `docs/test-cases/purchase.md` (PU-01..05).
- **4.2** RED→GREEN domain: `PurchaseInput`, `PurchaseResult` union, `OutOfStockError`.
- **4.3** RED→GREEN use case `purchaseDevice(repo, input)`: find device (`DeviceNotFoundError`) → stock check (throw) → balance check (return insufficient) → success (`ORB-` + timestamp). The 1100ms delay lives in the **controller**, not the use case, so tests run instantly.
- **4.4** RED→GREEN controller (1100ms delay + use case via registry).
- **4.5** Presentation: `PurchaseDialog` (verbatim modal + focus trap + restore), `BuyButton` (busy/done/disabled logic identical), `SpecsGrid`. On success the page dispatches `addOrder` (parity with the old `ORDER` action).

### PHASE 5 — Composition Root (TDD per slice)

- **5.1** RED→GREEN slices (tested with a real `configureStore`): `user-slice` (`{user, walletBalance:1050}`), `device-catalog-slice` (`{devices, loading, error}`), `device-filter-slice` (`{search, category, sortBy}` + memoized `selectFilteredDevices` composing the domain functions), `orders-slice`.
- **5.2** `store/index.ts` + `hooks.ts` (typed) + `provider.tsx` + `registry.ts`.
- **5.3** Delete the old `src/app/provider.tsx`; `layout.tsx` imports `ReduxProvider` from composition.

### PHASE 6 — Page Wiring + Component Tests

- **6.1** `DiscoverPage` (client): `Promise.all([getUserController(), getDevicesController()])` with the `alive` cleanup flag pattern; dispatches `setUser` + `setDevices`; renders the decomposed components.
- **6.2** `ProductDetailPage` (client, `id` prop): same local state pattern as before; `BuyButton` → `purchaseDeviceController` → `PurchaseDialog`; dispatch `addOrder` on success. `src/app/product/[id]/page.tsx` is a thin Server Component that awaits `params` (Next 16 convention).
- **6.3** `src/app/page.tsx` renders `<DiscoverPage />` only.
- **6.4** Component tests: DeviceCard (name/price/badge/link), FilterToolbar (search dispatch, tab active, sort), PurchaseDialog (success/insufficient variants, CTA focused).
- **6.5** Final cleanup + sanity greps: no `state: any`, no `any` in domain/use-cases, `iPhone 16 Pro` appears only in `mock-data.ts`.

---

## 7. Full Test Plan

| Suite | File | Kind | TCs |
|---|---|---|---|
| Formatters | `shared/lib/formatters.test.ts` | unit | TC-01..03 |
| Device domain | `features/product-catalog/domain/device.test.ts` | unit | PC-01..08 |
| Catalog use cases | `features/product-catalog/use-cases/*.test.ts` | unit | PC-09..11 |
| Catalog controller | `features/product-catalog/controllers/device-controller.test.ts` | unit+DI | PC-09..11 via registry |
| User domain+use case+controller | `features/user-profile/**/+test` | unit | UP-01..03 |
| Purchase use case | `features/purchase/use-cases/purchase-device.test.ts` | unit | PU-01..05 |
| Purchase controller | `features/purchase/controllers/purchase-controller.test.ts` | unit (fake timers for 1100ms) | PU-01..02 |
| Slices | `composition/store/__tests__/*.test.ts` | unit | per action+selector incl. `selectFilteredDevices` combinations |
| DeviceCard / FilterToolbar / PurchaseDialog | `**/__tests__/*.test.tsx` | component | §6.4 |

**~40+ test cases total.** Conventions: `describe('Domain: …')`, `it('should …')`, mock repositories as classes `implements`ing the interface — following the reference codebase.

---

## 8. Verification & Acceptance Criteria

### 8.1 Automated

```sh
npm run typecheck   # green, zero new `any`
npm test            # all suites green
npm run lint        # green, boundary rules satisfied
npm run build       # succeeds
```

### 8.2 Manual parity (run `npm run dev`)

| ☐ | Scenario | Expected |
|---|---|---|
| ☐ | Open `/` | Loading text → dashboard with 6 devices, Dilan Morgan welcome, $1,050 balance |
| ☐ | Smartphones tab | 4 devices; Tablets tab → 2 |
| ☐ | Type `pixel` | 1 device; type `zzz` → `No devices found. Try another search.` |
| ☐ | Sort low→high | iPad Air $599 first |
| ☐ | Click a card → detail | Loading `A closer look…` → full specs |
| ☐ | Direct URL `/product/3` | iPad Air immediately |
| ☐ | `/product/99` | `Device not found.` + back button |
| ☐ | Buy iPhone 16 ($799) | Spinner `Making it yours…` ~1.1s → success dialog `ORB-XXXXXXXX`, CTA focused, Tab trapped |
| ☐ | Buy Galaxy S25 Ultra ($1299) | `Insufficient balance` dialog, shows `$1,050` & `$249` |
| ☐ | Fast double-click | No duplicate POST (disabled while busy) |
| ☐ | Back to dashboard | Balance still $1,050 |
| ☐ | Full reload | Redux state reset |

### 8.3 Architecture review (§3.2 dependency checklist)

- ☐ Domain/use cases free of React/Next/Redux/fetch imports (verified via ESLint boundary rules)
- ☐ Registry is the only place instantiating `InMemory*Repository`
- ☐ No business logic in components (components only render + dispatch + call controllers)

### Execution order & git

- Work through Phases 0→6 in order; **every phase ends with** `npm test && npm run typecheck && npm run lint` green.
- **Commit per phase** (D12): English message, `refactor(phase-N): <summary>` — e.g. `refactor(phase-2): product-catalog feature with TDD`. AGENTS.md stays committed per its own instruction.
