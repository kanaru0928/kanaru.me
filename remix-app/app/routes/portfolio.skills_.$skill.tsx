import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { css } from "styled-system/css";
import { skills } from "~/contents/skills";

export async function loader({ params }: LoaderFunctionArgs) {
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
  return {
    skill,
  };
}

export default function SkillsPage() {
  const { skill } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1
        className={css({
          textStyle: "heading1",
        })}
      >
        {skill.name}
      </h1>
      <p>Skill details for {skill.name}</p>
    </div>
  );
}
