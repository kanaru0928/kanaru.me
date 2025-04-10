import { Link, MetaFunction } from "react-router";
import { css } from "styled-system/css";
import { grid, stack } from "styled-system/patterns";
import { WorksCard } from "~/components/works-card";
import { works } from "~/contents/works";

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
    <div className={stack()}>
      <h1
        className={css({
          textStyle: "heading1",
        })}
      >
        Works
      </h1>
      <div
        className={grid({
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(200px, 100%), 1fr))",
          gap: "4",
          justifyItems: "stretch",
        })}
      >
        {works.map((work) => (
          <WorksCard
            title={work.title}
            imageSource={work.imageSource}
            imageAlt={work.title}
            link={work.detailPage}
          >
            <p>{work.description}</p>
          </WorksCard>
        ))}
      </div>
    </div>
  );
}
