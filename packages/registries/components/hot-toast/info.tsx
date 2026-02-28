import { Info } from "lucide-react";

import { HotToastBase } from "./base";
import type { HotToastItemProps } from "./types";

export function HotToastInfo({
  message = "Here is some information.",
  className,
}: HotToastItemProps) {
  return (
    <HotToastBase
      className={className}
      message={message}
      icon={
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#3B82F6] text-[#EFF6FF]">
          <Info className="size-3.5 stroke-[2.5]" />
        </span>
      }
    />
  );
}
