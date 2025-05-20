import { TZDate } from "@date-fns/tz";
import { format, parse, subMonths } from "date-fns";
import { getGitHubToken } from "./parameters";

export async function getGithubContributesByMonth(
  dates: { year: number; month: number }[]
): Promise<Record<string, number>> {
  const queries = dates.map(({ year, month }) => {
    const nextMonth = month + 1 > 12 ? 1 : month + 1;
    const nextYear = month + 1 > 12 ? year + 1 : year;

    const from = new TZDate(year, month - 1, "Asia/Tokyo");
    const to = new TZDate(nextYear, nextMonth - 1, "Asia/Tokyo");

    return `${format(from, "MMMyy")}: contributionsCollection (from: "${from.toISOString()}", to: "${to.toISOString()}") {
            contributionCalendar {
              totalContributions
            }
          }`;
  });

  const query = {
    query: `
    query {
      user(login: "kanaru0928") {
        ${queries.join("\n")}
      }
    }
    `,
  };

  if (!process.env.GITHUB_ENDPOINT) {
    throw new Error("GITHUB_ENDPOINT is not defined");
  }

  const response = await fetch(process.env.GITHUB_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await getGitHubToken()}`,
      "Content-Type": "application/json",
      "User-Agent": "kanaru.me",
    },
    body: JSON.stringify(query),
  });
  const json = await response.json();
  // console.log(json);
  Object.keys(json.data.user).forEach((key) => {
    json.data.user[key] =
      json.data.user[key].contributionCalendar.totalContributions;
  });

  return json.data.user;
}

export async function getGithubContributesChart() {
  "use server";
  
  let date = new Date();

  const data = await getGithubContributesByMonth(
    Array.from({ length: 12 }, () => {
      const year = date.getFullYear();
      const month = date.getMonth();
      date = subMonths(date, 1);
      return {
        year,
        month: month + 1,
      };
    })
  );

  const contributes = Object.entries(data).map(([key, value]) => ({
    month: format(parse(key, "MMMyy", new Date()), "yy MMM"),
    amt: value,
  })).reverse();

  return contributes;
}
