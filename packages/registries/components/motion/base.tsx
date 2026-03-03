"use client";

import type { CSSProperties, MouseEvent, ReactNode } from "react";
import {
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./sileo-toast.module.css";
import { SileoLoaderCircleIcon, getSileoStateIcon } from "./icons";
import type {
  SileoToastButton,
  SileoToastComponentProps,
  SileoToastVariant,
} from "./types";

import { cn } from "@twist-toast/ui/lib/utils";

const HEIGHT = 40;
const WIDTH = 350;
const DEFAULT_ROUNDNESS = 16;
const DEFAULT_TOAST_DURATION = 6000;
const DEFAULT_EXPAND_DELAY = 150;
const DEFAULT_COLLAPSE_DELAY = 4000;
const MIN_EXPAND_RATIO = 2.25;
const PILL_PADDING = 10;
const BLUR_RATIO = 0.5;

type SileoToastBaseProps = SileoToastComponentProps & {
  variant: SileoToastVariant;
  defaultTitle: string;
  defaultDescription?: ReactNode | string;
  defaultButton?: SileoToastButton;
};

const STATE_COLOR: Record<SileoToastVariant, string> = {
  success: "oklch(0.723 0.219 142.136)",
  loading: "oklch(0.556 0 0)",
  error: "oklch(0.637 0.237 25.331)",
  warning: "oklch(0.795 0.184 86.047)",
  info: "oklch(0.685 0.169 237.323)",
  action: "oklch(0.623 0.214 259.815)",
};

function clampDelay(value: number, max: number) {
  return Math.min(max, Math.max(0, value));
}

export function SileoToastBase({
  variant,
  defaultTitle,
  defaultDescription,
  defaultButton,
  title,
  message,
  description,
  icon,
  styles: styleOverrides,
  fill = "#FFFFFF",
  roundness,
  durationMs,
  autopilot,
  align = "right",
  button,
  className,
  dismiss,
  toastId,
}: SileoToastBaseProps) {
  const uniqueId = useId();
  const filterId = useMemo(
    () => `sileo-gooey-${uniqueId.replace(/[:]/g, "")}-${toastId ?? "toast"}`,
    [toastId, uniqueId],
  );

  const resolvedTitle = title ?? message ?? defaultTitle;
  const resolvedDescription = description ?? defaultDescription;
  const resolvedButton = button ?? defaultButton;

  const hasDescription = Boolean(resolvedDescription);
  const hasButton = Boolean(resolvedButton);
  const hasContent = hasDescription || hasButton;
  const canExpand = hasContent && variant !== "loading";

  const [isExpanded, setIsExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const [pillWidth, setPillWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  const headerInnerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useLayoutEffect(() => {
    const element = headerInnerRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      const width = element.scrollWidth + 16 + PILL_PADDING;
      setPillWidth((prev) => (prev === width ? prev : width));
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [resolvedTitle, icon, styleOverrides?.title, variant]);

  useLayoutEffect(() => {
    if (!hasContent) {
      setContentHeight(0);
      return;
    }

    const element = contentRef.current;
    if (!element) {
      return;
    }

    const measure = () => {
      const height = element.scrollHeight;
      setContentHeight((prev) => (prev === height ? prev : height));
    };

    measure();

    if (typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [hasContent, resolvedDescription, resolvedButton?.title]);

  useEffect(() => {
    if (!canExpand) {
      setIsExpanded(false);
      return;
    }

    const mode = autopilot ?? true;
    if (mode === false || durationMs === null || durationMs === 0) {
      return;
    }

    const totalDuration = Math.max(durationMs ?? DEFAULT_TOAST_DURATION, 0);
    const config = typeof mode === "object" ? mode : undefined;
    const expandDelay = clampDelay(
      config?.expand ?? DEFAULT_EXPAND_DELAY,
      totalDuration,
    );
    const collapseDelay = clampDelay(
      config?.collapse ?? DEFAULT_COLLAPSE_DELAY,
      totalDuration,
    );

    const expandTimer = window.setTimeout(
      () => setIsExpanded(true),
      expandDelay,
    );
    const collapseTimer = window.setTimeout(
      () => setIsExpanded(false),
      collapseDelay,
    );

    return () => {
      window.clearTimeout(expandTimer);
      window.clearTimeout(collapseTimer);
    };
  }, [
    autopilot,
    canExpand,
    durationMs,
    resolvedDescription,
    resolvedButton?.title,
  ]);

  const open = canExpand && isExpanded;
  const minExpandedBodyHeight = HEIGHT * MIN_EXPAND_RATIO - HEIGHT;
  const bodyHeight = open ? Math.max(contentHeight, minExpandedBodyHeight) : 0;
  const totalHeight = HEIGHT + bodyHeight;

  const safePillWidth = Math.max(112, Math.min(WIDTH, pillWidth || 180));
  const pillX =
    align === "center"
      ? (WIDTH - safePillWidth) / 2
      : align === "left"
        ? 0
        : WIDTH - safePillWidth;
  const radius = Math.max(0, roundness ?? DEFAULT_ROUNDNESS);

  const role =
    variant === "error" || variant === "warning" ? "alert" : "status";
  const resolvedIcon =
    icon === null
      ? null
      : (icon ??
        (variant === "loading" ? (
          <SileoLoaderCircleIcon className={styles.iconSpin} />
        ) : (
          getSileoStateIcon(variant)
        )));

  const rootStyle = useMemo(
    () =>
      ({
        "--_h": `${totalHeight}px`,
        "--_co": open ? 1 : 0,
        "--sileo-color": STATE_COLOR[variant],
        "--sileo-fill": fill,
      }) as CSSProperties,
    [fill, open, totalHeight, variant],
  );

  const headerStyle = useMemo(
    () =>
      ({
        left: `${open ? 0 : pillX}px`,
        maxWidth: `${open ? WIDTH : safePillWidth}px`,
      }) as CSSProperties,
    [open, pillX, safePillWidth],
  );

  const handleMouseEnter = () => {
    if (canExpand) {
      setIsExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (canExpand) {
      setIsExpanded(false);
    }
  };

  const handleButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    resolvedButton?.onClick?.();
    dismiss?.();
  };

  return (
    <div
      aria-atomic="true"
      aria-live={role === "alert" ? "assertive" : "polite"}
      className={cn(styles.toast, ready && styles.ready, className)}
      data-state={variant}
      role={role}
      style={rootStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.canvas}>
        <svg
          className={styles.svg}
          height={totalHeight}
          viewBox={`0 0 ${WIDTH} ${totalHeight}`}
          width={WIDTH}
        >
          <title>Sileo Toast</title>
          <defs>
            <filter
              colorInterpolationFilters="sRGB"
              height="140%"
              id={filterId}
              width="140%"
              x="-20%"
              y="-20%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                result="blur"
                stdDeviation={radius * BLUR_RATIO}
              />
              <feColorMatrix
                in="blur"
                mode="matrix"
                result="goo"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -10"
              />
              <feComposite in="SourceGraphic" in2="goo" operator="atop" />
            </filter>
          </defs>

          <g filter={`url(#${filterId})`}>
            <rect
              className={styles.pill}
              fill={fill}
              height={HEIGHT}
              rx={radius}
              ry={radius}
              width={open ? WIDTH : safePillWidth}
              x={open ? 0 : pillX}
              y={0}
            />
            <rect
              className={styles.body}
              fill={fill}
              height={open ? bodyHeight : 0}
              rx={radius}
              ry={radius}
              width={WIDTH}
              x={0}
              y={HEIGHT}
            />
          </g>
        </svg>
      </div>

      <div className={styles.header} style={headerStyle}>
        <div className={styles.headerInner} ref={headerInnerRef}>
          {resolvedIcon ? (
            <span className={cn(styles.badge, styleOverrides?.badge)}>
              {resolvedIcon}
            </span>
          ) : null}
          <span className={cn(styles.title, styleOverrides?.title)}>
            {resolvedTitle}
          </span>
        </div>
      </div>

      {hasContent ? (
        <div className={cn(styles.content, open && styles.contentVisible)}>
          <div
            className={cn(styles.description, styleOverrides?.description)}
            ref={contentRef}
          >
            {resolvedDescription}
            {resolvedButton ? (
              <button
                className={cn(styles.button, styleOverrides?.button)}
                onClick={handleButtonClick}
                type="button"
              >
                {resolvedButton.title}
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
