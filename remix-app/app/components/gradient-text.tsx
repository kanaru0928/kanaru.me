import clsx from "clsx";
import { ComponentPropsWithRef, ElementType } from "react";
import { css } from "styled-system/css";

interface Props<As extends ElementType> extends ComponentPropsWithRef<"p"> {
  component?: As;
}

export function GradientText<As extends ElementType>({
  children,
  className,
  component,
  ...props
}: Props<As>) {
  const Component = component || "p";

  return (
    <Component
      className={clsx(
        css({
          textGradient: "to-r",
          gradientFrom: "violet.300",
          gradientVia: "violet.50",
          gradientTo: "violet.300",
          position: "relative",
          _before: {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bg: "violet.300/60",
            filter: "auto",
            blur: "2xl",
            zIndex: -1,
          },
        }),
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
