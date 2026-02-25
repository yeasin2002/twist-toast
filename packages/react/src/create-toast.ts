import { createToastManager } from "@twist-toast/core";
import type { ComponentProps, ComponentType } from "react";
import { ensureProviderPresence, registerToastRegistration } from "./registry";
import type {
  CreateToastOptions,
  ToastCallOptions,
  ToastInstance,
  ToastVariant,
} from "./types";

const DEFAULT_SCOPE = "default";

type ComponentMap = Record<string, ComponentType<any>>;

export function createToast<TComponents extends ComponentMap>(
  components: TComponents,
  options: CreateToastOptions = {},
): ToastInstance<TComponents> {
  const scope = options.scope ?? DEFAULT_SCOPE;
  const manager = createToastManager({ ...options, scope });
  const registrationId = Symbol(`twist-toast:${scope}`);

  registerToastRegistration({
    id: registrationId,
    scope,
    manager,
    components: components as ComponentMap,
  });

  const show = <K extends ToastVariant<TComponents>>(
    variant: K,
    payload: Omit<ComponentProps<TComponents[K]>, "toastId" | "dismiss">,
    callOptions?: ToastCallOptions,
  ): string => {
    ensureProviderPresence(scope);
    return manager.trigger(variant, payload, callOptions);
  };

  const variantMethods: Record<
    string,
    (payload: Record<string, unknown>, callOptions?: ToastCallOptions) => string
  > = {};
  for (const variant of Object.keys(
    components,
  ) as ToastVariant<TComponents>[]) {
    variantMethods[variant] = (
      payload: Record<string, unknown>,
      callOptions?: ToastCallOptions,
    ) => {
      return show(
        variant,
        payload as Omit<
          ComponentProps<TComponents[typeof variant]>,
          "toastId" | "dismiss"
        >,
        callOptions,
      );
    };
  }

  const toastInstance = {
    ...variantMethods,
    show,
    dismiss: (id: string) => manager.dismiss(id),
    dismissAll: () => manager.dismissAll(),
    scope,
  } as ToastInstance<TComponents>;

  return toastInstance;
}
