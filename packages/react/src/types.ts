import type { ComponentProps, ComponentType, ReactNode } from "react";
import type { CreateToastOptions, ToastCallOptions } from "@twist-toast/core";

export type ToastComponentProps<
  TPayload extends object = Record<string, never>,
> = TPayload & {
  toastId: string;
  dismiss: () => void;
};

export type ToastVariant<TComponents> = Extract<keyof TComponents, string>;

export interface ToastProviderProps {
  children: ReactNode;
  scope?: string;
}

type PublicComponentProps<TComponent extends ComponentType<any>> = Omit<
  ComponentProps<TComponent>,
  "toastId" | "dismiss"
>;

export type ToastInstance<
  TComponents extends Record<string, ComponentType<any>>,
> = {
  [K in ToastVariant<TComponents>]: (
    payload: PublicComponentProps<TComponents[K]>,
    options?: ToastCallOptions,
  ) => string;
} & {
  show<K extends ToastVariant<TComponents>>(
    variant: K,
    payload: PublicComponentProps<TComponents[K]>,
    options?: ToastCallOptions,
  ): string;
  dismiss(id: string): void;
  dismissAll(): void;
  scope: string;
};

export type { CreateToastOptions, ToastCallOptions };
