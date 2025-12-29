import { formatISO9075 } from "date-fns";
import { ChevronRight, LoaderCircle } from "lucide-react";
import { NavLink } from "react-router";

type ArticleCardPropsBase = {
  title: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  linkTo: string;
};

type ArticleCardProps =
  | (ArticleCardPropsBase & { skeleton?: false })
  | (Partial<ArticleCardPropsBase> & { skeleton: true });

export function ArticleCard({
  skeleton,
  title,
  tags,
  createdAt,
  updatedAt,
  linkTo,
}: ArticleCardProps) {
  return (
    <div className="card card-border bg-base-100 shadow-sm">
      <div className="card-body">
        <div className="flex flex-1 flex-col justify-between gap-4">
          <div>
            <div className="card-title">
              {skeleton ? (
                <div className="skeleton mb-2 h-8 w-3/4"></div>
              ) : (
                <h2>{title}</h2>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {skeleton ? (
                <>
                  <div className="skeleton h-4 w-8"></div>
                  <div className="skeleton h-4 w-16"></div>
                  <div className="skeleton h-4 w-10"></div>
                </>
              ) : (
                tags.map((tag) => (
                  <div
                    className="badge badge-sm overflow-hidden text-ellipsis whitespace-nowrap"
                    key={tag}
                  >
                    {tag}
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2 text-base-content text-sm">
                作成日
                {skeleton ? (
                  <div className="skeleton h-4 w-18"></div>
                ) : (
                  <span>
                    {formatISO9075(new Date(createdAt), {
                      representation: "date",
                    })}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-base-content text-sm">
                更新日
                {skeleton ? (
                  <div className="skeleton h-4 w-18"></div>
                ) : (
                  <span>
                    {formatISO9075(new Date(updatedAt), {
                      representation: "date",
                    })}
                  </span>
                )}
              </div>
            </div>
            <NavLink to={linkTo || "#"}>
              {({ isPending }) => (
                <button
                  className="btn btn-primary"
                  type="button"
                  disabled={isPending || skeleton}
                >
                  記事を読む
                  {isPending || skeleton ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <ChevronRight />
                  )}
                </button>
              )}
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
