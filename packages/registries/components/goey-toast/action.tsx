import { GoeyToastBase } from "./base";
import { GoeyInfoIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastAction(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultActionLabel="Copy to clipboard"
      defaultDescription="Your share link is ready."
      defaultMessage="Share link generated"
      icon={<GoeyInfoIcon />}
      variant="action"
      {...props}
    />
  );
}
