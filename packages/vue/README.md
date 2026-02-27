# @twist-toast/vue

Starter scaffold for the future Vue adapter of `twist-toast`.

Current status:

- Not production-ready
- No adapter logic yet
- Kept intentionally minimal so Vue work can start quickly later

## Package purpose

This package exists to lock baseline tooling and workspace conventions now:

- Build with `tsdown`
- Type-check with `vue-tsc`
- Keep shared dependency versions aligned through pnpm `catalog:`

## Scripts

```bash
pnpm --filter @twist-toast/vue build
pnpm --filter @twist-toast/vue dev
pnpm --filter @twist-toast/vue test
pnpm --filter @twist-toast/vue check-types
```

## Notes

- Package is currently marked `"private": true`.
- When Vue adapter work starts, first milestone should define:
  - public API surface
  - provider/composable contract
  - parity expectations with `@twist-toast/react`
