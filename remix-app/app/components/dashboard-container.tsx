import clsx from "clsx";
import { ComponentProps } from "react";
import { css } from "styled-system/css";

interface Props extends ComponentProps<"div"> {}

export function DashboardContainer({ className, ...props }: Props) {
  return (
    <div
      className={clsx(
        css({
          rounded: "xl",
          background: "zinc.50/50",
          boxShadow:
            "20px 20px 60px rgba(190, 190, 190, 0.5), -20px -20px 60px rgba(255, 255, 255, 0.5)",
          p: "4",
        }),
        className
      )}
      {...props}
    />
  );
}
