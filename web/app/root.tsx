import { MDXProvider } from "@mdx-js/react";
import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import type { Route } from "./+types/root";
import "./app.css";
import { mdxComponents } from "./features/mdx/mdx-components";
import { NavbarProvider } from "./features/navbar/components/NavbarProvider";
import { useTypekit } from "./hooks/useTypekit";

export function meta({ location }: Route.MetaArgs) {
  return [
    {
      name: "description",
      content: "My homepage 🏠",
    },
    {
      property: "og:title",
      content: "kanaru.me",
    },
    {
      property: "og:description",
      content: "My homepage 🏠",
    },
    {
      property: "og:type",
      content: "website"
    },
    {
      property: "og:url",
      content: `${process.env.PUBLIC_BASE_URL}${location.pathname}`,
    },
    {
      property: "og:image",
      content: `${process.env.PUBLIC_BASE_URL}/public/og-image.png`,
    }
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  useTypekit();

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@kanaru0928" />
        <meta name="twitter:creator" content="@kanaru0928" />
        <meta property="og:site_name" content="kanaru.me" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const location = useLocation();
  const drawerDefaultOpen = location.pathname !== "/";

  return (
    <NavbarProvider defaultOpen={drawerDefaultOpen}>
      <MDXProvider components={mdxComponents}>
        <Outlet />
      </MDXProvider>
    </NavbarProvider>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
