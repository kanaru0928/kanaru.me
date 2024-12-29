import type { MetaFunction } from "@remix-run/node";
import { IconChevronsDown } from "@tabler/icons-react";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Chip } from "~/components/chip";
import { GithubGraph } from "~/components/github-graph";
import { Hamberger } from "~/components/hamberger";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me" },
    {
      name: "Kanaru's website, portfolio, blog",
      content: "Welcome to kanaru.me!",
    },
  ];
};

export default function App() {
  return (
    <div>
      <div
        className={css({
          bg: "black",
          h: "screen",
        })}
      >
        <div
          className={flex({
            direction: "column",
            justify: "center",
            align: "center",
            h: "full",
            position: "relative",
            zIndex: 0,
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
                bg: "violet.300/70",
                filter: "auto",
                blur: "2xl",
                zIndex: -1,
              },
            })}
          >
            kanaru.me
          </h1>
          <Chip>v0.0.1</Chip>
          <GithubGraph />
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
              color: "white/15",
              animation: "bounce 2s infinite",
            })}
          />
        </div>
      </div>
    </div>
  );
}
