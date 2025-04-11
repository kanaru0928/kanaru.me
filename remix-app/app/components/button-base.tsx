import { Slot } from "@radix-ui/react-slot";
import React, { ComponentProps } from "react";

interface Props extends ComponentProps<"button"> {
  asChild?: boolean;
}

export const ButtonBase = React.forwardRef<HTMLButtonElement, Props>(
  ({ asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp ref={ref} {...props} />;
  }
);

ButtonBase.displayName = "ButtonBase";
