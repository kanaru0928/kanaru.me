import { flex } from "styled-system/patterns";
import { HambergerLink } from "./hamberger-link";
import {
  IconBrandGithubFilled,
  IconBrandTwitterFilled,
  IconChevronsRight,
} from "@tabler/icons-react";
import { HambergerIconLink } from "./hamberger-icon-link";

export function HambergerContent() {
  return (
    <div>
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
      <div className={flex({ color: "white", justify: "center", spaceX: 3 })}>
        <HambergerIconLink
          href="https://github.com/kanaru0928"
          description="GitHubへ移動"
        >
          <IconBrandGithubFilled size={28} />
        </HambergerIconLink>
        <HambergerIconLink
          href="https://x.com/Kanaru49570357"
          description="Twitterへ移動"
        >
          <IconBrandTwitterFilled size={28} />
        </HambergerIconLink>
      </div>
    </div>
  );
}
