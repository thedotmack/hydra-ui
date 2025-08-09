import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-95",
  {
    variants: {
      variant: {
        default:
          "bg-linear-to-r from-neon-cyan to-neon-cyan/80 text-background border border-neon-cyan/50 hover:glow-cyan hover:-translate-y-1 shadow-lg",
        destructive:
          "bg-linear-to-r from-red-600 to-red-500 text-white border border-red-500/50 hover:glow-purple shadow-lg hover:-translate-y-1",
        outline:
          "border border-muted-foreground/30 bg-background/10 backdrop-blur-sm hover:bg-muted/20 hover:border-neon-cyan/50 hover:text-neon-cyan transition-all duration-300",
        secondary:
          "bg-linear-to-r from-neon-green to-neon-green/80 text-background border border-neon-green/50 hover:glow-green hover:-translate-y-1 shadow-lg",
        ghost:
          "hover:bg-muted/20 hover:text-foreground backdrop-blur-sm transition-all duration-300",
        link: "text-neon-cyan underline-offset-4 hover:underline hover:text-neon-purple hover:glow-cyan",
      },
      size: {
        default: "h-10 px-6 py-2 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-4 text-xs has-[>svg]:px-3",
        lg: "h-12 rounded-lg px-8 text-base has-[>svg]:px-6",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
