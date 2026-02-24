import { ToastPosition, ToastRole } from "./types";

export const TOAST_POSITIONS: ToastPosition[] = [
  "top-right",
  "top-left",
  "bottom-right",
  "bottom-left",
  "top-center",
  "bottom-center",
];

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION: ToastPosition = "top-right";
const DEFAULT_MAX_TOASTS = 5;
const DEFAULT_SCOPE = "default";
const DEFAULT_ROLE: ToastRole = "status";

export const DEFAULT_CONFIG = {
  duration: DEFAULT_DURATION,
  position: DEFAULT_POSITION,
  maxToasts: DEFAULT_MAX_TOASTS,
  scope: DEFAULT_SCOPE,
  role: DEFAULT_ROLE,
};
