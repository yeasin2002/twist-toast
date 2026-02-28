import { LoaderCircle } from "lucide-react";

import { HotToastBase } from "./base";
import type { HotToastItemProps } from "./types";

export function HotToastLoading({
  message = "Loading...",
  className,
}: HotToastItemProps) {
  return (
    <HotToastBase
      className={className}
      message={message}
      icon={
        <span className="inline-flex size-5 items-center justify-center rounded-full bg-[#6B7280] text-[#E5E7EB]">
          <LoaderCircle className="size-3.5 animate-spin stroke-[2.5]" />
        </span>
      }
    />
  );
}
