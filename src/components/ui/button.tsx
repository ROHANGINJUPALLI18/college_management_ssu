import * as React from "react";
import { mergeClassNames } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "accent";
};

export function Button({
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={mergeClassNames(
        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" &&
          "bg-[var(--portal-primary)] text-white hover:bg-[#240749]",
        variant === "outline" &&
          "border border-[#d6cfdf] bg-white text-[var(--portal-primary)] hover:bg-[#f7f4fb]",
        variant === "ghost" &&
          "text-[var(--portal-primary)] hover:bg-[#f2edf8]",
        variant === "accent" &&
          "bg-[var(--portal-accent)] text-[#2d1f00] hover:bg-[#e0a200]",
        className,
      )}
      {...props}
    />
  );
}
