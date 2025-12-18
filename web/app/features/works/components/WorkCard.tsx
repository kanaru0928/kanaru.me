import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

type WorkCardProps = {
  workName: string;
  description: string;
  image: string;
  links?: {
    name: string;
    to: string;
    Icon: ReactNode;
    color?: string;
  }[];
  techs?: string[];
} & ComponentProps<"div">;

export function WorkCard({
  workName,
  description,
  image,
  className,
  links,
  techs,
  ...props
}: WorkCardProps) {
  return (
    <div
      className={cn("card break-normal bg-base-100 shadow-sm", className)}
      {...props}
    >
      <figure className="aspect-video">
        <img src={image} alt="" className="h-full w-full object-cover" />
      </figure>
      <div className="card-body">
        <h3 className="card-title">{workName}</h3>
        <p className="text-base-content/60">{description}</p>
        {techs && (
          <div className="mt-2 flex flex-wrap gap-1">
            {techs.map((tech) => (
              <Link
                key={tech}
                className="btn btn-xs btn-outline btn-secondary rounded-sm text-base-content"
                role="button"
                to={`/portfolio/skills?keywords=${encodeURIComponent(tech)}`}
              >
                {tech}
              </Link>
            ))}
          </div>
        )}
        <div className="card-actions justify-end">
          {links && (
            <div className="card-actions gap-2">
              {links.map(({ name, to, Icon, color }) => (
                <Link
                  to={to}
                  key={name}
                  role="button"
                  title={name}
                  className={cn(
                    "btn btn-square btn-sm btn-soft",
                    color && `btn-${color}`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {Icon}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
