import type { ReactNode } from "react";

export type SileoToastVariant =
  | "success"
  | "loading"
  | "error"
  | "warning"
  | "info"
  | "action";

export type SileoPillAlign = "left" | "center" | "right";

export type SileoToastStyles = {
  title?: string;
  description?: string;
  badge?: string;
  button?: string;
};

export type SileoToastButton = {
  title: string;
  onClick?: () => void;
};

export type SileoAutopilot =
  | boolean
  | {
      expand?: number;
      collapse?: number;
    };

export type SileoToastPayload = {
  title?: string;
  message?: string;
  description?: ReactNode | string;
  icon?: ReactNode | null;
  fill?: string;
  roundness?: number;
  durationMs?: number | null;
  autopilot?: SileoAutopilot;
  align?: SileoPillAlign;
  button?: SileoToastButton;
  styles?: SileoToastStyles;
  className?: string;
};

export type SileoToastComponentProps = SileoToastPayload & {
  toastId?: string;
  dismiss?: () => void;
};
