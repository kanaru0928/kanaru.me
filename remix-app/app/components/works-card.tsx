import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import { IconChevronRight } from "@tabler/icons-react";
import clsx from "clsx";
import { ComponentProps } from "react";
import { Link } from "react-router";
import { css } from "styled-system/css";
import { flex, hstack, stack } from "styled-system/patterns";

interface WorksCardProps extends ComponentProps<"div"> {
  title: string;
  imageSource?: string;
  imageAlt?: string;
  link?: string;
}

export function Card({
  title,
  imageSource,
  imageAlt,
  link,
  children,
  ...props
}: WorksCardProps) {
  return (
    <div
      className={clsx(
        css({
          bg: "zinc.50/50",
          rounded: "lg",
          shadow: "lg",
          overflow: "hidden",
        })
      )}
      {...props}
    >
      <AspectRatio.Root
        className={css({
          position: "relative",
          overflow: "hidden",
        })}
        ratio={16 / 10}
      >
        <img src={imageSource} alt={imageAlt} className={css({
          width: "full",
          height: "full",
          objectFit: "cover",
          objectPosition: "top",
        })} />
      </AspectRatio.Root>
      <div className={stack({ p: "4", pt: "2", justify: "space-between" })}>
        <div>
          <h2 className={css({ textStyle: "heading2", mb: "1" })}>{title}</h2>
          {children}
        </div>
        {link && (
          <div className={flex({ justify: "end", spaceX: "2" })}>
            <Link
              to={link}
              className={hstack({
                bg: "violet.500",
                color: "white",
                fontSize: "sm",
                px: "3",
                py: "1.5",
                rounded: "lg",
                _hover: {
                  bg: "violet.600",
                },
              })}
            >
              <span
                className={css({
                  smDown: {
                    display: "none",
                  },
                })}
              >
                VIEW DETAILS
              </span>
              <IconChevronRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
