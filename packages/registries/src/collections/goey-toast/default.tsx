import { GoeyToastBase } from "./base";
import { GoeyDefaultIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastDefault(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultMessage="Notification received"
      icon={<GoeyDefaultIcon />}
      variant="default"
      {...props}
    />
  );
}
