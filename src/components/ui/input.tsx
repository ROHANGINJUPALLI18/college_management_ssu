import * as React from "react";
import { mergeClassNames } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={mergeClassNames(
        "h-10 w-full rounded-md border border-[#d8d2e0] bg-white px-3 text-sm text-[#221236] placeholder:text-[#8f85a0] focus:border-[var(--portal-primary)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
}
