import { MetaFunction } from "react-router";
import { css } from "styled-system/css";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me Portfolio | Works" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
};

export default function WorksPage() {
  return (
    <div
      className={css({
        px: "6",
        py: "2",
      })}
    >
      <h1
        className={css({
          textStyle: "heading1",
        })}
      >
        Works
      </h1>
      <p>WIP</p>
    </div>
  );
}
