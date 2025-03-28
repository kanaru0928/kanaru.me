import { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me Portfolio | Skils" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
};

export default function SkilsPage() {
  return <h1>Skils</h1>;
}
