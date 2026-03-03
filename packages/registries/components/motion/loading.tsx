import { SileoToastBase } from "./base";
import type { SileoToastComponentProps } from "./types";

export function SileoToastLoading(props: SileoToastComponentProps) {
  return (
    <SileoToastBase
      autopilot={false}
      defaultTitle="Saving changes..."
      variant="loading"
      {...props}
    />
  );
}
