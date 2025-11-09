import { useEffect, useRef } from "react";
import type { GitHubContributionData } from "../loaders/github";

export function GitHubContributionGraph({ weeks }: GitHubContributionData) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const levelMap = {
    NONE: { color: "bg-base-300" as const, scale: "scale-100" as const },
    FIRST_QUARTILE: {
      color: "bg-primary/25" as const,
      scale: "scale-125" as const,
    },
    SECOND_QUARTILE: {
      color: "bg-primary/50" as const,
      scale: "scale-150" as const,
    },
    THIRD_QUARTILE: {
      color: "bg-primary/75" as const,
      scale: "scale-175" as const,
    },
    FOURTH_QUARTILE: {
      color: "bg-primary" as const,
      scale: "scale-200" as const,
    },
  } satisfies Record<string, { color: string; scale: string }>;

  return (
    <div ref={scrollRef} className="w-full overflow-x-auto scroll-smooth">
      <div className="inline-flex gap-3 p-4">
        {weeks.map((week) => (
          <div
            key={week.contributionDays.map((d) => d.date).join("-")}
            className="flex flex-col gap-3"
          >
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                className={`h-1.5 w-1.5 rounded-full ${
                  levelMap[day.contributionLevel]?.color || levelMap.NONE.color
                } ${
                  levelMap[day.contributionLevel]?.scale || levelMap.NONE.scale
                } transition-transform duration-200 hover:scale-250`}
                title={`${day.date}: ${day.contributionCount} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
