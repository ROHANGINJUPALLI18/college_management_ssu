import { mergeClassNames } from "@/lib/utils";

type SpinnerProps = {
  className?: string;
};

export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      className={mergeClassNames(
        "inline-block h-4 w-4 rounded-full border-2 border-current/30 border-t-current animate-spin",
        className,
      )}
      aria-hidden="true"
    />
  );
}

type ShimmerBlockProps = {
  className?: string;
};

export function ShimmerBlock({ className }: ShimmerBlockProps) {
  return (
    <div
      className={mergeClassNames(
        "animate-pulse rounded-md bg-slate-200/70",
        className,
      )}
      aria-hidden="true"
    />
  );
}

type TableShimmerRowsProps = {
  rowCount?: number;
};

export function TableShimmerRows({ rowCount = 6 }: TableShimmerRowsProps) {
  return (
    <tbody className="divide-y divide-slate-50">
      {Array.from({ length: rowCount }).map((_, rowIndex) => (
        <tr key={rowIndex}>
          <td className="px-6 py-4">
            <ShimmerBlock className="h-4 w-8" />
          </td>
          <td className="px-6 py-4">
            <ShimmerBlock className="h-4 w-24" />
          </td>
          <td className="px-6 py-4">
            <ShimmerBlock className="h-4 w-32" />
          </td>
          <td className="px-6 py-4">
            <ShimmerBlock className="h-4 w-20" />
          </td>
          <td className="px-6 py-4">
            <ShimmerBlock className="h-6 w-24 rounded-full" />
          </td>
          <td className="px-6 py-4">
            <div className="ml-auto flex w-fit gap-2">
              <ShimmerBlock className="h-8 w-8 rounded-lg" />
              <ShimmerBlock className="h-8 w-8 rounded-lg" />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );
}
