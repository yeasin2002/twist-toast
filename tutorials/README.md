# twist-toast Tutorial Series

A comprehensive, step-by-step guide to building a production-ready React toast notification library from scratch.

## Overview

This tutorial series teaches you how to build twist-toast, a React toast notification library that gives developers full design control while managing all the complex behavior. You'll learn advanced TypeScript patterns, React library development, state management, testing strategies, and more.

## What Makes This Different?

Unlike most toast libraries that provide pre-built UI components, twist-toast inverts the relationship: **you own the components, we manage the behavior**. This architectural decision drives everything we build and teaches valuable patterns applicable to any React library.

## Tutorial Index

### [00. Getting Started](./00-getting-started.md)
**Start here!** Learn what you'll build, set up your environment, and understand how to use these tutorials effectively.

- Prerequisites and setup
- Tutorial structure overview
- Learning approach
- Development environment setup
- Additional resources

**Time**: 20 minutes | **Difficulty**: Beginner

---

### [01. Understanding the Architecture](./01-understanding-the-architecture.md)
Learn the high-level design decisions and architectural patterns that make twist-toast work.

- The core problem we're solving
- Four-layer architecture breakdown
- Data flow through the system
- Comparison to other approaches
- Design philosophy and tradeoffs

**Time**: 30 minutes | **Difficulty**: Beginner

---

### [02. Building the Toast Manager](./02-building-the-toast-manager.md)
Implement the framework-agnostic core that manages toast lifecycle, timers, and queuing.

- State machine concepts
- Toast data structures
- Queue management algorithms
- Timer and pause/resume logic
- Subscription pattern implementation
- Testing pure TypeScript

**Time**: 1 hour | **Difficulty**: Intermediate

---

### [03. Factory Pattern and TypeScript Generics](./03-factory-pattern-and-typescript-generics.md)
Create the `createToast()` factory with full type inference using advanced TypeScript patterns.

- TypeScript generics fundamentals
- Mapped types for method generation
- Conditional types for payload extraction
- Type inference in action
- Factory pattern implementation
- Connecting factory to manager

**Time**: 1.5 hours | **Difficulty**: Advanced

---

### [04. React Provider and Portals](./04-react-provider-and-portals.md)
Build the React integration layer using Context API and portals for rendering outside the DOM hierarchy.

- React portals explained
- Event-based registration system
- Provider component implementation
- Portal rendering and positioning
- Toast stacking with flexbox
- Accessibility with ARIA

**Time**: 1 hour | **Difficulty**: Intermediate

---

### [05. Animations and Transitions](./05-animations-and-transitions.md)
Add smooth enter/exit animations while respecting user preferences and maintaining flexibility.

- Animation lifecycle management
- CSS transitions approach
- Configurable animation duration
- Respecting prefers-reduced-motion
- Testing animations with fake timers

**Time**: 45 minutes | **Difficulty**: Intermediate

---

### [06. Testing Strategies](./06-testing-strategies.md)
Write comprehensive tests for each layer using Vitest, React Testing Library, and type testing tools.

- Testing stack setup (Vitest, RTL, tsd)
- Unit testing the manager
- Testing the factory
- React component testing
- Integration tests
- TypeScript type testing
- Coverage goals and strategies

**Time**: 1.5 hours | **Difficulty**: Intermediate

---

### [07. Complete Implementation Guide](./07-complete-implementation-guide.md)
The complete reference implementation with full file structure and all code in one place.

- Complete project structure
- All source files with full implementations
- Build configuration (tsdown)
- Package.json setup
- Export configuration
- Local build and testing

**Time**: 2 hours | **Difficulty**: Intermediate

---

### [08. Creating an Example App](./08-creating-example-app.md)
Build a Next.js example app to test your library locally and create comprehensive demos.

- Setting up Next.js in the monorepo
- Linking local packages
- Creating toast components
- Building comprehensive demos
- Development workflow
- Debugging tips

**Time**: 1 hour | **Difficulty**: Beginner

---

## Learning Paths

### Path 1: Complete Beginner
**Goal**: Learn React library development from scratch

1. Read 00-getting-started.md thoroughly
2. Follow tutorials 01-08 in order
3. Type all code yourself (don't copy-paste)
4. Complete the example app
5. Experiment with modifications

**Time**: 12-15 hours over 1-2 weeks

### Path 2: Experienced Developer
**Goal**: Learn specific patterns and techniques

1. Skim 00-getting-started.md and 01-understanding-the-architecture.md
2. Deep dive into 03-factory-pattern-and-typescript-generics.md
3. Review 06-testing-strategies.md
4. Use 07-complete-implementation-guide.md as reference
5. Build the example app to test

**Time**: 4-6 hours over a weekend

### Path 3: Quick Reference
**Goal**: Look up specific implementations

1. Jump directly to 07-complete-implementation-guide.md
2. Find the specific file/function you need
3. Refer to earlier tutorials for detailed explanations
4. Use 03 for TypeScript patterns
5. Use 06 for testing patterns

**Time**: As needed

## Key Concepts Covered

### React Patterns
- Context API for state sharing
- Portals for rendering outside hierarchy
- Custom hooks for subscriptions
- Component composition
- Event-driven architecture

### TypeScript Advanced Features
- Generic type parameters
- Mapped types
- Conditional types
- Type inference
- Utility types
- Type testing with tsd

### State Management
- Subscription pattern
- Event emitters
- Queue management
- Timer coordination
- Pause/resume logic

### Testing
- Unit testing pure functions
- Integration testing React components
- Type testing
- Mocking and fake timers
- Coverage strategies

### Build & Tooling
- Monorepo with pnpm workspaces
- Turborepo for build orchestration
- tsdown for library bundling
- ESM and CJS dual builds
- TypeScript declaration files

## Prerequisites

- **React**: Comfortable with hooks, context, and component patterns
- **TypeScript**: Basic types and interfaces (we teach advanced patterns)
- **Node.js**: Package management and CLI tools
- **Git**: Version control basics

## What You'll Build

By the end of this series, you'll have:

1. ✅ A complete, production-ready toast notification library
2. ✅ Full TypeScript type safety with automatic inference
3. ✅ Comprehensive test suite with 90%+ coverage
4. ✅ Example app demonstrating all features
5. ✅ Understanding of advanced React and TypeScript patterns
6. ✅ Skills applicable to any React library project

## Code Quality

All code in these tutorials follows best practices:

- **TypeScript strict mode**: No implicit any, full type safety
- **Accessibility**: ARIA roles, keyboard navigation, screen reader support
- **Performance**: Minimal re-renders, efficient subscriptions
- **Testing**: High coverage, integration tests, type tests
- **Documentation**: Inline comments explaining decisions

## Getting Help

If you encounter issues:

1. **Compare your code**: Check against the tutorial examples
2. **Read error messages**: TypeScript errors are usually informative
3. **Use debugging tools**: console.log, React DevTools, browser DevTools
4. **Simplify**: Comment out code until it works, then add back incrementally
5. **Check the complete implementation**: Tutorial 07 has all the code

## Contributing

Found an error or have a suggestion? These tutorials are part of the twist-toast project. Feedback is welcome!

## Next Steps After Completion

Once you've completed the tutorials:

1. **Customize**: Modify the library for your specific needs
2. **Extend**: Add features like progress bars, custom positions, or animations
3. **Publish**: Learn about npm publishing and semantic versioning
4. **Build something else**: Apply these patterns to other library projects
5. **Share**: Teach others what you've learned

## Additional Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vitest Documentation](https://vitest.dev/)
- [pnpm Workspaces](https://pnpm.io/workspaces)

### Related Topics
- [React Portals Deep Dive](https://react.dev/reference/react-dom/createPortal)
- [TypeScript Mapped Types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
- [Semantic Versioning](https://semver.org/)

### Inspiration
- [Radix UI](https://www.radix-ui.com/) - Headless UI components
- [Headless UI](https://headlessui.com/) - Unstyled, accessible components
- [React Hook Form](https://react-hook-form.com/) - Performant form library

## Philosophy

These tutorials embody several principles:

1. **Understanding over memorization**: Learn why, not just how
2. **Real-world focus**: Build something production-ready
3. **Incremental complexity**: Each tutorial adds one layer
4. **Test-driven**: Testing is part of development, not an afterthought
5. **Practical patterns**: Techniques you'll use in real projects

## Ready to Start?

Begin with [00. Getting Started](./00-getting-started.md) to set up your environment and understand the learning approach.

Then dive into [01. Understanding the Architecture](./01-understanding-the-architecture.md) to learn the design philosophy behind twist-toast.

Happy coding! 🚀

---

**Total Time Investment**: 10-15 hours  
**Difficulty Range**: Beginner to Advanced  
**Output**: Production-ready React library with full test coverage
