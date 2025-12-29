import { Suspense } from "react";
import { Await } from "react-router";
import { ArticleCard } from "~/features/articles/components/ArticleCard";
import { apiClient } from "~/lib/apiClient";
import type { Route } from "./+types/articles_._index";

export async function loader() {
  const articles = apiClient.GET("/api/articles").then(({ data, error }) => {
    if (error || !data) {
      throw new Response("Failed to load articles", { status: 500 });
    }
    return data;
  });

  return { articles };
}

export default function Articles({ loaderData }: Route.ComponentProps) {
  const { articles } = loaderData;

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(18em,1fr))] gap-4 p-6">
      <Suspense
        fallback={
          <>
            <ArticleCard skeleton />
            <ArticleCard skeleton />
            <ArticleCard skeleton />
          </>
        }
      >
        <Await resolve={articles}>
          {(resolved) =>
            resolved.map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                tags={article.tags}
                createdAt={article.createdAt}
                updatedAt={article.updatedAt}
                linkTo={`/articles/${article.slug}`}
              />
            ))
          }
        </Await>
      </Suspense>
    </div>
  );
}
