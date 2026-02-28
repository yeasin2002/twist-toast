import { TriangleAlert } from "lucide-react";

import { HotToastBase } from "./base";
import type { HotToastItemProps } from "./types";

export function HotToastWarning({
  message = "Heads up! Please review this action.",
  className,
}: HotToastItemProps) {
  return (
    <HotToastBase
      className={className}
      message={message}
      icon={
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#F59E0B] text-[#FFFBEB]">
          <TriangleAlert className="size-3.5 stroke-[2.5]" />
        </span>
      }
    />
  );
}
