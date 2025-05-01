import { ReactNode } from "react";
import { LogoAfterEffects } from "../components/logo-aftereffects";
import { LogoDocker } from "../components/logo-docker";
import { LogoIllustrator } from "../components/logo-illustrator";

export type Skill = {
  name: string;
  icon?: ReactNode;
  iconSource?: string;
  level?: 1 | 2 | 3 | 4 | 5;
};

export type SkillsCategory = {
  name: string;
  familiar: Skill[];
  learning: Skill[];
};

const SkillLevelNames = {
  BerieflyUsed: 1,
  Basic: 2,
  ProficientWithDocumentation: 3,
  Proficient: 4,
  Expert: 5,
} as const;

export const levelColors = {
  1: "red",
  2: "orange",
  3: "yellow",
  4: "green",
  5: "blue",
} as const;

export const levelText = {
  1: "Beriefly used",
  2: "Created basic projects",
  3: "Can implement with documentation",
  4: "Comfortable using independently",
  5: "Expert level",
};

export type MySkill = (typeof skills)[number][
  | "familiar"
  | "learning"][number]["name"];

export const skills = [
  {
    name: "Languages",
    familiar: [
      {
        name: "Python",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        level: SkillLevelNames.Expert,
      },
      {
        name: "JavaScript",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
        level: SkillLevelNames.Expert,
      },
      {
        name: "TypeScript",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
        level: SkillLevelNames.Expert,
      },
      {
        name: "C#",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "C++",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        level: SkillLevelNames.ProficientWithDocumentation,
      },
    ],
    learning: [
      {
        name: "Ruby",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
        level: SkillLevelNames.Basic,
      },
      {
        name: "C",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
        level: SkillLevelNames.Basic,
      },
      {
        name: "Java",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
        level: SkillLevelNames.Basic,
      },
      {
        name: "Dart",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg",
        level: SkillLevelNames.BerieflyUsed,
      },
      {
        name: "Swift",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
        level: SkillLevelNames.Basic,
      },
      {
        name: "Go",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
        level: SkillLevelNames.BerieflyUsed,
      },
      {
        name: "Rust",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
        level: SkillLevelNames.BerieflyUsed,
      },
    ],
  },
  {
    name: "Frameworks",
    familiar: [
      {
        name: "React",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "Next.js",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "Vite",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "React Router v7",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/reactrouter/reactrouter-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "Node.js",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "PyTorch",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "FastAPI",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg",
        level: SkillLevelNames.Expert,
      },
      {
        name: ".NET",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg",
        level: SkillLevelNames.Proficient,
      },
    ],
    learning: [
      {
        name: "Flutter",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
        level: SkillLevelNames.BerieflyUsed,
      },
      {
        name: "Unity",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg",
        level: SkillLevelNames.Basic,
      },
    ],
  },
  {
    name: "Tools",
    familiar: [
      {
        name: "Git",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "GitHub",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
        level: SkillLevelNames.Proficient,
      },
      { name: "Docker", icon: <LogoDocker width={36} height={36} />, level: 4 },
      {
        name: "AWS",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
        level: SkillLevelNames.ProficientWithDocumentation,
      },
      {
        name: "Terraform",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg",
        level: SkillLevelNames.ProficientWithDocumentation,
      },
      {
        name: "GitHub Actions",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg",
        level: SkillLevelNames.ProficientWithDocumentation,
      },
      {
        name: "Cloudflare",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg",
        level: SkillLevelNames.ProficientWithDocumentation,
      },
      {
        name: "VSCode",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "HTML5",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        level: SkillLevelNames.Expert,
      },
      {
        name: "CSS3",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
        level: SkillLevelNames.Expert,
      },
      {
        name: "OpenCV",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg",
        level: SkillLevelNames.ProficientWithDocumentation,
      },
      {
        name: "LaTeX",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/latex/latex-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "Linux",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
        level: SkillLevelNames.Proficient,
      },
      {
        name: "AfterEffects",
        icon: <LogoAfterEffects width={36} height={36} />,
        level: SkillLevelNames.Proficient,
      },
      {
        name: "Illustrator",
        icon: <LogoIllustrator width={36} height={36} />,
        level: SkillLevelNames.ProficientWithDocumentation,
      },
    ],
    learning: [
      {
        name: "MySQL",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
        level: SkillLevelNames.Basic,
      },
      {
        name: "Firebase",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
        level: SkillLevelNames.Basic,
      },
      {
        name: "Photoshop",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
        level: SkillLevelNames.ProficientWithDocumentation,
      },
      {
        name: "Figma",
        iconSource:
          "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
        level: SkillLevelNames.Basic,
      },
    ],
  },
] as const satisfies SkillsCategory[];
