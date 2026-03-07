import * as React from "react";
import { mergeClassNames } from "@/lib/utils";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={mergeClassNames(
        "mb-1 block text-sm font-medium text-[#392356]",
        className,
      )}
      {...props}
    />
  );
}
