type SkillCardProps = {
  name: string;
  tags: string[];
  proficiency: string;
  description?: string;
  Icon: React.ReactNode;
};

export function SkillCard({
  name,
  tags,
  proficiency,
  description,
  Icon,
}: SkillCardProps) {
  return (
    <div className="card">
      <div className="flex items-center gap-4">
        <div className="text-7xl">{Icon}</div>
        <div>
          <h2>{name}</h2>
          <p>{proficiency}</p>
          <p>{description}</p>
          <div>
            {tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
