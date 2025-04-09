import clsx from "clsx";
import { ComponentProps, ReactNode } from "react";
import { center } from "styled-system/patterns";

interface Props extends ComponentProps<"div"> {
  source?: string;
  icon?: ReactNode;
  size?: number;
  alt?: string;
}

export function SkillIcon({
  source,
  icon,
  size = 36,
  alt = "",
  className,
  ...props
}: Props) {
  if (!source && !icon) {
    return null;
  }

  return (
    <div
      className={clsx(
        center({
          p: "3",
          rounded: "lg",
          background: "zinc.50",
          border: "1px solid",
          borderColor: "violet.200",
        })
      )}
      {...props}
    >
      {icon ? icon : <img src={source} width={size} height={size} alt={alt} />}
    </div>
  );
}
