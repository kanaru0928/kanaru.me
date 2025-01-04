import clsx from "clsx";
import { ComponentPropsWithRef, ElementType, ReactNode } from "react";
import { css } from "styled-system/css";
import { grid } from "styled-system/patterns";

interface Props<As extends ElementType> extends ComponentPropsWithRef<"p"> {
  component?: As;
  children: ReactNode;
}

export function GradientText<As extends ElementType>({
  children,
  className,
  component,
  ...props
}: Props<As>) {
  const Component = component || "p";

  return (
    <>
      <Component
        className={clsx(
          grid({
            columns: 1,
          }),
          className
        )}
        {...props}
      >
        <span
          aria-hidden
          className={css({
            gridRowStart: 1,
            gridColumnStart: 1,
            filter: "auto",
            blur: "xl",
            color: "violet.50",
          })}
        >
          {children}
        </span>
        <span
          className={css({
            gridRowStart: 1,
            gridColumnStart: 1,
            textGradient: "to-r",
            gradientFrom: "violet.300",
            gradientVia: "violet.50",
            gradientTo: "violet.300",
            position: "relative",
          })}
        >
          {children}
        </span>
      </Component>
    </>
  );
}
