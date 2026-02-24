export type ToastPosition =
  | "top-left"
  | "top-right"
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

export type ToastRole = "alert" | "status";

export type ToastDeduplication = "refresh" | "ignore";

export type ToastCallOptions = {
  id?: string;
  duration?: number;
  position?: ToastPosition;
  dismissOnClick?: boolean;
  role?: ToastRole;
};

export interface CreateToastOptions {
  defaultDuration?: number;
  defaultPosition?: ToastPosition;
  maxToasts?: number;
  dedupe?: ToastDeduplication;
  scope?: string;
}

export interface ToastRecord<T = unknown> {
  id: string;
  variant: string;
  payload: T;
  duration: number;
  position: ToastPosition;
  dismissOnClick: boolean;
  role: ToastRole;
  scope: string;
  createdAt: number;
}

export interface ToastManagerSnapshot<TPayload = unknown> {
  visible: ToastRecord<TPayload>[];
  queued: ToastRecord<TPayload>[];
}

export interface ToastManager {
  trigger(
    variant: string,
    payload: unknown,
    options?: ToastCallOptions,
  ): string;
  dismiss(id: string): void;
  dismissAll(): void;
  pauseByPosition(position: ToastPosition): void;
  resumeByPosition(position: ToastPosition): void;
  getSnapshot(): ToastManagerSnapshot;
  subscribe(listener: (snapshot: ToastManagerSnapshot) => void): () => void;
  destroy(): void;
}
