import { SileoToastBase } from "./base";
import type { SileoToastComponentProps } from "./types";

export function SileoToastInfo(props: SileoToastComponentProps) {
  return (
    <SileoToastBase
      defaultDescription="A new update is ready to install."
      defaultTitle="Heads up"
      variant="info"
      {...props}
    />
  );
}
