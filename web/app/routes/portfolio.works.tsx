import { WorkCard } from "~/features/works/components/WorkCard";
import { works } from "~/features/works/contents/contents";

export default function WorksPage() {
  return (
    <div>
      <h1 className="mb-4 font-extrabold text-3xl">Works</h1>
      <div className="grid grid-cols-[repeat(auto-fill,20rem)] gap-4">
        {works.map((work) => (
          <WorkCard
            key={work.name}
            workName={work.name}
            description={work.description}
            image={work.image}
            links={work.links}
            techs={work.techs}
          />
        ))}
      </div>
    </div>
  );
}
