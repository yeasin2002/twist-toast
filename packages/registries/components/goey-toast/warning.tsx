import { GoeyToastBase } from "./base";
import { GoeyWarningIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastWarning(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultMessage="Storage is almost full"
      icon={<GoeyWarningIcon />}
      variant="warning"
      {...props}
    />
  );
}
