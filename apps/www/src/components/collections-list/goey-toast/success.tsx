import { GoeyToastBase } from "./base";
import { GoeySuccessIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastSuccess(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultMessage="Changes saved"
      icon={<GoeySuccessIcon />}
      variant="success"
      {...props}
    />
  );
}
