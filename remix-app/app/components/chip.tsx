import { ReactNode } from "react";
import { css } from "styled-system/css";

interface Props {
  children: ReactNode;
}

export function Chip({ children }: Props) {
  return (
    <div
      className={css({
        color: "white",
        bg: "zinc.600/60",
        backdropFilter: "auto",
        backdropBlur: "md",
        px: 3,
        py: 0.5,
        borderRadius: "full",
        borderTop: "solid 1px",
        borderLeft: "solid 1px",
        borderColor: "zinc.50/20",
        my: 3,
      })}
    >
      <p
        className={css({
          fontSize: "sm",
          fontWeight: "medium",
        })}
      >
        {children}
      </p>
    </div>
  );
}
