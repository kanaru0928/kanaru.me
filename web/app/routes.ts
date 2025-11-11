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
            file.replace("./articles", "/articles").replace(/\.(md|mdx)$/, ""),
            file,
          ),
      )
    : null;

export default [
  ...(await flatRoutes({
    ignoredRouteFiles: articleRoutes ? ["**/articles*.tsx"] : [],
  })),
  ...(articleRoutes ? [layout("./routes/articles.tsx", articleRoutes)] : []),
] satisfies RouteConfig;
