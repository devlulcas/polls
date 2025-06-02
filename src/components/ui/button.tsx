import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: `
          bg-gradient-to-br from-special-1 via-special-4 to-special-7 
          text-white 
          shadow-md 
          hover:brightness-110 hover:via-special-3 hover:to-special-5
          transition-colors duration-300
          focus-visible:ring-ring/60 
          border border-special-4
        `,
        primary: `
          bg-gradient-to-b from-primary to-primary/80 
          text-primary-foreground 
          shadow-md 
          hover:brightness-105 
          focus-visible:ring-ring/60 
          border border-primary/60
        `,
        destructive: `
          bg-gradient-to-b from-destructive to-destructive/80 
          text-white 
          shadow-md 
          hover:brightness-105 
          focus-visible:ring-destructive/60 
          border border-destructive/60
        `,
        outline: `
          border border-border 
          bg-background 
          text-foreground 
          shadow-md 
          hover:bg-accent hover:text-accent-foreground 
          focus-visible:ring-ring/60
        `,
        secondary: `
          bg-gradient-to-b from-secondary to-secondary/80 
          text-secondary-foreground 
          shadow-md 
          hover:brightness-105 
          focus-visible:ring-ring/60 
          border border-secondary/60
        `,
        ghost: `
          bg-transparent 
          text-foreground 
          shadow-none 
          hover:bg-accent hover:text-accent-foreground 
          focus-visible:ring-ring/60 
          border border-transparent
        `,
        link: `
          text-primary underline-offset-4 
          hover:underline 
          bg-transparent 
          shadow-none 
          border border-transparent 
          focus-visible:ring-ring/60
        `,
        discord: `
          bg-gradient-to-b from-[oklch(0.45_0.22_300)] to-[oklch(0.38_0.15_300)] 
          text-white 
          shadow-md 
          hover:brightness-110 
          focus-visible:ring-[oklch(0.45_0.22_300)/0.6] 
          border border-[oklch(0.35_0.15_300)] 
        `,
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
