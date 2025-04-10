import { MDXProvider } from "@mdx-js/react";
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { SkillIcon } from "~/components/skill-icon";
import { levelText, skills } from "~/contents/skills";
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
      <div className={flex()}>
        <SkillIcon
          source={skill.iconSource}
          icon={skill.icon}
          size={48}
          alt={skill.name}
        />
      </div>
      <table
        className={css({
          my: "2",
        })}
      >
        <tbody
          className={css({
            "& tr": {
              borderBottom: "1px solid",
              borderColor: "gray.800",
            },
            "& th,td": {
              padding: "2",
              textAlign: "left",
            },
          })}
        >
          <tr className={css({ borderTop: "1px solid" })}>
            <th>Proficiency</th>
            <td>{skill.level}</td>
          </tr>
          <tr>
            <th>Experience</th>
            <td>{levelText[skill.level || 1]}</td>
          </tr>
        </tbody>
      </table>

      <div className={markdownStyles}>
        <Contents.default />
      </div>
    </div>
  );
}
