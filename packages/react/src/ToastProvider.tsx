import {
  TOAST_POSITIONS,
  type ToastManager,
  type ToastPosition,
  type ToastRecord,
} from "@twist-toast/core";
import type { ComponentType } from "react";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ensureToastMotionStyles } from "./motion-styles";
import { getToastWrapperStyle, getViewportStyle } from "./position-styles";
import {
  getScopeRegistrations,
  registerProviderMount,
  subscribeToScope,
} from "./registry";
import type { ToastProviderProps } from "./types";

interface RenderedToast {
  key: string;
  manager: ToastManager;
  component: ComponentType<any>;
  toast: ToastRecord;
}

const DEFAULT_SCOPE = "default";
const ALERT_LIVE = "assertive";
const STATUS_LIVE = "polite";

function toPayloadProps(payload: unknown): Record<string, unknown> {
  if (typeof payload === "object" && payload !== null) {
    return payload as Record<string, unknown>;
  }

  return {};
}

function collectRenderedToasts(scope: string): RenderedToast[] {
  const registrations = getScopeRegistrations(scope);
  const collected: RenderedToast[] = [];

  for (const registration of registrations) {
    const snapshot = registration.manager.getSnapshot();
    for (const toast of snapshot.visible) {
      const component = registration.components[toast.variant];
      if (!component) {
        continue;
      }

      collected.push({
        key: `${String(registration.id)}:${toast.id}`,
        manager: registration.manager,
        component,
        toast,
      });
    }
  }

  collected.sort((a, b) => a.toast.createdAt - b.toast.createdAt);
  return collected;
}

function groupToastsByPosition(
  toasts: RenderedToast[],
): Map<ToastPosition, RenderedToast[]> {
  const grouped = new Map<ToastPosition, RenderedToast[]>();
  for (const position of TOAST_POSITIONS) {
    grouped.set(position, []);
  }

  for (const toast of toasts) {
    const targetGroup = grouped.get(toast.toast.position);
    if (!targetGroup) {
      continue;
    }
    targetGroup.push(toast);
  }

  return grouped;
}

export function ToastProvider({
  children,
  scope = DEFAULT_SCOPE,
}: ToastProviderProps) {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [registrations, setRegistrations] = useState(() =>
    getScopeRegistrations(scope),
  );
  const [toasts, setToasts] = useState<RenderedToast[]>(() =>
    collectRenderedToasts(scope),
  );

  useEffect(() => {
    const syncRegistrations = () => {
      setRegistrations(getScopeRegistrations(scope));
    };
    syncRegistrations();

    const unsubscribeProvider = registerProviderMount(scope);
    const unsubscribeScope = subscribeToScope(scope, syncRegistrations);

    return () => {
      unsubscribeScope();
      unsubscribeProvider();
    };
  }, [scope]);

  useEffect(() => {
    if (registrations.length === 0) {
      setToasts([]);
      return;
    }

    const syncToasts = () => {
      setToasts(collectRenderedToasts(scope));
    };

    const unsubs = registrations.map((registration) => {
      return registration.manager.subscribe(syncToasts);
    });

    return () => {
      for (const unsubscribe of unsubs) {
        unsubscribe();
      }
    };
  }, [scope, registrations]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    ensureToastMotionStyles();

    const host = document.createElement("div");
    host.setAttribute("data-twist-toast-scope", scope);
    document.body.appendChild(host);
    setPortalElement(host);

    return () => {
      if (host.parentNode) {
        host.parentNode.removeChild(host);
      }
      setPortalElement(null);
    };
  }, [scope]);

  const groupedToasts = useMemo(() => {
    return groupToastsByPosition(toasts);
  }, [toasts]);

  const pausePosition = (position: ToastPosition) => {
    const registrations = getScopeRegistrations(scope);
    for (const registration of registrations) {
      registration.manager.pauseByPosition(position);
    }
  };

  const resumePosition = (position: ToastPosition) => {
    const registrations = getScopeRegistrations(scope);
    for (const registration of registrations) {
      registration.manager.resumeByPosition(position);
    }
  };

  const portal = portalElement
    ? createPortal(
        <>
          {TOAST_POSITIONS.map((position) => {
            const positionToasts = groupedToasts.get(position) ?? [];
            if (positionToasts.length === 0) {
              return null;
            }

            return (
              <div
                key={position}
                aria-label={`Twist Toast ${position}`}
                data-twist-toast-position={position}
                onMouseEnter={() => pausePosition(position)}
                onMouseLeave={() => resumePosition(position)}
                style={getViewportStyle(position)}
              >
                {positionToasts.map((entry) => {
                  const Component = entry.component;
                  const dismiss = () => entry.manager.dismiss(entry.toast.id);

                  return (
                    <div
                      key={entry.key}
                      aria-label={`Toast ${entry.toast.variant}`}
                      data-twist-toast-item=""
                      data-twist-toast-side={
                        position.startsWith("top") ? "top" : "bottom"
                      }
                      onClick={entry.toast.dismissOnClick ? dismiss : undefined}
                      onKeyDown={(event) => {
                        if (event.key !== "Escape") {
                          return;
                        }

                        event.preventDefault();
                        dismiss();
                      }}
                      role="button"
                      style={getToastWrapperStyle(position)}
                      tabIndex={0}
                    >
                      <div
                        aria-atomic="true"
                        aria-live={
                          entry.toast.role === "alert"
                            ? ALERT_LIVE
                            : STATUS_LIVE
                        }
                        data-twist-toast-id={entry.toast.id}
                        data-twist-toast-variant={entry.toast.variant}
                        role={entry.toast.role}
                      >
                        <Component
                          {...toPayloadProps(entry.toast.payload)}
                          dismiss={dismiss}
                          toastId={entry.toast.id}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </>,
        portalElement,
      )
    : null;

  return (
    <>
      {children}
      {portal}
    </>
  );
}
