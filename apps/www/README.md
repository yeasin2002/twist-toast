# `apps/www`

Documentation and landing site for `twist-toast`, built with Next.js App Router.

## Local development

```bash
pnpm --dir apps/www dev
```

Build and start:

```bash
pnpm --dir apps/www build
pnpm --dir apps/www start
```

## Landing page structure

Home page composition lives in:

- `src/app/page.tsx`

Landing sections are split by responsibility under:

- `src/components/landing/hero-section.tsx`
- `src/components/landing/playground-section.tsx`
- `src/components/landing/docs-section.tsx`
- `src/components/landing/api-section.tsx`
- `src/components/landing/data.ts`
- `src/components/landing/primitives.tsx`

Global shell components:

- `src/components/blocks/navbar.tsx`
- `src/components/blocks/footer.tsx`
