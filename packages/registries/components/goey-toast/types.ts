export type GoeyToastPayload = {
  message?: string;
  description?: string;
  actionLabel?: string;
  actionSuccessLabel?: string;
  showProgress?: boolean;
  durationMs?: number;
  className?: string;
};

export type GoeyToastComponentProps = GoeyToastPayload & {
  toastId?: string;
  dismiss?: () => void;
};

export type GoeyToastVariant =
  | "default"
  | "success"
  | "error"
  | "warning"
  | "info"
  | "loading"
  | "description"
  | "action";
