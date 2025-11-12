import {
  layout,
  type RouteConfig,
  type RouteConfigEntry,
  route,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const articleRoutes =
  process.env.NODE_ENV === "development"
    ? Object.keys(
        import.meta.glob("./articles/**/*.{md,mdx}", {
          eager: true,
          query: "?url",
        }),
      ).map(
        (file): RouteConfigEntry =>
          route(
            file.replace("./articles", "/articles").replace(/\.(md|mdx)$/, "/edit"),
            file,
          ),
      )
    : [];

export default [
  ...(await flatRoutes({
    ignoredRouteFiles: ["**/articles.tsx", "**/articles.$slug.tsx"],
  })),
  layout("./routes/articles.tsx", [
    ...articleRoutes,
    route("/articles/:slug", "./routes/articles.$slug.tsx"),
  ]),
] satisfies RouteConfig;
