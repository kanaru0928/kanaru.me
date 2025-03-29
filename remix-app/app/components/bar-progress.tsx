import { ComponentProps } from "react";
import { css } from "styled-system/css";

interface Props extends ComponentProps<"div"> {
  progress: number;
  progressColor: string;
}

export function BarProgress({ progress, progressColor, ...props }: Props) {
  return (
    <div {...props}>
      <div
        className={css({
          height: "full",
          transition: "width 0.5s ease-in-out",
        })}
        style={{
          background: progressColor,
          width: `${progress}%`,
        }}
      ></div>
    </div>
  );
}
