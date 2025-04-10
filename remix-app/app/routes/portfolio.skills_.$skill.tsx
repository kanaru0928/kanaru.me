import { MDXProvider } from "@mdx-js/react";
import { ReactNode } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { css } from "styled-system/css";
import { flex, hstack, stack } from "styled-system/patterns";
import { token } from "styled-system/tokens";
import { LevelIndicator } from "~/components/level-indicator";
import { SkillIcon } from "~/components/skill-icon";
import { levelColors, levelText, skills } from "~/contents/skills";
import { markdownStyles } from "~/styles/markdown";

export async function clientLoader({ params }: LoaderFunctionArgs) {
  const skillName = params.skill?.toLocaleLowerCase();

  if (!skillName) {
    throw new Response("Skill not found", { status: 404 });
  }

  const skill = skills
    .flatMap((category) => category.familiar)
    .concat(skills.flatMap((category) => category.learning))
    .find((skill) => skill.name.toLocaleLowerCase() === skillName);

  if (!skill) {
    throw new Response("Skill not found", { status: 404 });
  }

  try {
    const Contents = await import(
      `../contents/skills/${skillName.toLowerCase()}.mdx`
    );

    return {
      skill,
      Contents,
    };
  } catch (error) {
    return {
      skill,
      Contents: {
        default: () => null,
      },
    };
  }
}

export default function SkillsPage() {
  const { skill, Contents } = useLoaderData<typeof clientLoader>();

  console.log("contents", Contents);

  return (
    <div>
      <h1
        className={css({
          textStyle: "heading1",
          mb: "4",
        })}
      >
        {skill.name}
      </h1>
      <div className={hstack({ gap: "4", flexWrap: "wrap", mb: "4" })}>
        <SkillIcon
          className={flex()}
          source={skill.iconSource}
          icon={skill.icon as ReactNode}
          size={48}
          alt={skill.name}
        />
        <div className={stack({ gap: "2" })}>
          <p
            className={css({
              textStyle: "heading4/markdown",
            })}
          >
            Experience
          </p>
          <div className={css({ pl: "1" })}>
            <LevelIndicator level={skill.level || 1} />
            <p
              style={{
                color: token(`colors.${levelColors[skill.level || 1]}.700`),
              }}
            >
              {levelText[skill.level || 1]}
            </p>
          </div>
        </div>
      </div>
      <div className={markdownStyles}>
        <Contents.default />
      </div>
    </div>
  );
}
