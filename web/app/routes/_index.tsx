import { GitHubContributionGraph } from "~/components/GitHubContributionGraph";
import type { Route } from "./+types/_index";

export function meta() {
  return [
    { title: "kanaru.me" },
    { name: "description", content: "Welcome to kanaru.me!" },
  ];
}

interface ContributionDay {
  date: string;
  contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
  contributionCount: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export async function loader() {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_USERNAME = "kanaru0928";

  const query = `
    query($userName:String!) {
      user(login: $userName) {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionLevel
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { userName: GITHUB_USERNAME },
    }),
  });

  const result = await response.json();
  const weeks: ContributionWeek[] =
    result.data?.user?.contributionsCollection?.contributionCalendar?.weeks ||
    [];

  return weeks;
}

export default function Home({ loaderData }: Route.ComponentProps) {
  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse gap-12">
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl font-bold">kanaru.me</h1>
          <p className="py-6">the University of Electro-Communications</p>
          <div className="flex justify-center lg:justify-start gap-4">
            <a
              href="https://github.com/kanaru0928"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://x.com/Kanaru49570357"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>
        <div className="w-full max-w-md">
          <GitHubContributionGraph weeks={loaderData} />
        </div>
      </div>
    </div>
  );
}
