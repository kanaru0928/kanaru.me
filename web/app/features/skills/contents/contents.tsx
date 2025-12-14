import type { ReactNode } from "react";

const proficiencies = {
  // 触れたことがある
  beginner: 1,
  // 小規模なプロジェクトで使用したことがある
  intermediate: 2,
  // ドキュメントを見ながらある程度使いこなせる
  proficient: 3,
  // ドキュメントを見なくても使いこなせる
  advanced: 4,
  // 専門家レベルで使いこなせる
  expert: 5,
} as const;

type Proficiency = keyof typeof proficiencies;

type Skill = {
  name: string;
  tags: string[];
  proficiency: Proficiency;
  description?: string;
  Icon: ReactNode;
};

export const skills = [
  {
    name: "TypeScript",
    tags: ["言語", "Web"],
    proficiency: "expert",
    Icon: <i className="devicon-typescript-plain colored" />,
    description:
      "多くのプロジェクトで使用しています。フロントエンド、バックエンド、IaC で活用しています。",
  },
] satisfies Skill[];
