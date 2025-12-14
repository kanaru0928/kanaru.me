import { SkillCard } from "~/features/skills/components/SkillCard";
import { skills } from "~/features/skills/contents/contents";

export default function SkillsPage() {
  return (
    <div>
      <h1 className="mb-4 font-extrabold text-3xl">Skills</h1>
      {skills.map((skill) => (
        <SkillCard
          key={skill.name}
          name={skill.name}
          tags={skill.tags}
          proficiency={skill.proficiency}
          description={skill.description}
          Icon={skill.Icon}
        />
      ))}
    </div>
  );
}
