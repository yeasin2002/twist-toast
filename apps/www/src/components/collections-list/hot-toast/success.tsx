import { Check } from "lucide-react";

import { HotToastBase } from "./base";
import type { HotToastItemProps } from "./types";

export function HotToastSuccess({
  message = "Successfully toasted!",
  className,
}: HotToastItemProps) {
  return (
    <HotToastBase
      className={className}
      message={message}
      icon={
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#10B981] text-[#F0FDF4]">
          <Check className="size-3.5 stroke-[2.5]" />
        </span>
      }
    />
  );
}
