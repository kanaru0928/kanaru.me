import * as Tooltip from "@radix-ui/react-tooltip";
import { ReactNode } from "react";
import { css } from "styled-system/css";

interface Props {
  href: string;
  children: ReactNode;
  description: string;
}

export function HambergerIconLink({ href, children, description }: Props) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <a href={href} target="_blank" rel="noreferrer">
          <div>{children}</div>
        </a>
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          className={css({
            userSelect: "none",
            animation: "fadeIn 0.2s",
            bg: "white",
            color: "violet.900",
            borderRadius: 4,
            px: 3,
            py: 1,
            fontSize: "sm",
            lineHeight: 1,
            willChange: "transfrom, opacity",
            zIndex: 110,
          })}
          sideOffset={5}
        >
          {description}
          <Tooltip.Arrow className={css({ fill: "white" })} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
