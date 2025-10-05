import { CircleCheck } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

type Color = "primary" | "accent" | "default";

type TimelineItemProps = {
  date: string;
  start?: boolean;
  end?: boolean;
  prevColor?: Color;
  nextColor?: Color;
} & ComponentProps<"div">;

export function TimelineItem({
  date,
  start = false,
  end = false,
  prevColor,
  nextColor,
  className,
  ...divProps
}: TimelineItemProps) {
  const textMap = {
    default: "text-base-content" as const,
    primary: "text-primary" as const,
    accent: "text-accent" as const,
  } satisfies Record<Color, string>;
  const bgMap = {
    default: "bg-base-300" as const,
    primary: "bg-primary" as const,
    accent: "bg-accent" as const,
  } satisfies Record<Color, string>;

  return (
    <li>
      {!start && <hr className={bgMap[prevColor || "default"]} />}
      <div className="timeline-start">{date}</div>
      <div className="timeline-middle">
        <CircleCheck
          size={18}
          className={cn(textMap[nextColor || "default"])}
        />
      </div>
      <div
        className={cn("timeline-end timeline-box", className)}
        {...divProps}
      />
      {!end && <hr className={bgMap[nextColor || "default"]} />}
    </li>
  );
}
