import chroma from "chroma-js";
import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { css } from "styled-system/css";
import { token } from "styled-system/tokens";

interface Props extends ComponentPropsWithoutRef<"svg"> {
  size?: number;
}

export function HambergerIcon({ size = 24, ...props }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={clsx(
        "icon icon-tabler icons-tabler-outline icon-tabler-menu-2",
        css({
          color: "white",
        })
      )}
      {...props}
    >
      <defs>
        <mask id="clip-path">
          <path d="M4 6l16 0" />
          <path d="M4 12l16 0" />
          <path d="M4 18l16 0" />
        </mask>
        <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
          <stop
            offset="0%"
            stopColor={chroma(token("colors.violet.300")).alpha(0.1).css()}
          />
          <stop
            offset="100%"
            stopColor={chroma(token("colors.violet.300")).alpha(0.6).css()}
          />
        </linearGradient>
      </defs>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />

      <rect
        width="24"
        height="24"
        fill="url(#gradient)"
        mask="url(#clip-path)"
      />
    </svg>
  );
}
