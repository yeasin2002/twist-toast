"use client";

import type { ComponentProps } from "react";

import { Button } from "../ui/button";

import { cn } from "@/lib/utils";

interface Props extends ComponentProps<"div"> {
  onTrigger?: () => void;
  buttonLabel?: string;
}

export const DisplayToasters = ({
  children,
  className,
  onTrigger,
  buttonLabel = "Trigger",
  ...props
}: Props) => {
  return (
    <div
      className={cn("flex flex-col rounded-xl border p-4", className)}
      {...props}
    >
      {children}
      <Button className="mt-4" onClick={onTrigger} type="button">
        {buttonLabel}
      </Button>
    </div>
  );
};
