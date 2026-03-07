import * as React from "react";
import { mergeClassNames } from "@/lib/utils";

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={mergeClassNames("w-full text-sm", className)}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={mergeClassNames(
        "border-b border-[#e0d9ea] px-4 py-3 text-left font-semibold text-[#2f0a5e]",
        className,
      )}
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={mergeClassNames(
        "border-b border-[#f0ebf7] px-4 py-3",
        className,
      )}
      {...props}
    />
  );
}
