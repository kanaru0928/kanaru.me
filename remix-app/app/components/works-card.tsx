import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import clsx from "clsx";
import { ComponentProps } from "react";
import { Link } from "react-router";
import { css } from "styled-system/css";

interface WorksCardProps extends ComponentProps<"div"> {
  title: string;
  imageSource?: string;
  imageAlt?: string;
  link?: string;
}

export function WorksCard({
  title,
  imageSource,
  imageAlt,
  link,
  children,
  ...props
}: WorksCardProps) {
  const Container = link ? Link : "div";

  return (
    <div
      className={clsx(
        link &&
          css({
            _hover: {
              bg: "zinc.50/80",
            },
          }),
        css({
          bg: "zinc.50/50",
          rounded: "lg",
          shadow: "lg",
          overflow: "hidden",
        })
      )}
      {...props}
    >
      <Container to={link ?? "#"}>
        <AspectRatio.Root
          className={css({
            position: "relative",
            aspectRatio: "16/9",
            overflow: "hidden",
          })}
          ratio={16 / 9}
        >
          <img src={imageSource} alt={imageAlt} />
        </AspectRatio.Root>
        <div className={css({ py: "2", px: "4" })}>
          <h2 className={css({ textStyle: "heading2", mb: "1" })}>{title}</h2>
          {children}
        </div>
      </Container>
    </div>
  );
}
