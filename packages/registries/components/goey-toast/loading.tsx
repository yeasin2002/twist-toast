import { GoeyToastBase } from "./base";
import styles from "./goey-toast.module.css";
import { GoeySpinnerIcon } from "./icons";
import type { GoeyToastComponentProps } from "./types";

export function GoeyToastLoading(props: GoeyToastComponentProps) {
  return (
    <GoeyToastBase
      defaultMessage="Saving changes..."
      defaultShowProgress
      icon={<GoeySpinnerIcon className={styles.spinner} />}
      variant="loading"
      {...props}
    />
  );
}
