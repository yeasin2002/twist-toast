import { createToast } from "@twist-toast/react";
import {
  CustomToast,
  ErrorToast,
  ModalInfoToast,
  SuccessToast,
} from "./toast-components";

export const toast = createToast(
  {
    success: SuccessToast,
    error: ErrorToast,
    custom: CustomToast,
  },
  {
    scope: "global",
    defaultDuration: 4000,
    defaultPosition: "top-right",
    maxToasts: 2,
    dedupe: "refresh",
  },
);

export const modalToast = createToast(
  {
    info: ModalInfoToast,
  },
  {
    scope: "modal",
    defaultDuration: 4500,
    defaultPosition: "bottom-center",
    maxToasts: 2,
    dedupe: "refresh",
  },
);
