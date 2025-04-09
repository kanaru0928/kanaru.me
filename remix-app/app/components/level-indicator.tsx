import clsx from "clsx";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { token } from "styled-system/tokens";
import { levelColors } from "~/contents/skills";

type Props = {
  level: 1 | 2 | 3 | 4 | 5;
};

export function LevelIndicator({ level }: Props) {
  return (
    <div
      className={flex({
        spaceX: "1",
        align: "center",
      })}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={clsx(
            css({
              width: "3",
              height: "5",
              borderRadius: "full",
            }),
            index < level &&
              css({
                transform: "scale(1)",
                transition: "transform 0.2s",
                _hover: {
                  transform: "scale(1.3)",
                },
              })
          )}
          style={{
            backgroundColor: token(
              index < level
                ? `colors.${levelColors[level]}.500`
                : "colors.gray.200"
            ),
          }}
        />
      ))}
    </div>
  );
}
