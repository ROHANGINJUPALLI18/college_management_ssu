import * as React from "react";
import { mergeClassNames } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={mergeClassNames(
        "rounded-xl border border-[#e4deee] bg-white p-5 shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={mergeClassNames("text-lg font-semibold text-[#26113f]", className)} {...props} />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={mergeClassNames("text-sm text-[#5f5770]", className)} {...props} />;
}

export function CardHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={mergeClassNames("flex flex-col space-y-1.5 p-5 pb-0", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={mergeClassNames("p-5 pt-4", className)} {...props} />
  );
}
