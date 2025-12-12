import { Outlet, redirect } from "react-router";
import type { Route } from "./+types/portfolio";

export function meta() {
  return [
    { title: "kanaru.me | Portfolio" },
    { name: "description", content: "Welcome to kanaru.me!" },
  ];
}

export function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/portfolio" || url.pathname === "/portfolio/") {
    return redirect("/portfolio/about");
  }
  return null;
}

export default function PortfolioLayout() {
  return (
    <div className="wrap-anywhere min-h-full break-keep p-8">
      <meta
        property="og:image"
        content={`${import.meta.env.VITE_BASE_URL}/og-image.png`}
      />
      <meta property="og:title" content="kanaru.me" />
      <meta property="og:type" content="website" />
      <meta property="og:description" content="My homepage 🏠" />
      <Outlet />
    </div>
  );
}
