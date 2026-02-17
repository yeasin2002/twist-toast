# Product Overview

twist-toast is a React toast notification library that solves design lock-in by letting developers own every pixel of the UI while the library manages behavior.

## Core Value Proposition

- Developers define their own toast components with full design control
- Library handles state management, queuing, timing, and accessibility
- Zero runtime dependencies beyond React
- TypeScript-first with full type inference from component definitions

## Key Features

- `createToast()` factory pattern for typed toast instances
- Zero-config `<ToastProvider>` wrapper
- Queue management with configurable limits
- Deduplication and programmatic dismissal
- Pause on hover, keyboard accessible
- Support for custom variants (success, error, warning, info, custom)
- Multiple isolated toast instances per app

## Target Users

- React developers who need toast notifications aligned with their design system
- Design system teams requiring brand consistency
- Teams that want minimal integration overhead (install → configure → use in under 5 minutes)

## Phase 1 Scope

React 17+ support with TypeScript generics, comprehensive testing, and npm publication. Future phases will add CLI tooling and multi-framework support.
