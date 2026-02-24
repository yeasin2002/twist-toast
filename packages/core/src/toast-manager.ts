import { clampDuration, createToastId } from "./utils";

import { DEFAULT_CONFIG } from "./constants";
import type {
  CreateToastOptions,
  ToastCallOptions,
  ToastManager,
  ToastManagerSnapshot,
  ToastPosition,
  ToastRecord,
  ToastRole,
} from "./types";

interface InternalToastRecord extends ToastRecord {
  payload: unknown;
}

interface TimerState {
  timeoutId: ReturnType<typeof setTimeout> | null;
  startedAt: number;
  remainingMs: number;
  paused: boolean;
  position: ToastPosition;
}

export function createToastManager(
  options: CreateToastOptions = {},
): ToastManager {
  const defaultDuration = clampDuration(
    options.defaultDuration,
    DEFAULT_CONFIG.duration,
  );

  // parse options with defaults
  const defaultPosition = options.defaultPosition ?? DEFAULT_CONFIG.position;
  const maxToasts =
    typeof options.maxToasts === "number" && options.maxToasts > 0
      ? Math.floor(options.maxToasts)
      : DEFAULT_CONFIG.maxToasts;

  const dedupe = options.dedupe ?? "refresh";
  const scope = options.scope ?? DEFAULT_CONFIG.scope;

  // internal state
  const visible: InternalToastRecord[] = [];
  const queued: InternalToastRecord[] = [];
  const timers = new Map<string, TimerState>();
  const listeners = new Set<(snapshot: ToastManagerSnapshot) => void>();
  const pausedPositions = new Set<ToastPosition>();

  function getSnapshot(): ToastManagerSnapshot {
    return {
      visible: [...visible],
      queued: [...queued],
    };
  }

  function emit() {
    const snapshot = getSnapshot();
    for (const listener of listeners) {
      listener(snapshot);
    }
  }

  function clearTimer(toastId: string) {
    const timer = timers.get(toastId);
    if (!timer) return;
    if (timer.timeoutId) clearTimeout(timer.timeoutId);
    timers.delete(toastId);
  }

  function startTimer(toast: InternalToastRecord, duration: number): void {
    clearTimer(toast.id);
    if (duration <= 0) return;
    if (pausedPositions.has(toast.position)) {
      timers.set(toast.id, {
        timeoutId: null,
        startedAt: Date.now(),
        remainingMs: duration,
        paused: true,
        position: toast.position,
      });
      return;
    }

    const timeoutId = setTimeout(() => {
      // Todo:  uncomment when dismiss is ready
      //   dismiss(toast.id);
    }, duration);

    timers.set(toast.id, {
      timeoutId,
      startedAt: Date.now(),
      remainingMs: duration,
      paused: false,
      position: toast.position,
    });
  }

  function promoteQueuedToVisible(): void {
    while (visible.length < maxToasts && queued.length > 0) {
      const next = queued.shift();
      if (!next) {
        break;
      }

      visible.push(next);
      startTimer(next, next.duration);
    }
  }

  function dismiss(toastId: string): void {
    let changed = false;

    const visibleIndex = visible.findIndex((toast) => toast.id === toastId);
    if (visibleIndex >= 0) {
      changed = true;
      const [removed] = visible.splice(visibleIndex, 1);
      if (removed) {
        clearTimer(removed.id);
      }
      promoteQueuedToVisible();
    }

    const queuedIndex = queued.findIndex((toast) => toast.id === toastId);
    if (queuedIndex >= 0) {
      changed = true;
      queued.splice(queuedIndex, 1);
    }

    if (changed) {
      emit();
    }
  }

  function dismissAll(): void {
    if (visible.length === 0 && queued.length === 0) return;

    for (const toast of visible) {
      clearTimer(toast.id);
    }
    visible.length = 0;
    queued.length = 0;
    emit();
  }

  function buildToastRecord(
    variant: string,
    payload: unknown,
    optionsForCall: ToastCallOptions | undefined,
  ): InternalToastRecord {
    const id = optionsForCall?.id ?? createToastId();

    return {
      id,
      variant,
      payload,
      duration: clampDuration(optionsForCall?.duration, defaultDuration),
      position: optionsForCall?.position ?? defaultPosition,
      dismissOnClick: optionsForCall?.dismissOnClick ?? false,
      role: optionsForCall?.role ?? DEFAULT_CONFIG.role,
      scope,
      createdAt: Date.now(),
    };
  }

  function refreshExistingToast(
    existingToastId: string,
    nextToast: InternalToastRecord,
  ): string {
    const existingVisibleIndex = visible.findIndex(
      (toast) => toast.id === existingToastId,
    );
    if (existingVisibleIndex >= 0) {
      visible[existingVisibleIndex] = nextToast;
      startTimer(nextToast, nextToast.duration);
      emit();
      return existingToastId;
    }

    const existingQueuedIndex = queued.findIndex(
      (toast) => toast.id === existingToastId,
    );
    if (existingQueuedIndex >= 0) {
      queued[existingQueuedIndex] = nextToast;
      emit();
      return existingToastId;
    }

    return existingToastId;
  }

  function trigger(
    variant: string,
    payload: unknown,
    optionsForCall: ToastCallOptions = {},
  ): string {
    const nextToast = buildToastRecord(variant, payload, optionsForCall);
    const duplicateToast =
      visible.find((toast) => toast.id === nextToast.id) ??
      queued.find((toast) => toast.id === nextToast.id);

    if (duplicateToast) {
      if (dedupe === "ignore") {
        return duplicateToast.id;
      }

      return refreshExistingToast(duplicateToast.id, nextToast);
    }

    if (visible.length < maxToasts) {
      visible.push(nextToast);
      startTimer(nextToast, nextToast.duration);
    } else {
      queued.push(nextToast);
    }

    emit();
    return nextToast.id;
  }

  function pauseByPosition(position: ToastPosition): void {
    pausedPositions.add(position);

    for (const toast of visible) {
      if (toast.position !== position) {
        continue;
      }

      const timer = timers.get(toast.id);
      if (!timer || timer.paused) {
        continue;
      }

      if (timer.timeoutId) {
        clearTimeout(timer.timeoutId);
      }

      const elapsed = Date.now() - timer.startedAt;
      timer.remainingMs = Math.max(0, timer.remainingMs - elapsed);
      timer.timeoutId = null;
      timer.startedAt = Date.now();
      timer.paused = true;
    }
  }

  function resumeByPosition(position: ToastPosition): void {
    pausedPositions.delete(position);

    const toastIds = visible
      .filter((toast) => toast.position === position)
      .map((toast) => toast.id);

    for (const toastId of toastIds) {
      const timer = timers.get(toastId);
      if (!timer || !timer.paused) {
        continue;
      }

      const duration = Math.max(0, timer.remainingMs);
      if (duration <= 0) {
        dismiss(toastId);
        continue;
      }

      const timeoutId = setTimeout(() => {
        dismiss(toastId);
      }, duration);

      timer.timeoutId = timeoutId;
      timer.startedAt = Date.now();
      timer.remainingMs = duration;
      timer.paused = false;
    }
  }

  function subscribe(
    listener: (snapshot: ToastManagerSnapshot) => void,
  ): () => void {
    listeners.add(listener);
    listener(getSnapshot());

    return () => {
      listeners.delete(listener);
    };
  }

  function destroy(): void {
    dismissAll();
    listeners.clear();
    pausedPositions.clear();

    for (const [, timer] of timers) {
      if (timer.timeoutId) {
        clearTimeout(timer.timeoutId);
      }
    }
    timers.clear();
  }

  return {
    trigger,
    dismiss,
    dismissAll,
    pauseByPosition,
    resumeByPosition,
    getSnapshot,
    subscribe,
    destroy,
  };
}
