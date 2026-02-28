import { GoeyToastBase } from "./base";
import { GoeyInfoIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastInfo(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultMessage="New update available"
      icon={<GoeyInfoIcon />}
      variant="info"
      {...props}
    />
  );
}
