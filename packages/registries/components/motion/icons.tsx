import type { ComponentProps, ReactNode } from "react";

import type { SileoToastVariant } from "./types";

type SileoIconProps = ComponentProps<"svg"> & {
  title: string;
};

function IconBase({ title, children, ...props }: SileoIconProps) {
  return (
    <svg
      fill="none"
      height={16}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={16}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>{title}</title>
      {children}
    </svg>
  );
}

export function SileoArrowRightIcon(props: Omit<SileoIconProps, "title">) {
  return (
    <IconBase title="Arrow Right" {...props}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </IconBase>
  );
}

export function SileoLifeBuoyIcon(props: Omit<SileoIconProps, "title">) {
  return (
    <IconBase title="Life Buoy" {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="m4.93 4.93 4.24 4.24" />
      <path d="m14.83 9.17 4.24-4.24" />
      <path d="m14.83 14.83 4.24 4.24" />
      <path d="m9.17 14.83-4.24 4.24" />
      <circle cx="12" cy="12" r="4" />
    </IconBase>
  );
}

export function SileoLoaderCircleIcon(props: Omit<SileoIconProps, "title">) {
  return (
    <IconBase title="Loader Circle" {...props}>
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </IconBase>
  );
}

export function SileoXIcon(props: Omit<SileoIconProps, "title">) {
  return (
    <IconBase title="X" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </IconBase>
  );
}

export function SileoCircleAlertIcon(props: Omit<SileoIconProps, "title">) {
  return (
    <IconBase title="Circle Alert" {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </IconBase>
  );
}

export function SileoCheckIcon(props: Omit<SileoIconProps, "title">) {
  return (
    <IconBase title="Check" {...props}>
      <path d="M20 6 9 17l-5-5" />
    </IconBase>
  );
}

export function getSileoStateIcon(variant: SileoToastVariant): ReactNode {
  switch (variant) {
    case "success":
      return <SileoCheckIcon />;
    case "loading":
      return <SileoLoaderCircleIcon />;
    case "error":
      return <SileoXIcon />;
    case "warning":
      return <SileoCircleAlertIcon />;
    case "action":
      return <SileoArrowRightIcon />;
    case "info":
    default:
      return <SileoLifeBuoyIcon />;
  }
}
