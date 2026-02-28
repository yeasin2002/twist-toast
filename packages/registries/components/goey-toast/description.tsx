import { GoeyToastBase } from "./base";
import { GoeyWarningIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastDescription(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultDescription="You've been inactive for 25 minutes. Save your changes before the session ends."
      defaultMessage="Session is about to expire"
      icon={<GoeyWarningIcon />}
      variant="description"
      {...props}
    />
  );
}
