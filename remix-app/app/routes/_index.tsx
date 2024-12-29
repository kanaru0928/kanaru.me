import type { MetaFunction } from "@remix-run/node";
import chroma from "chroma-js";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { token } from "styled-system/tokens";
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
        className={flex({
          direction: "column",
          justify: "center",
          align: "center",
          bg: "black",
          h: "screen",
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
        <div
          className={css({
            color: "white",
            bg: "zinc.600/60",
            backdropFilter: "auto",
            backdropBlur: "md",
            px: 3,
            py: 0.5,
            borderRadius: "full",
            borderTop: "solid 1px",
            borderLeft: "solid 1px",
            borderColor: "zinc.50/20",
            my: 3,
          })}
        >
          <p
            className={css({
              fontSize: "sm",
              fontWeight: "medium",
            })}
          >
            v0.0.1
          </p>
        </div>
      </div>
    </div>
  );
}
