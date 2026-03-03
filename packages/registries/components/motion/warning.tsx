import { SileoToastBase } from "./base";
import type { SileoToastComponentProps } from "./types";

export function SileoToastWarning(props: SileoToastComponentProps) {
  return (
    <SileoToastBase
      defaultDescription="Storage is almost full."
      defaultTitle="Warning"
      variant="warning"
      {...props}
    />
  );
}
