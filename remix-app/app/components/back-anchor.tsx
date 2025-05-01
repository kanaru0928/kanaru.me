import { IconChevronLeft } from "@tabler/icons-react";
import { ComponentProps } from "react";
import { Link } from "react-router";
import { css } from "styled-system/css";

interface BackAnchorProps extends ComponentProps<typeof Link> {}

export function BackAnchor(props: BackAnchorProps) {
  return (
    <Link {...props}>
      <div
        className={css({
          p: "1",
          borderRadius: "full",
          _hover: { bg: "zinc.900/20" },
        })}
      >
        <IconChevronLeft />
      </div>
    </Link>
  );
}
