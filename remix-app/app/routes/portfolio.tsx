import { MetaFunction } from "react-router";
import { css } from "styled-system/css";

const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me | Portfolio" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
};

const gradientProperties: { [key: string]: string } = {
  "--x-0": "14%",
  "--y-0": "8%",
  "--c-0": "hsla(207, 70%, 100%, 1)",
  "--c-1": "hsla(356, 78%, 92%, 1)",
  "--x-1": "38%",
  "--y-1": "34%",
  "--x-2": "52%",
  "--c-2": "hsla(272, 95%, 62%, 1)",
  "--y-2": "0%",
  "--x-3": "38%",
  "--y-3": "3%",
  "--c-3": "hsla(334, 73%, 51%, 1)",
  "--x-4": "42%",
  "--c-4": "hsla(356, 51%, 81%, 1)",
  "--y-4": "65%",
  backgroundColor: "hsla(217, 86%, 67%, 1)",
  backgroundImage:
    "radial-gradient(circle at var(--x-0) var(--y-0), var(--c-0) var(--s-start-0), transparent var(--s-end-0)), radial-gradient(circle at var(--x-1) var(--y-1), var(--c-1) var(--s-start-1), transparent var(--s-end-1)), radial-gradient(circle at var(--x-2) var(--y-2), var(--c-2) var(--s-start-2), transparent var(--s-end-2)), radial-gradient(circle at var(--x-3) var(--y-3), var(--c-3) var(--s-start-3), transparent var(--s-end-3)), radial-gradient(circle at var(--x-4) var(--y-4), var(--c-4) var(--s-start-4), transparent var(--s-end-4))",
  animation: "hero-gradient-animation 10s linear infinite alternate",
};

export default function PortfolioPage() {
  return (
    <div
      className={css({
        minHeight: "100vh",
        ...gradientProperties,
      })}
    >
      <h1>Portfolio</h1>
      <p>Welcome to your portfolio page!</p>
    </div>
  );
}
