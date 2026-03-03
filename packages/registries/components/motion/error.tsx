import { SileoToastBase } from "./base";
import type { SileoToastComponentProps } from "./types";

export function SileoToastError(props: SileoToastComponentProps) {
  return (
    <SileoToastBase
      defaultDescription="Try again in a few seconds."
      defaultTitle="Something went wrong"
      variant="error"
      {...props}
    />
  );
}
