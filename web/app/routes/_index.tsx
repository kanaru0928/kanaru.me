import { GitHubContributionGraph } from "~/features/top-page/GitHubContributionGraph";
import type { Route } from "./+types/_index";
import { HeroSection } from "~/features/top-page/HeroSection";
import { getGitHubContributionData } from "~/features/top-page/github";

export function meta() {
  return [
    { title: "kanaru.me" },
    { name: "description", content: "Welcome to kanaru.me!" },
  ];
}

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

export async function loader() {
  const githubData = await getGitHubContributionData();

  return { githubData };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <main>
      <HeroSection gitHubContributionData={loaderData.githubData} />

    </main>
  );
}
