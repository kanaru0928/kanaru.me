import { useEffect, useState } from "react";
import { Chip } from "./chip";
import * as Tooltip from "@radix-ui/react-tooltip";
import { css } from "styled-system/css";

export function VersionChip() {
  const [version, setVersion] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string | null>(null);

  useEffect(() => {
    setVersion(window.ENV.VERSION_NAME ?? null);
    setRepoUrl(window.ENV.REPOSITORY_URL ?? null);
  }, []);

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <a
          href={`${repoUrl}/releases/tag/${version}`}
          target="_blank"
          rel="noreferrer"
        >
          <Chip>{version}</Chip>
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
          更新履歴
          <Tooltip.Arrow className={css({ fill: "white" })} />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
