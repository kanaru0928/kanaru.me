export interface ContributionDay {
  date: string;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
  contributionCount: number;
}

export interface ContributionWeek {
  contributionDays: ContributionDay[];
}

export interface GitHubContributionData {
  weeks: ContributionWeek[];
}

export async function getGitHubContributionData() {
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
  return { weeks };
}
