import { css } from "styled-system/css";
import { flex, hstack } from "styled-system/patterns";
import { LevelIndicator } from "./level-indicator";
import { levelColors, levelText, Skill } from "~/contents/skills";
import * as HoverCard from "@radix-ui/react-hover-card";
import { Link } from "react-router";
import { SkillIcon } from "./skill-icon";
import { token } from "styled-system/tokens";

type Props = {
  skill: Skill;
  familiarity: "familiar" | "learning";
};

export function SkillCard({ skill, familiarity }: Props) {
  return (
    <>
      <HoverCard.Root key={skill.name}>
        <HoverCard.Trigger asChild>
          <Link to={skill.name.toLowerCase()}>
            <SkillIcon
              source={skill.iconSource}
              icon={skill.icon}
              size={familiarity === "familiar" ? 36 : 24}
              alt={skill.name}
            />
          </Link>
        </HoverCard.Trigger>
        <HoverCard.Portal>
          <HoverCard.Content
            className={css({
              bg: "white",
              padding: "3",
              borderRadius: "md",
              boxShadow: "lg",
            })}
          >
            <div className={hstack({ mb: "2" })}>
              <h3 className={css({ textStyle: "heading3" })}>{skill.name}</h3>
              <p
                className={flex({
                  color: "gray.500",
                  fontSize: "sm",
                  fontWeight: "medium",
                  px: "3",
                  py: "0.5",
                  borderRadius: "full",
                  bg: "gray.100",
                  align: "center",
                  justify: "center",
                })}
              >
                {familiarity}
              </p>
            </div>
            <div className={hstack()}>
              <span>Exp.</span>
              <LevelIndicator level={skill.level || 1} />
            </div>
            <p
              style={{
                color: token(`colors.${levelColors[skill.level || 1]}.700`),
              }}
            >
              {levelText[skill.level || 1]}
            </p>
            <HoverCard.Arrow
              className={css({
                fill: "white",
              })}
            />
          </HoverCard.Content>
        </HoverCard.Portal>
      </HoverCard.Root>
    </>
  );
}
