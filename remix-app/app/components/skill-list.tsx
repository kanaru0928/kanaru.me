import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { skills } from "~/contents/skills";
import { DashboardContainer } from "./dashboard-container";
import { SkillCard } from "./skill-card";

export function Skills() {
  return skills.map((category) => (
    <DashboardContainer key={category.name} className={css({ spaceY: "2" })}>
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
        {category.familiar.map((skill) => (
          <SkillCard key={skill.name} skill={skill} familiarity="familiar" />
        ))}
      </div>
      <div className={flex({ gap: "2", flexWrap: "wrap" })}>
        {category.learning.map((skill) => (
          <SkillCard key={skill.name} skill={skill} familiarity="learning" />
        ))}
      </div>
    </DashboardContainer>
  ));
}
