import { createToast } from "@twist-toast/react";

import { GoeyToastAction } from "./action";
import { GoeyToastDefault } from "./default";
import { GoeyToastDescription } from "./description";
import { GoeyToastError } from "./error";
import { GoeyToastInfo } from "./info";
import { GoeyToastLoading } from "./loading";
import { GoeyToastSuccess } from "./success";
import { GoeyToastWarning } from "./warning";

export const goeyToast = createToast(
  {
    default: GoeyToastDefault,
    success: GoeyToastSuccess,
    error: GoeyToastError,
    warning: GoeyToastWarning,
    info: GoeyToastInfo,
    loading: GoeyToastLoading,
    description: GoeyToastDescription,
    action: GoeyToastAction,
  },
  {
    scope: "goey-toast",
    defaultDuration: 4000,
    defaultPosition: "top-right",
    dedupe: "refresh",
  },
);

export const gooeyToast = goeyToast;
