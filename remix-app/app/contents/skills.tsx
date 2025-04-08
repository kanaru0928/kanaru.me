import { ReactNode } from "react";
import { LogoAfterEffects } from "~/components/logo-aftereffects";
import { LogoDocker } from "~/components/logo-docker";
import { LogoIllustrator } from "~/components/logo-illustrator";

type Skill = {
  name: string;
  icon: string | ReactNode;
  level?: number;
};

type SkillsCategory = {
  name: string;
  familier: Skill[];
  learning: Skill[];
};

export const skills: SkillsCategory[] = [
  {
    name: "Languages",
    familier: [
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg",
        level: 5,
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
        level: 4,
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg",
        level: 4,
      },
      {
        name: "C#",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg",
        level: 3,
      },
      {
        name: "C++",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg",
        level: 3,
      },
    ],
    learning: [
      {
        name: "Ruby",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg",
        level: 2,
      },
      {
        name: "C",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg",
        level: 2,
      },
      {
        name: "Java",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
        level: 2,
      },
      {
        name: "Dart",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg",
        level: 2,
      },
      {
        name: "Swift",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg",
        level: 2,
      },
      {
        name: "Go",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg",
        level: 2,
      },
      {
        name: "Rust",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg",
        level: 2,
      },
    ],
  },
  {
    name: "Frameworks",
    familier: [
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
        level: 5,
      },
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
        level: 4,
      },
      {
        name: "PyTorch",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg",
        level: 3,
      },
      {
        name: ".NET",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg",
        level: 3,
      },
    ],
    learning: [
      {
        name: "Flutter",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg",
        level: 2,
      },
      {
        name: "Unity",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg",
        level: 2,
      },
    ],
  },
  {
    name: "Tools",
    familier: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg",
        level: 5,
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg",
        level: 4,
      },
      { name: "Docker", icon: <LogoDocker width={36} height={36} />, level: 4 },
      {
        name: "AWS",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
        level: 3,
      },
      {
        name: "Terraform",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg",
        level: 3,
      },
      {
        name: "GitHub Actions",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg",
        level: 3,
      },
      {
        name: "Cloudflare",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg",
        level: 3,
      },
      {
        name: "VSCode",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg",
        level: 3,
      },
      {
        name: "HTML5",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg",
        level: 3,
      },
      {
        name: "CSS3",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg",
        level: 3,
      },
      {
        name: "OpenCV",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg",
        level: 3,
      },
      {
        name: "LaTeX",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/latex/latex-original.svg",
        level: 3,
      },
      {
        name: "Linux",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg",
        level: 3,
      },
      {
        name: "AfterEffects",
        icon: <LogoAfterEffects width={36} height={36} />,
        level: 3,
      },
      {
        name: "Illustrator",
        icon: <LogoIllustrator width={36} height={36} />,
        level: 3,
      },
    ],
    learning: [
      {
        name: "MySQL",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
        level: 2,
      },
      {
        name: "Firebase",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg",
        level: 2,
      },
      {
        name: "Photoshop",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg",
        level: 2,
      },
      {
        name: "Figma",
        icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg",
        level: 2,
      },
    ],
  },
];
