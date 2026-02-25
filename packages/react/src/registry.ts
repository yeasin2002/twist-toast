import type { ToastManager } from "@twist-toast/core";
import type { ComponentType } from "react";

export interface ToastRegistration {
  id: symbol;
  scope: string;
  manager: ToastManager;
  components: Record<string, ComponentType<any>>;
}

const registrationsByScope = new Map<string, Map<symbol, ToastRegistration>>();
const listenersByScope = new Map<string, Set<() => void>>();
const mountedProvidersByScope = new Map<string, number>();
const warnedScopesWithoutProvider = new Set<string>();

function notifyScope(scope: string): void {
  const listeners = listenersByScope.get(scope);
  if (!listeners) {
    return;
  }

  for (const listener of listeners) {
    listener();
  }
}

export function registerToastRegistration(
  registration: ToastRegistration,
): () => void {
  const scopedRegistrations =
    registrationsByScope.get(registration.scope) ?? new Map();
  scopedRegistrations.set(registration.id, registration);
  registrationsByScope.set(registration.scope, scopedRegistrations);
  notifyScope(registration.scope);

  return () => {
    const currentScopeRegistrations = registrationsByScope.get(
      registration.scope,
    );
    if (!currentScopeRegistrations) {
      return;
    }

    currentScopeRegistrations.delete(registration.id);
    if (currentScopeRegistrations.size === 0) {
      registrationsByScope.delete(registration.scope);
    }

    notifyScope(registration.scope);
  };
}

export function getScopeRegistrations(scope: string): ToastRegistration[] {
  const registrations = registrationsByScope.get(scope);
  if (!registrations) {
    return [];
  }

  return Array.from(registrations.values());
}

export function subscribeToScope(
  scope: string,
  listener: () => void,
): () => void {
  const listeners = listenersByScope.get(scope) ?? new Set();
  listeners.add(listener);
  listenersByScope.set(scope, listeners);

  return () => {
    const currentListeners = listenersByScope.get(scope);
    if (!currentListeners) {
      return;
    }

    currentListeners.delete(listener);
    if (currentListeners.size === 0) {
      listenersByScope.delete(scope);
    }
  };
}

export function registerProviderMount(scope: string): () => void {
  const currentCount = mountedProvidersByScope.get(scope) ?? 0;
  mountedProvidersByScope.set(scope, currentCount + 1);

  return () => {
    const latestCount = mountedProvidersByScope.get(scope) ?? 0;
    const nextCount = latestCount - 1;
    if (nextCount <= 0) {
      mountedProvidersByScope.delete(scope);
      return;
    }

    mountedProvidersByScope.set(scope, nextCount);
  };
}

export function ensureProviderPresence(scope: string): void {
  const mountedCount = mountedProvidersByScope.get(scope) ?? 0;
  if (mountedCount > 0) {
    return;
  }

  if (warnedScopesWithoutProvider.has(scope)) {
    return;
  }

  warnedScopesWithoutProvider.add(scope);
  console.warn(
    `[twist-toast] No mounted ToastProvider found for scope "${scope}". Add <ToastProvider scope="${scope}" /> to render toasts.`,
  );
}
