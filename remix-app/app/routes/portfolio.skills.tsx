import { MetaFunction } from "react-router";
import { css } from "styled-system/css";
import { stack } from "styled-system/patterns";
import { Skills } from "~/components/skill-list";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me Portfolio | Skills" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
};

export default function SkillsPage() {
  return (
    <div className={stack()}>
      <h1
        className={css({
          textStyle: "heading1",
        })}
      >
        Skills
      </h1>
      <Skills />
    </div>
  );
}
