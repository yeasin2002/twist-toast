import { createToast } from "@twist-toast/react";

import { SileoToastAction } from "./action";
import { SileoToastError } from "./error";
import { SileoToastInfo } from "./info";
import { SileoToastLoading } from "./loading";
import { SileoToastSuccess } from "./success";
import { SileoToastWarning } from "./warning";

export const sileoToast = createToast(
  {
    success: SileoToastSuccess,
    loading: SileoToastLoading,
    error: SileoToastError,
    warning: SileoToastWarning,
    info: SileoToastInfo,
    action: SileoToastAction,
  },
  {
    scope: "sileo-toast",
    defaultDuration: 6000,
    defaultPosition: "top-right",
    dedupe: "refresh",
  },
);
