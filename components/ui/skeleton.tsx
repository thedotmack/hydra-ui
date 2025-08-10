import * as React from "react";
import { cn } from "@/lib/utils";
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("animate-pulse rounded-md bg-muted/40 dark:bg-muted/20", className)} aria-hidden="true" {...props} />;
}
