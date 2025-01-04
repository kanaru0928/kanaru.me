import { flex } from "styled-system/patterns";
import { HambergerLink } from "./hamberger-link";
import { IconChevronsRight } from "@tabler/icons-react";

export function HambergerContent() {
  return (
    <div
      className={flex({
        color: "white",
        alignItems: "center",
        justify: "center",
        direction: "column",
        spaceY: 2,
        my: 5,
      })}
    >
      <HambergerLink
        href="/"
        anchor={
          <div>
            <IconChevronsRight />
          </div>
        }
      >
        Home
      </HambergerLink>
      <HambergerLink
        href="/portfolio"
        anchor={
          <div>
            <IconChevronsRight />
          </div>
        }
      >
        Portfolio
      </HambergerLink>
      <HambergerLink
        href="/articles"
        anchor={
          <div>
            <IconChevronsRight />
          </div>
        }
      >
        Articles
      </HambergerLink>
    </div>
  );
}
