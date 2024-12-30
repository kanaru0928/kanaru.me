import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";

interface Props extends ComponentPropsWithoutRef<"div"> {
  children?: ReactNode;
  anchor?: ReactNode;
  title?: string;
  elementType?: ElementType;
}

export function Card(props: Props) {
  const As = props.elementType || "div";

  return (
    <As
      {...props}
      className={clsx(
        css({
          rounded: "md",
          border: "solid 1px",
          borderColor: "zinc.50/40",
          p: 4,
          transition: "all 0.2s",
          _hover: {
            bg: "zinc.50/10",
          },
        }),
        props.className
      )}
    >
      {props.title && (
        <div
          className={flex({
            alignItems: "center",
            spaceX: 2,
            mb: 2,
          })}
        >
          {props.anchor}
          <h3
            className={css({
              fontSize: "lg",
              fontWeight: "bold",
            })}
          >
            {props.title}
          </h3>
        </div>
      )}
      {props.children}
    </As>
  );
}
