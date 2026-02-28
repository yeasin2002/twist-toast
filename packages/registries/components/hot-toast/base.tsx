import type { ReactNode } from "react";

import { cn } from "../../utils";

type HotToastBaseProps = {
  icon?: ReactNode;
  message: string;
  className?: string;
};

export function HotToastBase({ icon, message, className }: HotToastBaseProps) {
  return (
    <div
      role="status"
      className={cn(
        "pointer-events-auto flex w-full max-w-[350px] items-center gap-3 rounded-lg border border-black/5 bg-white px-3 py-2 text-[#363636] shadow-[0_3px_10px_rgba(0,0,0,0.10),0_3px_3px_rgba(0,0,0,0.05)]",
        className,
      )}
    >
      {icon}
      <p className="text-[15px] leading-[1.3]">{message}</p>
    </div>
  );
}
