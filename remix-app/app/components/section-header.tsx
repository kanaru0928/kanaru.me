import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";
import { css } from "styled-system/css";

interface Props extends ComponentPropsWithoutRef<"h2"> {
  elementType?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function SectionHeader(props: Props) {
  const As = props.elementType || "h2";
  return (
    <As
      {...props}
      className={clsx(
        css({
          color: "white",
          fontSize: "2xl",
          fontWeight: "bold",
        }),
        props.className
      )}
    />
  );
}
