import { ExternalLink } from "lucide-react";

type LinkCardProps = {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
};

/**
 * OGP情報を表示するリンクカードコンポーネント
 */
export function LinkCard({
  url,
  title,
  description,
  image,
  siteName,
}: LinkCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="not-prose my-4 block"
    >
      <div className="card card-compact lg:card-side border border-base-300 bg-base-100 shadow-md transition-shadow hover:shadow-xl">
        {image && (
          <figure className="h-48 shrink-0 lg:h-auto lg:w-48">
            <img
              src={image}
              alt={title || url}
              className="h-full w-full object-cover"
            />
          </figure>
        )}
        <div className="card-body">
          <h3 className="card-title line-clamp-2 text-base">{title || url}</h3>
          {description && (
            <p className="line-clamp-3 text-base-content/70 text-sm">
              {description}
            </p>
          )}
          <div className="mt-auto flex items-center gap-2 text-base-content/50 text-xs">
            {siteName && <span>{siteName}</span>}
            {siteName && <span>•</span>}
            <ExternalLink className="h-3 w-3" />
            <span className="truncate">{new URL(url).hostname}</span>
          </div>
        </div>
      </div>
    </a>
  );
}
