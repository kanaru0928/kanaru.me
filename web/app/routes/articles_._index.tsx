import { useLoaderData } from "react-router";
import { ArticleCard } from "~/features/articles/components/ArticleCard";
import { apiClient } from "~/lib/apiClient";

export async function loader() {
  const { data, error } = await apiClient.GET("/api/articles");
  if (error || !data) {
    throw new Response("Failed to load articles", { status: 500 });
  }
  return { articles: data };
}

export default function Articles() {
  const { articles } = useLoaderData<typeof loader>();
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(18em,1fr))] gap-4 p-6">
      {articles.map((article) => (
        <ArticleCard
          key={article.slug}
          title={article.title}
          tags={article.tags}
          createdAt={article.createdAt}
          updatedAt={article.updatedAt}
          linkTo={`/articles/${article.slug}`}
        />
      ))}
    </div>
  );
}
