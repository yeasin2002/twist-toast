import type { ToastPosition } from "@twist-toast/core";
import type { CSSProperties } from "react";

const EDGE_OFFSET = 16;

export const TOAST_VIEWPORT_BASE_STYLE: CSSProperties = {
  position: "fixed",
  zIndex: 9999,
  display: "flex",
  gap: 8,
  pointerEvents: "none",
  width: "min(420px, calc(100vw - 32px))",
};

export const TOAST_WRAPPER_STYLE: CSSProperties = {
  pointerEvents: "auto",
  width: "100%",
};

type MotionCSSProperties = CSSProperties & Record<`--${string}`, string>;

export function getToastWrapperStyle(position: ToastPosition): CSSProperties {
  const enterDistanceX = position.endsWith("left")
    ? "-8px"
    : position.endsWith("right")
      ? "8px"
      : "0px";
  const enterDistanceY = position.startsWith("top") ? "-8px" : "8px";

  const style: MotionCSSProperties = {
    ...TOAST_WRAPPER_STYLE,
    "--twist-toast-enter-distance-x": enterDistanceX,
    "--twist-toast-enter-distance-y": enterDistanceY,
  };

  return style;
}

export function getViewportStyle(position: ToastPosition): CSSProperties {
  switch (position) {
    case "top-right":
      return {
        ...TOAST_VIEWPORT_BASE_STYLE,
        top: EDGE_OFFSET,
        right: EDGE_OFFSET,
        alignItems: "stretch",
        flexDirection: "column",
      };
    case "top-left":
      return {
        ...TOAST_VIEWPORT_BASE_STYLE,
        top: EDGE_OFFSET,
        left: EDGE_OFFSET,
        alignItems: "stretch",
        flexDirection: "column",
      };
    case "bottom-right":
      return {
        ...TOAST_VIEWPORT_BASE_STYLE,
        bottom: EDGE_OFFSET,
        right: EDGE_OFFSET,
        alignItems: "stretch",
        flexDirection: "column-reverse",
      };
    case "bottom-left":
      return {
        ...TOAST_VIEWPORT_BASE_STYLE,
        bottom: EDGE_OFFSET,
        left: EDGE_OFFSET,
        alignItems: "stretch",
        flexDirection: "column-reverse",
      };
    case "top-center":
      return {
        ...TOAST_VIEWPORT_BASE_STYLE,
        top: EDGE_OFFSET,
        left: "50%",
        transform: "translateX(-50%)",
        alignItems: "stretch",
        flexDirection: "column",
      };
    case "bottom-center":
      return {
        ...TOAST_VIEWPORT_BASE_STYLE,
        bottom: EDGE_OFFSET,
        left: "50%",
        transform: "translateX(-50%)",
        alignItems: "stretch",
        flexDirection: "column-reverse",
      };
    default:
      return TOAST_VIEWPORT_BASE_STYLE;
  }
}
