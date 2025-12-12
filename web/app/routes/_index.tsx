import { HeroSection } from "~/features/top-page/components/HeroSection";
import { getGitHubContributionData } from "~/features/top-page/loaders/github";
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
      <meta
        property="og:image"
        content={`${import.meta.env.VITE_BASE_URL}/og-image.png`}
      />
      <meta property="og:title" content="kanaru.me" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="My homepage 🏠" />
      <HeroSection gitHubContributionData={loaderData.githubData} />;
    </>
  );
}
