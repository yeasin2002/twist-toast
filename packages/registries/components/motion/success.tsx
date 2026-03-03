import { SileoToastBase } from "./base";
import type { SileoToastComponentProps } from "./types";

export function SileoToastSuccess(props: SileoToastComponentProps) {
  return (
    <SileoToastBase defaultTitle="Changes saved" variant="success" {...props} />
  );
}
