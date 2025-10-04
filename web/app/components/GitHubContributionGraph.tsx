import { useEffect, useRef } from "react";

interface ContributionDay {
  date: string;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubContributionData {
  weeks: ContributionWeek[];
}

export function GitHubContributionGraph({ weeks }: GitHubContributionData) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const getContributionClass = (level: string) => {
    const levelMap: Record<string, string> = {
      NONE: "bg-base-300",
      FIRST_QUARTILE: "bg-primary/25",
      SECOND_QUARTILE: "bg-primary/50",
      THIRD_QUARTILE: "bg-primary/75",
      FOURTH_QUARTILE: "bg-primary",
    };
    return levelMap[level] || "bg-base-300";
  };

  return (
    <div ref={scrollRef} className="w-full overflow-x-auto">
      <div className="inline-flex gap-1.5 p-4">
        {weeks.map((week) => (
          <div
            key={week.contributionDays.map((d) => d.date).join("-")}
            className="flex flex-col gap-1.5"
          >
            {week.contributionDays.map((day) => (
              <div
                key={day.date}
                className={`w-4 h-4 rounded-sm ${getContributionClass(
                  day.contributionLevel
                )}`}
                title={`${day.date}: ${day.contributionCount} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
