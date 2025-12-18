import { WorkCard } from "~/features/works/components/WorkCard";
import { works } from "~/features/works/contents/contents";

export default function WorksPage() {
  return (
    <div>
      <h1 className="mb-4 font-extrabold text-3xl">Works</h1>
      <p className="mb-8 break-normal text-base-content/70">
        これまでに制作した作品の一覧です。代表的なものを掲載しています。
      </p>
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
