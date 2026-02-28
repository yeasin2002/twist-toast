import { X } from "lucide-react";

import { HotToastBase } from "./base";
import type { HotToastItemProps } from "./types";

export function HotToastError({
  message = "Something went wrong.",
  className,
}: HotToastItemProps) {
  return (
    <HotToastBase
      className={className}
      message={message}
      icon={
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#EF4444] text-[#FEE2E2]">
          <X className="size-3.5 stroke-[2.5]" />
        </span>
      }
    />
  );
}
