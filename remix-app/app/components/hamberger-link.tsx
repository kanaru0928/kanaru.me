import * as Dialog from "@radix-ui/react-dialog";
import { Link } from "react-router";
import { ReactNode } from "react";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";

interface Props {
  children?: ReactNode;
  anchor?: ReactNode;
  href: string;
}

export function HambergerLink({ children, href, anchor }: Props) {
  return (
    <Dialog.Close asChild>
      <Link to={href} className={css({ color: "white", fontSize: "lg" })}>
        <div
          className={flex({
            color: "white",
            fontSize: "lg",
            spaceX: 2,
            alignItems: "center",
          })}
        >
          {anchor}
          {children}
        </div>
      </Link>
    </Dialog.Close>
  );
}
