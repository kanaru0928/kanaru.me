import { Outlet } from "react-router";
import { cn } from "~/lib/utils";

export default function ArticlesRoute() {
  return (
    <div className="flex justify-center p-8 pb-24">
      <article
        className={cn(
          "prose max-w-[600px] text-justify",
          "prose-h1:mb-8",
          "prose-h2:border-b-2 prose-h2:border-b-primary prose-h2:pb-1.5 prose-h1:text-4xl prose-h2:before:mr-3 prose-h2:before:text-primary/60 prose-h2:before:text-xl prose-h2:before:content-['##']",
          "prose-h3:before:mr-2 prose-h3:before:text-lg prose-h3:before:text-secondary-content/60 prose-h3:before:content-['###']",
          "prose-h4:before:mr-2 prose-h4:before:text-secondary-content/60 prose-h4:before:text-sm prose-h4:before:content-['####']",
          "prose-img:block prose-img:h-auto prose-img:w-full has-prose-img:w-full has-prose-img:max-w-[600px]",
          "prose-blockquote:*:before:content-none prose-blockquote:*:after:content-none"
        )}
      >
        <Outlet />
      </article>
    </div>
  );
}
