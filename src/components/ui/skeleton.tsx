import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[oklch(0.97_0_0)] dark:bg-[oklch(0.269_0_0)] animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
