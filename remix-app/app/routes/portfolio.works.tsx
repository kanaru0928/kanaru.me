import { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me Portfolio | Works" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
};

export default function WorksPage() {
  return <h1>Works</h1>;
}
