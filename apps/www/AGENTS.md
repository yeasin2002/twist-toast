# Product Overview

twist-toast is a React toast notification library that solves design lock-in by letting developers own every pixel of the UI while the library manages behavior. this is the landing page and also documentation for the twist-toast product. it includes a pre-built toast template that can be easily customized and deployed on Vercel.

## Key Characteristics

- Developers define their own toast components with full design control
- Library handles state management, queuing, timing, and accessibility
- TypeScript-first with full type inference from component definitions
- Dark/light theme support with seamless switching
- Form handling with validation for contact/signup flows
- Responsive design optimized for all devices
- SEO-ready with proper metadata structure
- MDX support for content-driven pages

## Target Use Case

This site is designed for twist-toast users, a documentation and landing page that showcases the product's capabilities and provides resources for developers to get started. It serves as a central hub for all things twist-toast, including guides, API references, and examples.

<!-- ============================================= -->

# Project Structure

## Directory Organization

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components
│   ├── blocks/      # Page section components (hero, features, etc.)
│   └── ui/          # shadcn/ui base components
├── actions/         # Server actions with next-safe-action
├── lib/             # Utility functions and shared logic
└── styles/          # Global CSS and Tailwind styles

public/              # Static assets (images, fonts, icons)
fonts/               # Custom font files (DM Sans)
.kiro/               # Kiro configuration and steering rules
```

## Key Conventions

### Component Organization

- **blocks/**: Large, page-level sections (Hero, Features, Footer, etc.)
- **ui/**: Reusable shadcn/ui components (Button, Card, Form, etc.)
- Root-level components for shared utilities (Background, ThemeProvider)

### File Naming

- Components use PascalCase: `hero.tsx`, `button.tsx`
- Utilities use kebab-case: `form-schema.ts`, `safe-action.ts`
- All component files use `.tsx` extension
- Configuration files use appropriate extensions (`.mjs`, `.ts`, `.json`)

### Import Order (enforced by ESLint)

1. React and Next.js imports
2. External dependencies
3. Internal imports using `@/*` alias
4. Blank line between groups
5. Alphabetically sorted within groups

### Server Actions Pattern

- Located in `src/actions/`
- Use `"use server"` directive
- Built with `next-safe-action` for type safety
- Input validation via Zod schemas from `src/lib/`

### Styling Approach

- Tailwind utility classes for all styling
- Use `cn()` utility from `@/lib/utils` for conditional classes
- Component variants managed via `class-variance-authority`
- Theme variables defined in `globals.css` using CSS custom properties

### Path Aliases

- `@/components` → `src/components`
- `@/lib` → `src/lib`
- `@/actions` → `src/actions`
- All imports should use `@/*` instead of relative paths when crossing directories

<!-- ========================================================================== -->

# Technology Stack

## Core Framework

- **Next.js 15** with App Router architecture
- **React 19** with Server Components
- **TypeScript** (strict mode enabled)

## Styling & UI

- **Tailwind CSS 4** with PostCSS
- **shadcn/ui** component library (New York style variant)
- **Radix UI** primitives for accessible components
- **Lucide React** + React Icons for iconography
- **Motion** (Framer Motion) for animations
- **next-themes** for dark/light mode theming

## Forms & Validation

- **React Hook Form** for form state management
- **Zod** for schema validation
- **next-safe-action** for type-safe server actions

## Development Tools

- **ESLint** with Next.js, TypeScript, and accessibility plugins
- **Prettier** with Tailwind CSS plugin for code formatting
- **MDX** support via @next/mdx

## Path Aliases

- `@/*` maps to `./src/*`

## Common Commands

### Development

```bash
npm run dev          # Start development server on localhost:3000
npm run build        # Create production build
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint with auto-fix
npm run format       # Format code with Prettier
```

## Build System

- Uses Next.js built-in bundler (Turbopack in dev mode)
- Optimized for Vercel deployment
- MDX compilation integrated into Next.js build pipeline
