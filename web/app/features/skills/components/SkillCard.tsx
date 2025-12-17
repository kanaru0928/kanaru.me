import { cn } from "~/lib/utils";
import { type Proficiency, proficiencyMap } from "../contents/types";

type SkillCardProps = {
  name: string;
  tags: string[];
  proficiency: Proficiency;
  description?: string;
  Icon: React.ReactNode;
} & object;

export function SkillCard({
  name,
  tags,
  proficiency,
  description,
  Icon,
  ...flippedProps
}: SkillCardProps) {
  return (
    <div className="card bg-base-100 shadow-sm" {...flippedProps}>
      <div className="card-body flex flex-row flex-wrap items-center gap-8">
        <div className="flex items-center justify-center rounded-md bg-white p-4 text-5xl">
          {Icon}
        </div>
        <div className="min-w-18 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="card-title">{name}</h2>
            <div className="flex gap-1">
              {Array.from({ length: proficiencyMap[proficiency].level }).map(
                (_, index) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: 個数を表現するためだけの配列なので問題ない
                    key={index}
                    className={cn(
                      "tooltip tooltip-secondary h-4 w-2 rounded-full hover:scale-125",
                      proficiencyMap[proficiency].bgColor,
                    )}
                  >
                    <div className="tooltip-content">
                      <span className="text-[0.67rem]">
                        {
                          Object.values(proficiencyMap).find(
                            (p) => p.level === index + 1,
                          )?.description
                        }
                      </span>
                    </div>
                  </div>
                ),
              )}
              {Array.from({
                length: 5 - proficiencyMap[proficiency].level,
              }).map((_, index) => (
                <div
                  // biome-ignore lint/suspicious/noArrayIndexKey: 個数を表現するためだけの配列なので問題ない
                  key={index}
                  className="h-4 w-2 rounded-full bg-base-300"
                />
              ))}
            </div>
          </div>
          <p className="text-base-content/70">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag} className="badge">
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
