import type { MetaFunction } from "@remix-run/node";
import clsx from "clsx";
import { Hamberger } from "~/components/hamberger";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me" },
    {
      name: "Kanaru's website, portfolio, blog",
      content: "Welcome to kanaru.me!",
    },
  ];
};

export default function App() {
  return (
    <div>
      <div
        className={clsx(
          "h-screen",
          "bg-black",
          ["flex", "flex-col", "justify-center"],
          ["items-center", "md:items-start"]
        )}
      >
        <Hamberger size={120} />
        <h1 className={clsx("pb-7", "text-4xl", "text-white", "font-bold")}>
          kanaru.me
        </h1>
      </div>
    </div>
  );
}
