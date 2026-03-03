import { SileoToastBase } from "./base";
import type { SileoToastComponentProps } from "./types";

export function SileoToastAction(props: SileoToastComponentProps) {
  return (
    <SileoToastBase
      defaultButton={{ title: "Open" }}
      defaultDescription="Click to continue."
      defaultTitle="Action required"
      variant="action"
      {...props}
    />
  );
}
