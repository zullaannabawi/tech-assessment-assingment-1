# Refactoring Analysis — Orbit Storefront

> Codebase analysis produced before the refactoring described in [Refactoring Plan.md](./Refactoring%20Plan.md).
> Line numbers refer to the original code as committed in `1b5eb98` (before the refactor).

---

## 1. Starting Point

The Orbit storefront is a working demo device store built with Next.js 16 (App Router), React 19, TypeScript, Redux Toolkit, and lucide-react. The README states it plainly: *"the implementation is intentionally tangled. This is the starting point for a refactoring exercise, not an example of recommended architecture."*

Only four source files carry the entire application:

| File | Responsibility |
|---|---|
| `app/layout.tsx` | Root layout + metadata + Redux provider |
| `app/provider.tsx` | One hand-written reducer for all app state |
| `app/page.tsx` | Dashboard: mock user & product APIs, filtering, sorting, product grid |
| `app/product/[id]/page.tsx` | Detail page: mock detail API, specs, purchase flow, result dialog |

---

## 2. Code Smells

### S1 — Mock APIs inline in components

`userApi()` and `productsApi()` are defined inside the dashboard's `useEffect` (`app/page.tsx:16-24`); the detail "API" is an inline `new Promise` with its own database array (`app/product/[id]/page.tsx:20-32`).

**Impact:** data access cannot be swapped (client/server), faked in tests, or reused. The README even documents that the two pages simulate their APIs "independently", which is why the catalogue had to be duplicated (S2).

### S2 — Duplicated catalogue with different shapes

The 6 products exist twice:

- `app/page.tsx:18-23` — array of **objects**, no `stock` field.
- `app/product/[id]/page.tsx:22-28` — array of **arrays** (positional!), plus `stock: 12`.

**Impact:** any product change must be made in two places with two different encodings; nothing prevents them from drifting apart.

### S3 — One giant untyped reducer

`app/provider.tsx:7-15` handles six unrelated concerns (`user`, `walletBalance`, `products`, `selected`, `orders`, `search`, `category`) in a single function with plain string actions and `payload?: any`. The dashboard selects the **entire store** with `useSelector((state: any) => state)` (`app/page.tsx:9`).

**Impact:** no type safety, no memoization, every action re-renders everything, and the store shape is an implicit contract nobody can check.

### S4 — `buy()` mixes validation, processing, and presentation

`app/product/[id]/page.tsx:44-58` performs stock validation, balance checking, order-id generation, busy/done state transitions, and error message formatting in one function.

**Impact:** the business rules ("insufficient balance is a result, not an error", "order ids are ORB-XXXXXXXX") are invisible as rules and untestable without rendering the page.

### S5 — Monolithic components

Both pages are single giant JSX expressions. The header, footer, and CSS device illustration are duplicated verbatim between dashboard and detail page.

**Impact:** zero reuse; any layout change must be replicated by hand.

### S6 — Presentation leaking into state

The dashboard maps API rows to add `priceLabel: '$' + x.price.toLocaleString('en-US')` before dispatching them into Redux (`app/page.tsx:25`).

**Impact:** the store stores a formatted string that only one view needs; changing currency formatting means mutating stored data.

### S7 — Dead state

The `SELECTED` action stores the currently-viewed product in Redux, but no component ever reads `state.selected`.

**Impact:** extra state, extra dispatches, zero value.

### S8 — Zero tests, zero types

`useState<any>`, `p: any`, `x: any` throughout; no test runner in the project.

**Impact:** the parity-critical behaviors (dialog copy, focus trap, delays, balance rules) are protected by nothing.

---

## 3. Fix Mapping

| Smell | Fix | Target layer |
|---|---|---|
| S1 | `DeviceRepository` / `UserRepository` interfaces + InMemory & Api implementations | infrastructure |
| S2 | `mock-data.ts` as the single source of truth (adding `stock`) | infrastructure |
| S3 | Typed Redux slices (`user`, `device-catalog`, `device-filter`, `orders`) + typed hooks | composition/store |
| S4 | Pure `purchaseDevice` use case (result union + domain errors) | use-cases |
| S5 | Component decomposition (header, footer, art, card, toolbar, dialog…) | presentation |
| S6 | `formatUsdPrice()` in `shared/lib`, called by views | shared/lib |
| S7 | `selected` removed; `orders` kept for parity | composition/store |
| S8 | Vitest + Testing Library; strict types; ESLint boundary rules | all layers |

---

## 4. Design Decisions

| # | Decision | Reason |
|---|---|---|
| D1 | UI/behavior 100% identical — markup & classNames copied verbatim, `globals.css` untouched | Pure structural refactor (user choice) |
| D2 | Dual data source: `InMemoryDeviceRepository` (wired in registry) + `ApiDeviceRepository` + Route Handlers | Matches the reference codebase; demonstrates the value of the abstraction |
| D3 | Testing scope: unit (domain, use-case, slice) + component + controller | User choice (fullest scope) |
| D4 | Pages stay client components (useEffect + simulated loading) | The 450/750/600/1100ms loading UX must be identical |
| D5 | `purchaseController` is a plain async function (no `'use server'`) called from onClick | The button is not a form; busy-spinner UX must be identical |
| D6 | Sort moves from local `useState` into `device-filter-slice` | Consistent with the reference pattern; typed |
| D7 | `selected` state removed (dead), `orders` kept (parity) | Analysis S7 |
| D8 | Domain uses **Device** (not Product) following the UI language ("6 devices") | FDD ubiquitous language |
| D9 | `priceLabel` removed from state; views call `formatUsdPrice()` | S6 — formatting is a presentation concern |
| D10 | Language: code comments, docs, test descriptions = English | Consistent with existing code & FE assessment conventions |
| D11 | ESLint + `no-restricted-imports` overrides guard the layer boundaries | Dependency rules enforced automatically |
| D12 | Git: commit per phase (`refactor(phase-N): …`) | FDD/TDD history visible in git log |
