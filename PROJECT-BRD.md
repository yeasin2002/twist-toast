# Business Requirements Document

## Custom Toast Notification Library — `twist-toast`

|                   |                                      |
| ----------------- | ------------------------------------ |
| **Document Type** | Business Requirements Document (BRD) |
| **Package Name**  | twist-toast                          |
| **Version**       | 2.0 — Revised Draft                  |
| **Date**          | February 17, 2026                    |
| **Status**        | Draft — Pending Review               |
| **Supersedes**    | BRD v1.0                             |

---

## 1. Executive Summary

This document defines the revised business and functional requirements for `twist-toast`, incorporating a key architectural change to the integration model introduced after v1 drafting.

The core value proposition remains the same — the library manages toast behavior while the developer owns every pixel of the UI. However, the integration surface has been redesigned: instead of passing a `components` map directly into `<ToastProvider>`, developers now call `createToast()` with their component map to produce a fully-typed, self-contained `toast` instance. The provider becomes a thin, configuration-free wrapper.

This shift improves ergonomics significantly: the `toast` object and its type inference are co-located with the component definitions, enabling better TypeScript autocomplete and allowing the config to live in its own module rather than being coupled to the React tree.

---

## 2. Business Objectives

| ID     | Objective                       | Description                                                                                                              |
| ------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| OBJ-01 | Solve design lock-in            | Eliminate the constraint that forces developers to override third-party toast styles to match their design system.       |
| OBJ-02 | Reduce integration cost         | Allow teams to integrate toast notifications in minutes — install, wrap, call.                                           |
| OBJ-03 | Enable design-system alignment  | Let each product use its own tokens, components, and accessibility patterns without compromise.                          |
| OBJ-04 | Establish an OSS footprint      | Publish a well-documented, production-ready npm package to build community adoption.                                     |
| OBJ-05 | Create an extensible foundation | Design the core to support a future CLI, additional frameworks, and plugin hooks without breaking changes.               |
| OBJ-06 | Maximise TypeScript DX          | Ensure the `toast` instance infers payload types directly from the registered components, eliminating runtime guesswork. |

---

## 3. Project Scope

### 3.1 In Scope — Phase 1

- `createToast(components)` factory: accepts a variant → component map and returns a typed `toast` object
- Core toast manager: trigger, queue, deduplicate, and dismiss toast notifications
- Support for named toast types: `success`, `error`, `warning`, `info`, and arbitrary custom variants
- User-supplied component rendering: each variant resolves to a developer-owned component
- Configurable options per call: `duration`, `position`, `dismissOnClick`, `id`, and ARIA `role`
- `<ToastProvider>` as a zero-config context wrapper (no component map required)
- `useToast()` hook for internal consumers if needed
- React 18+ compatibility with concurrent mode support
- TypeScript-first with full generic type propagation from `createToast` through to component props
- Comprehensive unit and integration tests (Vitest + Testing Library)
- Starter template components (optional, zero-dependency baseline designs)
- npm publication with semantic versioning and a CHANGELOG
- README, API reference, and a Getting Started guide

### 3.2 Out of Scope — Phase 1

- Vue, Angular, Svelte, or other framework support (deferred to Phase 2)
- CLI scaffolding tool for generating component stubs (deferred to Phase 2)
- Server-side toast triggering or WebSocket-driven notifications
- Built-in animation engine (consumers use their own CSS/Framer Motion)
- Analytics, tracking, or remote configuration
- Mobile / React Native support
- A hosted documentation site (Phase 2)

---

## 4. Stakeholders

| Stakeholder                 | Responsibility                                                                                                  | Influence     |
| --------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------- |
| Package Author / Maintainer | Designs core API, implements library, publishes to npm, and maintains the repository                            | High          |
| End-User Developers (React) | Primary consumers; call `createToast()` with their own components and use the returned instance                 | High          |
| Design System Teams         | Benefit from uncompromised brand/token alignment; `createToast` maps naturally to a shared design system module | Medium        |
| Open-Source Community       | Submit issues, PRs, and feature requests once published                                                         | Medium        |
| Phase 2 Framework Users     | Future consumers targeting Vue, Svelte, Angular — requirements defined separately                               | Low (Phase 1) |

---

## 5. Functional Requirements

Priority scale: **Must** = required for v1 release | **Should** = high-value, best-effort | **Could** = backlog candidate

| ID    | Requirement                     | Priority | Description                                                                                                                                                                                                                                                |
| ----- | ------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR-01 | `createToast()` Factory         | Must     | Export a `createToast(components)` function that accepts a variant → component map and returns a `toast` instance with methods typed to those variants. This is the primary integration point.                                                             |
| FR-02 | Typed Toast Instance            | Must     | The returned `toast` object must expose methods matching the registered variant keys (e.g. `toast.success()`, `toast.error()`). TypeScript must infer the payload type from the component's props — no manual generic annotation required by the consumer. |
| FR-03 | `<ToastProvider>` Setup         | Must     | A `<ToastProvider>` wrapper must be provided. It acts as a zero-config context anchor — it does not receive a components map. The `toast` instance created by `createToast()` registers itself with the nearest provider automatically.                    |
| FR-04 | Toast Options per Call          | Must     | Each toast invocation accepts: `duration` (ms), `position` (top-right, top-left, bottom-right, bottom-left, top-center, bottom-center), `dismissOnClick` (boolean), `id` (string, auto-generated if omitted), and `aria` role (`alert` \| `status`).       |
| FR-05 | Queue Management                | Must     | Maintain an ordered queue. When max concurrent toasts is reached, new toasts queue and display when a slot opens. Default max: 5 (configurable via `createToast` options).                                                                                 |
| FR-06 | Deduplication                   | Should   | If a toast with an identical `id` is triggered while one is already visible, the duplicate is ignored or the existing one refreshed (configurable).                                                                                                        |
| FR-07 | Programmatic Dismissal          | Must     | `toast.dismiss(id)` and `toast.dismissAll()` must be available on the returned instance.                                                                                                                                                                   |
| FR-08 | Pause on Hover                  | Should   | The auto-dismiss timer must pause on hover over the toast container and resume on mouse leave.                                                                                                                                                             |
| FR-09 | Accessibility                   | Must     | The toast container must use `aria-live="polite"` or `aria-live="assertive"` based on the toast role. Focus must not be stolen. Dismiss controls must be keyboard accessible.                                                                              |
| FR-10 | TypeScript Types                | Must     | Export: `CreateToastOptions`, `ToastVariant`, `ToastComponentProps<T>`, `ToastProviderProps`, `ToastInstance<TComponents>`.                                                                                                                                |
| FR-11 | Multiple Instances              | Should   | Developers must be able to call `createToast()` multiple times to produce isolated toast instances scoped to different providers (e.g. one global, one scoped to a modal).                                                                                 |
| FR-12 | Global Config via `createToast` | Must     | `createToast()` must accept a second argument for global defaults: `{ defaultDuration, defaultPosition, maxToasts }`.                                                                                                                                      |
| FR-13 | Custom Data Passthrough         | Must     | Arbitrary data passed in the toast payload must be forwarded as props to the user's component without modification.                                                                                                                                        |
| FR-14 | Starter Templates               | Could    | An optional `/templates` export may provide 3–5 basic styled components as copy-paste starters with zero additional runtime dependencies.                                                                                                                  |

---

## 6. Non-Functional Requirements

| ID     | Area                 | Requirement                                                                                                                                                                   |
| ------ | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| NFR-01 | Performance          | Bundle size (tree-shaken) must not exceed 5 KB gzipped. No runtime dependencies beyond React itself (peer dependency).                                                        |
| NFR-02 | Compatibility        | Must support React 17 and 18. Must support Node.js 18+ for SSR environments. CJS + ESM dual build required.                                                                   |
| NFR-03 | TypeScript Coverage  | All public APIs fully typed with generics. The package must ship `.d.ts` files. Strict mode compliance. `createToast` must propagate types end-to-end without casting.        |
| NFR-04 | Test Coverage        | Minimum 90% line coverage on core logic. Integration tests must cover: factory creation, provider wiring, trigger → render → dismiss lifecycle, and multi-instance isolation. |
| NFR-05 | Documentation        | Complete README with Quick Start, `createToast` API reference, and typed component examples. JSDoc on all public exports.                                                     |
| NFR-06 | Developer Experience | `npm install twist-toast`. Integration requires 3 steps: install → `createToast()` in a config file → `<ToastProvider>` in app root. First toast in under 5 minutes.          |
| NFR-07 | Versioning           | Semver enforced. Breaking changes restricted to major versions. CHANGELOG maintained.                                                                                         |
| NFR-08 | Security             | No `eval` or `innerHTML`. Custom component props passed as data only. XSS-safe by design.                                                                                     |

---

## 7. Architecture & Technical Design Overview

### 7.1 Core Modules

**Layer 1 — Toast Manager (State & Logic)**
A framework-agnostic state machine that maintains the active toast queue, handles timer logic, deduplication, and event emission. Isolated from React so it can be adapted for other frameworks in Phase 2.

**Layer 2 — `createToast()` Factory**
The developer-facing entry point. Accepts a component map and optional global config. Constructs a typed `toast` instance bound to a shared manager. This layer is responsible for all TypeScript inference — the returned object's method signatures are derived from the component map's keys and prop types.

**Layer 3 — React Adapter**
`<ToastProvider>` subscribes to registered toast managers via context and renders a React portal for each. The adapter is the only React-dependent module in the codebase.

**Layer 4 — Component Resolver**
When the manager emits a new toast event, the resolver looks up the variant key in the component map, renders the matched component, and forwards the payload plus internal control props (`dismiss`, `toastId`).

### 7.2 Integration Pattern

```tsx
// toast.config.ts — lives in your project, imported wherever needed
import { createToast } from "twist-toast";
import { SuccessToast, ErrorToast } from "@/components/toasts";

export const toast = createToast(
  {
    success: SuccessToast,
    error: ErrorToast,
  },
  {
    defaultPosition: "top-right",
    defaultDuration: 4000,
    maxToasts: 5,
  },
);
```

```tsx
// app/layout.tsx (or _app.tsx)
import { ToastProvider } from "twist-toast";

export default function Layout({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
```

```tsx
// anywhere in your app
import { toast } from "@/toast.config";

toast.success({ title: "Saved!", description: "Your changes were saved." });
toast.error({ title: "Failed", duration: 8000 });
toast.dismiss("some-id");
```

```tsx
// Your component — full design control
const SuccessToast = ({ title, description, dismiss }: ToastComponentProps) => (
  <div className="your-class" onClick={dismiss}>
    <strong>{title}</strong>
    <p>{description}</p>
  </div>
);
```

### 7.3 Build Targets

| Format | Output            | Usage                              |
| ------ | ----------------- | ---------------------------------- |
| ESM    | `dist/index.mjs`  | Bundlers (Vite, Rollup, Webpack 5) |
| CJS    | `dist/index.js`   | CommonJS environments, Jest        |
| Types  | `dist/index.d.ts` | TypeScript consumers               |

---

## 8. User Stories

| ID    | Story                                                                                                                                                   |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| US-01 | As a developer, I want to call `createToast()` with my component map so I get a fully-typed `toast` instance without any manual type annotation.        |
| US-02 | As a developer, I want to place `<ToastProvider>` in my app root once and never touch it again — all configuration lives in `createToast()`.            |
| US-03 | As a developer, I want to import my `toast` instance anywhere in the codebase and call `toast.success()` without passing context or props.              |
| US-04 | As a developer, I want to call `toast.dismiss(id)` programmatically so I can replace a loading toast with a result toast upon API completion.           |
| US-05 | As a design system maintainer, I want to define my toast components once and pass them to `createToast()` so they are used consistently across the app. |
| US-06 | As a developer, I want toasts to be accessible with correct ARIA roles so my app meets WCAG 2.1 AA requirements.                                        |
| US-07 | As a developer, I want toasts to queue when the max is reached so users are not overwhelmed by simultaneous notifications.                              |
| US-08 | As a developer, I want TypeScript to autocomplete and validate the payload I pass to `toast.success()` based on my `SuccessToast` component's props.    |
| US-09 | As a developer, I want to create two isolated `toast` instances — one global, one scoped to a modal — each with their own queue and position.           |
| US-10 | As a developer evaluating the library, I want starter template components I can copy and customise to understand the expected component contract.       |

---

## 9. Phased Roadmap

| Phase   | Version | Target  | Scope                                                                                                                                                                                  |
| ------- | ------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Phase 1 | v1.0    | Q2 2026 | Core library: `createToast()` factory, `<ToastProvider>`, typed toast instance, queue manager, component resolver, TypeScript generics, test suite, starter templates, npm publication |
| Phase 2 | v1.x    | Q3 2026 | CLI scaffolding: `npx twist-toast add success` generates a typed component stub and appends it to the user's `createToast()` config                                                    |
| Phase 3 | v2.0    | Q4 2026 | Multi-framework adapters: Vue 3, Svelte. Framework-agnostic core officially extracted. Hosted docs with interactive playground                                                         |
| Phase 4 | v2.x    | 2027    | Plugin system: middleware hooks for analytics, logging, and remote feature flags. Server-driven toasts via shared state                                                                |

---

## 10. Assumptions & Constraints

### 10.1 Assumptions

- Developers are comfortable creating a dedicated config file (e.g. `toast.config.ts`) and importing from it.
- The `createToast()` pattern will feel familiar to developers who have used libraries like `axios.create()` or `winston.createLogger()`.
- Peer dependency on React (≥ 17) is acceptable; no bundled React copy.
- npm is the primary distribution channel.

### 10.2 Constraints

- Phase 1 must not introduce any runtime dependencies beyond React.
- The `createToast()` → `<ToastProvider>` wiring must work without explicit prop threading — likely achieved via a module-level event bus or React context with a registration pattern.
- Public API surface must remain stable within major versions.
- No proprietary tooling; build with tsup, test with Vitest.

---

## 11. Success Metrics

| Metric                 | Target                                                    |
| ---------------------- | --------------------------------------------------------- |
| Downloads              | ≥ 1,000 weekly npm downloads within 90 days of v1 release |
| Bundle Size            | Tree-shaken build ≤ 5 KB gzipped                          |
| Test Coverage          | ≥ 90% line coverage on core modules                       |
| GitHub Stars           | ≥ 250 stars within 6 months                               |
| Open Issues (critical) | 0 unresolved P0/P1 bugs older than 72 hours               |
| Integration Time       | Install to first toast in ≤ 5 minutes                     |
| TypeScript Adoption    | 100% of public APIs typed — zero implicit `any`           |

---

## 12. Risk Register

| ID      | Risk                                                 | Probability | Impact | Mitigation                                                                                               |
| ------- | ---------------------------------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------- |
| RISK-01 | Naming conflict on npm                               | Medium      | High   | Research available names early; register on project initiation.                                          |
| RISK-02 | `createToast` ↔ `ToastProvider` wiring confusion     | Medium      | Medium | Provide clear error messages when provider is missing; document the 3-step setup with diagrams.          |
| RISK-03 | React API breakage (React 19+)                       | Low         | High   | Monitor React RFC process; pin peer dep range; run CI against React canary.                              |
| RISK-04 | SSR hydration issues with portal                     | Medium      | Medium | Implement portal with `useEffect` guard; add SSR integration tests with Next.js.                         |
| RISK-05 | Multiple instance isolation complexity               | Low         | Medium | Define instance identity strategy early (symbol-keyed context or WeakMap); cover with integration tests. |
| RISK-06 | TypeScript generic complexity deterring contributors | Low         | Low    | Thorough inline comments on type utilities; isolate complex generics in a dedicated `types.ts`.          |

---

## 13. Glossary

| Term               | Definition                                                                                                                       |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `createToast()`    | Factory function that accepts a component map and returns a fully-typed `toast` instance bound to the nearest `<ToastProvider>`. |
| Toast Instance     | The object returned by `createToast()`. Exposes typed trigger methods, `dismiss`, and `dismissAll`.                              |
| Toast Variant      | A named category of toast (e.g. `success`, `error`) that maps to a specific developer-owned component.                           |
| Component Map      | The object passed to `createToast()` mapping variant keys to React components.                                                   |
| Component Resolver | Internal mechanism that maps a variant key to a registered component and renders it with the payload.                            |
| `<ToastProvider>`  | A zero-config React context provider that acts as the rendering anchor for all toast instances registered beneath it.            |
| Payload            | Arbitrary data passed to a toast trigger method, forwarded as props to the rendered component.                                   |
| Portal             | `ReactDOM.createPortal` — renders toasts outside the normal DOM hierarchy.                                                       |
| Toast Manager      | Framework-agnostic state machine handling the queue, timers, and event emission.                                                 |
| BRD                | Business Requirements Document — defines the what and why, not the how.                                                          |

---

## 14. Document History

| Version | Date         | Summary                                              | Author |
| ------- | ------------ | ---------------------------------------------------- | ------ |
| 1.0     | Feb 17, 2026 | Initial Draft — components prop on `<ToastProvider>` | Author |
| 2.0     | Feb 17, 2026 | Revised — `createToast()` factory pattern adopted    | Author |
