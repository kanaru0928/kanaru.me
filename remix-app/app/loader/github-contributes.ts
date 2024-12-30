import { TZDate } from "@date-fns/tz";
import { format, subMonths } from "date-fns";

export async function getGithubContributesByMonth(
  year: number,
  month: number
): Promise<number> {
  const nextMonth = month + 1 > 12 ? 1 : month + 1;
  const nextYear = month + 1 > 12 ? year + 1 : year;

  const from = new TZDate(year, month - 1, "Asia/Tokyo").toISOString();
  const to = new TZDate(nextYear, nextMonth - 1, "Asia/Tokyo").toISOString();

  const query = {
    query: `
    query {
      user(login: "kanaru0928") {
        contributionsCollection (from: "${from}", to: "${to}") {
          contributionCalendar {
            totalContributions
          }
        }
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
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "kanaru.me",
    },
    body: JSON.stringify(query),
  });
  const json = await response.json();
  return json.data.user.contributionsCollection.contributionCalendar
    .totalContributions;
}

export async function getGithubContributesChart() {
  let date = new Date();

  const promises: Promise<number>[] = [];
  for (let i = 0; i < 12; i++) {
    promises.push(
      getGithubContributesByMonth(date.getFullYear(), date.getMonth() + 1)
    );
    date = subMonths(date, 1);
  }

  const data = await Promise.all(promises);

  const contributes = data.map((amt, i) => ({
    month: format(subMonths(new Date(), i), "yy MMM"),
    amt,
  })).reverse();

  return contributes;
}
