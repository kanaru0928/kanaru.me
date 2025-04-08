import { MetaFunction } from "react-router";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";
import DashboardContainer from "~/components/dashboard-container";
import { LogoAfterEffects } from "~/components/logo-aftereffects";
import { LogoDocker } from "~/components/logo-docker";
import { LogoIllustrator } from "~/components/logo-illustrator";
import { SkillIcon } from "~/components/skill-icon";
import { skills } from "~/contents/skills";

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
      {skills.map((category) => (
        <DashboardContainer
          key={category.name}
          className={css({ spaceY: "2" })}
        >
          <h2
            className={css({
              textStyle: "heading2",
            })}
          >
            {category.name}
          </h2>
          <div
            className={flex({
              gap: "2",
              flexWrap: "wrap",
            })}
          >
            {category.familier.map((skill) => (
              <SkillIcon
                key={skill.name}
                source={typeof skill.icon === "string" ? skill.icon : undefined}
                icon={typeof skill.icon !== "string" ? skill.icon : undefined}
                alt={skill.name}
              />
            ))}
          </div>
          <div className={flex({ gap: "2", flexWrap: "wrap" })}>
            {category.learning.map((skill) => (
              <SkillIcon
                key={skill.name}
                source={typeof skill.icon === "string" ? skill.icon : undefined}
                icon={typeof skill.icon !== "string" ? skill.icon : undefined}
                size={24}
                alt={skill.name}
              />
            ))}
          </div>
        </DashboardContainer>
      ))}
    </div>
  );
}
