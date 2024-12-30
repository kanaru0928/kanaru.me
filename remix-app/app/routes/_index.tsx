import type { MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { IconChevronsDown } from "@tabler/icons-react";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Chip } from "~/components/chip";
import { GithubGraph } from "~/components/github-graph";
import { Hamberger } from "~/components/hamberger";
import { HomeBG } from "~/components/home-bg";
import { getGithubContributesChart } from "~/loader/github-contributes";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me" },
    {
      name: "Kanaru's website, portfolio, blog",
      content: "Welcome to kanaru.me!",
    },
  ];
};

interface Contribute {
  month: string;
  amt: number;
}

interface LoaderData {
  contributes: Contribute[];
}

export const loader = async () => {
  const contributes = await getGithubContributesChart();

  return new Response(JSON.stringify({ contributes }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export default function App() {
  const { contributes } = useLoaderData<LoaderData>();

  return (
    <div
      className={css({
        color: "white",
      })}
    >
      <div
        className={css({
          h: "screen",
        })}
      >
        <HomeBG />
        <div
          className={flex({
            direction: "column",
            justify: "center",
            align: "center",
            h: "full",
            position: "relative",
            zIndex: 1,
            pb: 10,
          })}
        >
          <Hamberger size={120} />
          <h1
            className={css({
              textGradient: "to-r",
              gradientFrom: "violet.300",
              gradientVia: "violet.50",
              gradientTo: "violet.300",
              fontWeight: "bold",
              fontSize: "4xl",
              position: "relative",
              _before: {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bg: "violet.300/60",
                filter: "auto",
                blur: "2xl",
                zIndex: -1,
              },
            })}
          >
            kanaru.me
          </h1>
          <Chip>v0.0.1</Chip>
          <GithubGraph contributes={contributes} />
        </div>
        <div
          className={css({
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "center",
          })}
        >
          <IconChevronsDown
            size={200}
            className={css({
              color: "white/10",
              animation: "bounce 2s infinite",
            })}
          />
        </div>
      </div>
      <div
        className={css({
          p: 5,
          bg: "zinc.900",
        })}
      >
        <h2
          className={css({
            color: "white",
          })}
        >
          aaaa
        </h2>
      </div>
    </div>
  );
}
