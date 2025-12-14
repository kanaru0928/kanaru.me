import type { Skill } from "./types";

export const skills = [
  {
    name: "TypeScript",
    tags: ["言語", "Web"],
    proficiency: "expert",
    Icon: <i className="devicon-typescript-plain colored" />,
    description:
      "多くのプロジェクトで使用しています。フロントエンド、バックエンド、IaC で活用しています。",
  },
  {
    name: "React",
    tags: ["フレームワーク", "Web", "フロントエンド"],
    proficiency: "advanced",
    Icon: <i className="devicon-react-original colored" />,
    description:
      "主にフロントエンド開発で使用しています。主に Next.js や Remix で開発しています。",
  },
  {
    name: "Next.js",
    tags: ["フレームワーク", "Web", "フロントエンド"],
    proficiency: "proficient",
    Icon: <i className="devicon-nextjs-plain colored" />,
    description: "主にフロントエンド開発で使用しています。",
  },
  {
    name: "React Router",
    tags: ["フレームワーク", "Web", "フロントエンド"],
    proficiency: "proficient",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactrouter/reactrouter-original.svg"
        alt="React Router"
        className="h-12"
      />
    ),
    description: "主にフレームワークとしてこのサイトで使用しています。",
  },
] satisfies Skill[];
