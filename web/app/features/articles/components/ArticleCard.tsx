import { ChevronRight } from "lucide-react";
import { Link } from "react-router";

type ArticleCardProps = {
  title: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  linkTo: string;
};

export function ArticleCard({
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
              <h2>{title}</h2>
            </div>
            <div className="flex gap-4">
              {tags.map((tag) => (
                <div className="badge badge-sm" key={tag}>
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-base-content text-sm">
                作成日 {new Date(createdAt).toLocaleDateString()}
              </div>
              <div className="text-base-content text-sm">
                更新日 {new Date(updatedAt).toLocaleDateString()}
              </div>
            </div>
            <Link to={linkTo}>
              <button className="btn btn-primary" type="button">
                記事を読む <ChevronRight />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
