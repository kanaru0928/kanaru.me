import { getGitHubContributionData } from "~/features/top-page/github";
import { HeroSection } from "~/features/top-page/components/HeroSection";
import type { Route } from "./+types/_index";

export function meta() {
  return [
    { title: "kanaru.me" },
    { name: "description", content: "Welcome to kanaru.me!" },
  ];
}

export async function loader() {
  const githubData = await getGitHubContributionData();

  return { githubData };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <>
      <HeroSection gitHubContributionData={loaderData.githubData} />
    </>
  );
}
