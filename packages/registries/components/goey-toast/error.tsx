import { GoeyToastBase } from "./base";
import { GoeyErrorIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastError(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultMessage="Something went wrong"
      icon={<GoeyErrorIcon />}
      variant="error"
      {...props}
    />
  );
}
