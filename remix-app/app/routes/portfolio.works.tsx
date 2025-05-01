import { MetaFunction } from "react-router";
import { css } from "styled-system/css";
import { center, grid, hstack, stack } from "styled-system/patterns";
import { token } from "styled-system/tokens";
import { Card } from "~/components/works-card";
import { linkTypes, works } from "~/contents/works";

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
          <Card
            title={work.title}
            imageSource={work.imageSource}
            imageAlt={work.title}
            link={work.detailPage}
          >
            <p className={css({ mb: "2" })}>{work.description}</p>
            <div className={hstack({ gap: "1.5" })}>
              {work.links.map((link) => {
                const Icon = linkTypes[link.type].icon;
                return (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={css({
                      textStyle: "body/markdown",
                      _hover: {
                        textDecoration: "underline",
                      },
                    })}
                  >
                    <div
                      className={center({
                        rounded: "md",
                        p: "1",
                      })}
                      style={{
                        backgroundColor: token(
                          `colors.${linkTypes[link.type].color}`
                        ),
                      }}
                    >
                      <Icon
                        size={16}
                        color={token(`colors.${linkTypes[link.type].iconColor}`)}
                      />
                    </div>
                  </a>
                );
              })}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
