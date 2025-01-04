import { IconChevronsDown } from "@tabler/icons-react";
import chroma from "chroma-js";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { token } from "styled-system/tokens";
import { useWindowSize } from "~/hooks/use-window-size";

export function HomeBG() {
  const windowSize = useWindowSize();

  return (
    <>
      <div
        className={flex({
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          justify: "center",
        })}
      >
        <IconChevronsDown
          size={200}
          className={css({
            color: "white/10",
            animation: "bounce 2s infinite",
          })}
        />
      </div>
      <div
        className={css({
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          willChange: "transform",
        })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${windowSize.width} ${windowSize.height}`}
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <defs>
            <filter
              id="blur"
              filterUnits="userSpaceOnUse"
              x="-500%"
              y="-500%"
              width="1000%"
              height="1000%"
            >
              <feGaussianBlur
                in="SourceGraphic"
                stdDeviation={
                  Math.min(windowSize.width, windowSize.height) * 0.15
                }
              />
            </filter>
          </defs>
          <g width="100" height="100">
            <ellipse
              cx={windowSize.width * 0.37}
              cy={windowSize.height * 0.72}
              rx={windowSize.width * 0.3}
              ry={windowSize.height * 0.06}
              fill={chroma(token("colors.violet.400")).alpha(0.35).css()}
              filter="url(#blur)"
            />
            <ellipse
              cx={windowSize.width * 0.7}
              cy={windowSize.height * 0.64}
              rx={windowSize.width * 0.3}
              ry={windowSize.height * 0.06}
              fill={chroma(token("colors.violet.500")).alpha(0.35).css()}
              filter="url(#blur)"
            />
          </g>
        </svg>
      </div>
    </>
  );
}
