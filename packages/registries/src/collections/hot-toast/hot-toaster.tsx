import { createToast } from "@twist-toast/react";

import { HotToastError } from "./error";
import { HotToastInfo } from "./info";
import { HotToastLoading } from "./loading";
import { HotToastSuccess } from "./success";
import { HotToastWarning } from "./warning";

export const hotToast = createToast(
  {
    success: HotToastSuccess,
    error: HotToastError,
    warning: HotToastWarning,
    info: HotToastInfo,
    loading: HotToastLoading,
  },
  {
    scope: "hot-toast",
    defaultDuration: 4000,
    defaultPosition: "top-right",
    dedupe: "refresh",
  },
);
