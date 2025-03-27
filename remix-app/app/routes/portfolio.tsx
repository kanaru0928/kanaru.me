import { MetaFunction } from "react-router";

const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me | Portfolio" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
}

export default function PortfolioPage() {
  return (
    <div>
      <h1>Portfolio</h1>
      <p>Welcome to your portfolio page!</p>
    </div>
  );
}
