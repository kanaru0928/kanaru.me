import { ComponentProps, CSSProperties } from "react";
import { ButtonBase } from "./button-base";
import { css } from "styled-system/css";
import clsx from "clsx";
import { ColorToken, token } from "styled-system/tokens";

interface ButtonProps extends ComponentProps<typeof ButtonBase> {
  buttonColor?: ColorToken;
  hoverColor?: ColorToken;
  color?: ColorToken;
}

export function Button({
  buttonColor = "violet.500",
  hoverColor = "violet.600",
  color = "zinc.50",
  className,
  ...props
}: ButtonProps) {
  return (
    <ButtonBase
      className={clsx(
        css({
          bg: "var(--bg-color)",
          fontSize: "sm",
          px: "3",
          py: "1.5",
          rounded: "lg",
          color: "var(--text-color)",
          _hover: {
            bg: "var(--hover-color)",
          },
        }),
        className
      )}
      style={
        {
          "--bg-color": token(`colors.${buttonColor}`),
          "--hover-color": token(`colors.${hoverColor}`),
          "--text-color": token(`colors.${color}`),
        } as CSSProperties
      }
      {...props}
    />
  );
}
