# Getting Started with twist-toast Development

## Welcome

This tutorial series will teach you how to build twist-toast from scratch. You'll learn about React library development, TypeScript generics, state management patterns, and testing strategies. By the end, you'll have a complete, production-ready toast notification library.

## What You'll Build

twist-toast is a React toast notification library with a unique approach: **you own the UI, we manage the behavior**. Unlike traditional toast libraries that come with pre-built components and styles, twist-toast lets developers bring their own components while handling all the complex state management, queuing, timing, and accessibility concerns.

### Key Features

- **Factory pattern**: `createToast()` generates a fully-typed toast instance
- **Zero-config provider**: `<ToastProvider>` wraps your app with no props needed
- **TypeScript-first**: Full type inference from your component definitions
- **Queue management**: Automatic queuing with configurable limits
- **Pause on hover**: Better UX for reading notifications
- **Accessibility**: Built-in ARIA support
- **Framework-agnostic core**: Pure TypeScript state machine

## Prerequisites

Before starting, you should be comfortable with:

- **React**: Hooks, context, portals, component patterns
- **TypeScript**: Basic types, interfaces, generics (we'll teach advanced patterns)
- **Node.js**: Package management, build tools
- **Git**: Version control basics

You don't need to be an expert in any of these, but familiarity will help you follow along.

## Tutorial Structure

The tutorials are designed to be followed in order, building on concepts from previous lessons:

### 01. Understanding the Architecture
Learn the high-level design decisions and why we made them. Understand the four-layer architecture and how data flows through the system.

**Time**: 30 minutes  
**Difficulty**: Beginner  
**Topics**: Architecture patterns, separation of concerns, design philosophy

### 02. Building the Toast Manager
Implement the core state machine that manages toast lifecycle, timers, and queuing. This is pure TypeScript with no React dependencies.

**Time**: 1 hour  
**Difficulty**: Intermediate  
**Topics**: State machines, subscription patterns, timer management, queue algorithms

### 03. Factory Pattern and TypeScript Generics
Create the `createToast()` factory that generates typed toast instances. Learn advanced TypeScript patterns like mapped types, conditional types, and type inference.

**Time**: 1.5 hours  
**Difficulty**: Advanced  
**Topics**: TypeScript generics, mapped types, conditional types, type inference, factory pattern

### 04. React Provider and Portals
Build the React integration layer using Context API and portals. Learn how to render components outside the normal DOM hierarchy while maintaining React's component relationships.

**Time**: 1 hour  
**Difficulty**: Intermediate  
**Topics**: React Context, portals, event-driven architecture, DOM manipulation

### 05. Animations and Transitions
Add smooth enter/exit animations using CSS transitions. Learn how to coordinate animations with React's lifecycle and respect user preferences.

**Time**: 45 minutes  
**Difficulty**: Intermediate  
**Topics**: CSS transitions, animation lifecycle, accessibility (prefers-reduced-motion)

### 06. Testing Strategies
Write comprehensive tests for each layer using Vitest and React Testing Library. Learn how to test pure TypeScript, React components, and TypeScript types.

**Time**: 1.5 hours  
**Difficulty**: Intermediate  
**Topics**: Unit testing, integration testing, type testing, mocking, fake timers

### 07. Complete Implementation Guide
Bring everything together with the complete file structure and implementation. This is your reference for the final codebase.

**Time**: 2 hours  
**Difficulty**: Intermediate  
**Topics**: Project organization, build configuration, module exports, package.json setup

### 08. Creating an Example App
Build a Next.js example app to test your library locally. Learn how to link local packages and create comprehensive demos.

**Time**: 1 hour  
**Difficulty**: Beginner  
**Topics**: Monorepo development, local package linking, demo creation

## Total Time Commitment

- **Reading**: ~4 hours
- **Coding**: ~6-8 hours
- **Testing**: ~2 hours

You can complete the entire series in a weekend, or spread it out over a week.

## Learning Approach

Each tutorial follows this structure:

1. **Introduction**: What you'll build and why
2. **Concepts**: Theoretical background and design decisions
3. **Implementation**: Step-by-step code with detailed explanations
4. **Testing**: How to verify your implementation works
5. **Key Takeaways**: Summary of important concepts

### Code Examples

All code examples are complete and runnable. You can copy-paste them directly into your project. We explain not just *what* the code does, but *why* we wrote it that way.

### Explanations

We prioritize understanding over memorization. Each decision is explained:
- Why this pattern over alternatives?
- What are the tradeoffs?
- When would you choose differently?

## Setting Up Your Environment

Before starting Tutorial 01, set up your development environment:

### 1. Install Node.js

You need Node.js 18 or higher:

```bash
node --version  # Should be 18.0.0 or higher
```

Download from [nodejs.org](https://nodejs.org/) if needed.

### 2. Install pnpm

We use pnpm for package management:

```bash
npm install -g pnpm
pnpm --version  # Should be 10.0.0 or higher
```

### 3. Clone or Create the Monorepo

If you're starting from scratch:

```bash
mkdir twist-toast
cd twist-toast
pnpm init
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - apps/*
  - packages/*
```

Create the package structure:

```bash
mkdir -p packages/twist-toast/src
mkdir -p apps/example
```

### 4. Install Development Tools

Install your preferred code editor. We recommend:
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Error Lens (shows errors inline)

### 5. Verify Setup

Create a test file to verify TypeScript works:

```typescript
// packages/twist-toast/src/test.ts
const greeting: string = "Hello, TypeScript!";
console.log(greeting);
```

If your editor shows type checking, you're ready!

## How to Use These Tutorials

### For Learners

If you're learning library development:

1. **Read sequentially**: Start with Tutorial 01 and work through in order
2. **Type the code**: Don't just copy-paste; typing helps you learn
3. **Experiment**: Try modifying the code to see what happens
4. **Take breaks**: These are dense tutorials; don't rush

### For Experienced Developers

If you're already familiar with React and TypeScript:

1. **Skim Tutorial 01**: Get the architecture overview
2. **Focus on Tutorials 03 and 06**: Advanced TypeScript and testing
3. **Use Tutorial 07 as reference**: Jump to specific implementations
4. **Adapt to your needs**: Take what's useful, modify what isn't

### For Reference

If you're coming back to look something up:

1. **Tutorial 07**: Complete implementation reference
2. **Tutorial 03**: TypeScript type system patterns
3. **Tutorial 06**: Testing patterns and examples
4. **Tutorial 02**: State management patterns

## Getting Help

If you get stuck:

1. **Check the code**: Compare your code to the tutorial examples
2. **Read error messages**: TypeScript errors are usually helpful
3. **Use console.log**: Debug by logging state at each step
4. **Simplify**: Comment out code until it works, then add back piece by piece

## What's Next?

Ready to start? Head to **Tutorial 01: Understanding the Architecture** to learn about the design decisions behind twist-toast.

## Additional Resources

### React Documentation
- [React Hooks](https://react.dev/reference/react)
- [React Context](https://react.dev/learn/passing-data-deeply-with-context)
- [React Portals](https://react.dev/reference/react-dom/createPortal)

### TypeScript Documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html)
- [Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Conditional Types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)

### Testing
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Library User Event](https://testing-library.com/docs/user-event/intro)

### Build Tools
- [tsdown Documentation](https://tsdown.vercel.app/)
- [Turborepo Documentation](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)

## Philosophy

These tutorials embody several principles:

1. **Teach concepts, not just code**: Understanding why is more valuable than memorizing how
2. **Show tradeoffs**: Every decision has alternatives; we explain the reasoning
3. **Build incrementally**: Each tutorial adds one layer of complexity
4. **Test everything**: Testing is not optional; it's part of the development process
5. **Real-world focus**: We build something you could actually publish and maintain

## Let's Begin!

You're now ready to start building twist-toast. Head to **Tutorial 01: Understanding the Architecture** to begin your journey into React library development.

Happy coding! 🚀
