"use client";

import type { CSSProperties, ReactNode } from "react";
import { useMemo, useState } from "react";

import styles from "./goey-toast.module.css";
import type { GoeyToastComponentProps, GoeyToastVariant } from "./types";

import { cn } from "@/lib/utils";

type GoeyPalette = {
  accent: string;
  border: string;
  fill: string;
  description: string;
  actionBg: string;
  actionText: string;
};

type GoeyToastBaseProps = GoeyToastComponentProps & {
  variant: GoeyToastVariant;
  icon: ReactNode;
  defaultMessage: string;
  defaultDescription?: string;
  defaultActionLabel?: string;
  defaultShowProgress?: boolean;
};

const VARIANT_STYLES: Record<GoeyToastVariant, GoeyPalette> = {
  default: {
    accent: "#555555",
    border: "#e7e7e7",
    fill: "#ffffff",
    description: "#444444",
    actionBg: "#e8e8e8",
    actionText: "#555555",
  },
  success: {
    accent: "#4CAF50",
    border: "#cdeace",
    fill: "#ffffff",
    description: "#2f4a30",
    actionBg: "#c8e6c9",
    actionText: "#2f7c33",
  },
  error: {
    accent: "#E53935",
    border: "#f2c3c2",
    fill: "#ffffff",
    description: "#5a2f2e",
    actionBg: "#ffcdd2",
    actionText: "#b92f2b",
  },
  warning: {
    accent: "#C49000",
    border: "#f2dc9e",
    fill: "#ffffff",
    description: "#594b1c",
    actionBg: "#ffecb3",
    actionText: "#946e00",
  },
  info: {
    accent: "#1E88E5",
    border: "#bfdffb",
    fill: "#ffffff",
    description: "#264764",
    actionBg: "#bbdefb",
    actionText: "#1765aa",
  },
  loading: {
    accent: "#555555",
    border: "#e7e7e7",
    fill: "#ffffff",
    description: "#444444",
    actionBg: "#e8e8e8",
    actionText: "#555555",
  },
  description: {
    accent: "#C49000",
    border: "#f2dc9e",
    fill: "#ffffff",
    description: "#594b1c",
    actionBg: "#ffecb3",
    actionText: "#946e00",
  },
  action: {
    accent: "#1E88E5",
    border: "#bfdffb",
    fill: "#ffffff",
    description: "#264764",
    actionBg: "#bbdefb",
    actionText: "#1765aa",
  },
};

export function GoeyToastBase({
  variant,
  icon,
  message,
  description,
  actionLabel,
  actionSuccessLabel,
  showProgress,
  durationMs,
  className,
  defaultMessage,
  defaultDescription,
  defaultActionLabel,
  defaultShowProgress,
  dismiss,
}: GoeyToastBaseProps) {
  const [actionComplete, setActionComplete] = useState(false);

  const palette = VARIANT_STYLES[variant];
  const displayMessage =
    actionComplete && actionSuccessLabel
      ? actionSuccessLabel
      : (message ?? defaultMessage);
  const displayDescription = actionComplete
    ? undefined
    : (description ?? defaultDescription);
  const displayAction = actionComplete
    ? undefined
    : (actionLabel ?? defaultActionLabel);

  const expanded = Boolean(displayDescription || displayAction);
  const shouldShowProgress = showProgress ?? defaultShowProgress ?? false;
  const role = variant === "error" || variant === "warning" ? "alert" : "status";
  const progressDuration = Math.max(durationMs ?? 4000, 1000);

  const cssVars = useMemo(
    () =>
      ({
        "--goey-accent": palette.accent,
        "--goey-border": palette.border,
        "--goey-fill": palette.fill,
        "--goey-description": palette.description,
        "--goey-action-bg": palette.actionBg,
        "--goey-action-text": palette.actionText,
        "--goey-progress-duration": `${progressDuration}ms`,
      }) as CSSProperties,
    [palette, progressDuration],
  );

  const handleAction = () => {
    if (actionSuccessLabel) {
      setActionComplete(true);
      window.setTimeout(() => setActionComplete(false), 950);
      return;
    }

    dismiss?.();
  };

  return (
    <div
      aria-atomic="true"
      aria-live={role === "alert" ? "assertive" : "polite"}
      className={cn(
        styles.shell,
        expanded && styles.expanded,
        variant === "error" && styles.error,
        className,
      )}
      role={role}
      style={cssVars}
    >
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <div className={styles.header}>
            <span className={styles.icon}>{icon}</span>
            <span className={styles.title}>{displayMessage}</span>
          </div>

          {displayDescription ? (
            <p className={styles.description}>{displayDescription}</p>
          ) : null}

          {displayAction ? (
            <button
              className={styles.actionButton}
              onClick={handleAction}
              type="button"
            >
              {displayAction}
            </button>
          ) : null}

          {shouldShowProgress ? (
            <div className={styles.progressTrack}>
              <div className={styles.progressBar} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
