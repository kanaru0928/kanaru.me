import type { ReactNode } from "react";

type ProficiencyContent = {
  level: number;
  description: string;
  bgColor: string;
}

export const proficiencyMap = {
  beginner: {
    level: 1,
    description: "触れたことがある",
    bgColor: "bg-error",
  } as const,
  // 小規模なプロジェクトで使用したことがある
  intermediate: {
    level: 2,
    description: "小規模なプロジェクトで使用したことがある",
    bgColor: "bg-accent",
  } as const,
  // ドキュメントを見ながらある程度使いこなせる
  proficient: {
    level: 3,
    description: "ドキュメントを見ながらある程度使いこなせる",
    bgColor: "bg-warning",
  } as const,
  // ドキュメントを見なくても使いこなせる
  advanced: {
    level: 4,
    description: "ドキュメントを見なくても使いこなせる",
    bgColor: "bg-success",
  } as const,
  // 専門家レベルで使いこなせる
  expert: {
    level: 5,
    description: "専門家レベルで使いこなせる",
    bgColor: "bg-primary",
  } as const,
} satisfies Record<string, ProficiencyContent>;

export type Proficiency = keyof typeof proficiencyMap;

export type Skill = {
  name: string;
  tags: string[];
  proficiency: Proficiency;
  description?: string;
  Icon: ReactNode;
};
