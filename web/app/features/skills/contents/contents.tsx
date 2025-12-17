import afterEffectsLogo from "../logos/ae.svg";
import illustratorLogo from "../logos/ai.svg";
import claudeLogo from "../logos/claude.svg";
import dockerLogo from "../logos/docker-mark-blue.svg";
import honoLogo from "../logos/hono.svg";
import type { Skill } from "./types";

export const skills = [
  {
    name: "TypeScript",
    tags: ["言語", "Web", "クラウド"],
    proficiency: "expert",
    Icon: <i className="devicon-typescript-plain colored" />,
    description:
      "多くのプロジェクトで使用しています。フロントエンド、バックエンド、IaC で活用しています。",
  },
  {
    name: "JavaScript",
    tags: ["言語", "Web"],
    proficiency: "advanced",
    Icon: <i className="devicon-javascript-plain colored" />,
    description: "最近はほとんど TypeScript を使用しています。",
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
  {
    name: "Storybook",
    tags: ["ツール", "Web", "フロントエンド"],
    proficiency: "intermediate",
    Icon: <i className="devicon-storybook-plain colored"></i>,
    description: "コンポーネント開発に使用しています。",
  },
  {
    name: "NestJS",
    tags: ["フレームワーク", "Web", "バックエンド"],
    proficiency: "intermediate",
    Icon: <i className="devicon-nestjs-original colored"></i>,
    description:
      "TypeScript のバックエンドフレームワークとして使用しています。",
  },
  {
    name: "Hono",
    tags: ["フレームワーク", "Web", "バックエンド"],
    proficiency: "intermediate",
    Icon: <img src={honoLogo} alt="Hono" className="h-12" />,
    description:
      "一部のプロジェクトでバックエンドフレームワークとして使用しています。",
  },
  {
    name: "Python",
    tags: ["言語", "Web", "機械学習", "競技プログラミング"],
    proficiency: "expert",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
        alt="Python"
        className="h-12"
      />
    ),
    description: "Web バックエンドや強化学習、NN、競技プログラミングなど幅広く使用しています。",
  },
  {
    name: "FastAPI",
    tags: ["フレームワーク", "Web", "バックエンド"],
    proficiency: "proficient",
    Icon: <i className="devicon-fastapi-plain colored"></i>,
    description:
      "Python の Web バックエンドフレームワークとして使用しています。",
  },
  {
    name: "PyTorch",
    tags: ["フレームワーク", "機械学習"],
    proficiency: "proficient",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg"
        alt="PyTorch"
        className="h-12"
      />
    ),
    description: "主に NN や強化学習の研究・開発で使用しています。",
  },
  {
    name: "Ruby",
    tags: ["言語"],
    proficiency: "intermediate",
    Icon: <i className="devicon-ruby-plain colored"></i>,
    description:
      "大学の授業で使用しました。レイトレーシングの実装などをしています。",
  },
  {
    name: "C",
    tags: ["言語"],
    proficiency: "intermediate",
    Icon: <i className="devicon-c-original colored"></i>,
    description:
      "大学の授業で使用しました。レイトレーシングや数値計算で使用しています。",
  },
  {
    name: "C++",
    tags: ["言語", "競技プログラミング"],
    proficiency: "proficient",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"
        alt="C++"
        className="h-12"
      />
    ),
    description:
      "大学の授業や競技プログラミングで使用しました。数値計算やアルゴリズム実装で使用しています。",
  },
  {
    name: "C#",
    tags: ["言語", "デスクトップ"],
    proficiency: "advanced",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg"
        alt=""
        className="h-12"
      />
    ),
    description:
      "デスクトップアプリ開発や MMM のプラグイン開発で使用しています。",
  },
  {
    name: ".NET",
    tags: ["フレームワーク", "デスクトップ"],
    proficiency: "proficient",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg"
        alt=".NET"
        className="h-12"
      />
    ),
    description: "デスクトップアプリ開発で使用しています。",
  },
  {
    name: "Unity",
    tags: ["フレームワーク", "デスクトップ"],
    proficiency: "beginner",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg"
        alt="Unity"
        className="h-12"
      />
    ),
    description: "VRChat のアバターやワールド制作で使用しています。",
  },
  {
    name: "Go",
    tags: ["言語", "クラウド"],
    proficiency: "proficient",
    Icon: <i className="devicon-go-original-wordmark colored"></i>,
    description: "インターンで使用しました。",
  },
  {
    name: "Docker",
    tags: ["コンテナ"],
    proficiency: "advanced",
    Icon: <img src={dockerLogo} alt="Docker" className="h-12 w-12" />,
    description:
      "開発環境や本番環境のコンテナ化に使用しています。Docker Compose も活用しています。",
  },
  {
    name: "Terraform",
    tags: ["IaC", "クラウド"],
    proficiency: "intermediate",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg"
        alt="Terraform"
        className="h-12"
      />
    ),
    description:
      "AWS や自宅サーバーのインフラ構築に使用しています。モジュール化や状態管理も活用しています。",
  },
  {
    name: "AWS",
    tags: ["クラウド"],
    proficiency: "advanced",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
        alt="AWS"
        className="h-12"
      />
    ),
    description:
      "個人、サークル、インターンなどでのインフラ構築に使用しています。ECS on Fargate、S3、Lambda などのサービスをよく利用しています。",
  },
  {
    name: "GCP",
    tags: ["クラウド"],
    proficiency: "beginner",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg"
        alt="Google Cloud"
        className="h-12"
      />
    ),
    description: "Compute Engine と Cloud Run の使用経験があります。",
  },
  {
    name: "CDK",
    tags: ["IaC", "クラウド"],
    proficiency: "advanced",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
        alt="AWS CDK"
        className="h-12"
      />
    ),
    description: "AWS インフラ構築のために使用しています。",
  },
  {
    name: "Git",
    tags: ["ツール"],
    proficiency: "proficient",
    Icon: <i className="devicon-git-plain colored"></i>,
    description: "ソースコードのバージョン管理に使用しています。",
  },
  {
    name: "GitHub Actions",
    tags: ["ツール", "CI/CD"],
    proficiency: "proficient",
    Icon: <i className="devicon-githubactions-plain colored"></i>,
    description: "CI/CD パイプラインの自動化に使用しています。",
  },
  {
    name: "CloudFlare",
    tags: ["クラウド"],
    proficiency: "proficient",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg"
        alt="CloudFlare"
        className="h-12"
      />
    ),
    description:
      "CloudFlare Workers や D1 を使用したホスティングや Tunnel を使用したサービス公開に使用しています。",
  },
  {
    name: "VS Code",
    tags: ["ツール"],
    proficiency: "expert",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg"
        alt="VS Code"
        className="h-12"
      />
    ),
    description: "主なコードエディタとして使用しています。",
  },
  {
    name: "LaTeX",
    tags: ["ツール"],
    proficiency: "advanced",
    Icon: <i className="devicon-latex-original colored"></i>,
    description: "レポートの執筆や文書の作成に使用しています。",
  },
  {
    name: "Linux",
    tags: ["ツール"],
    proficiency: "advanced",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg"
        alt="Linux"
        className="h-12"
      />
    ),
    description: "自宅鯖やクラウドで使用しています。Red Hat 系が多いです。",
  },
  {
    name: "AfterEffects",
    tags: ["ツール", "デザイン"],
    proficiency: "advanced",
    Icon: (
      <img src={afterEffectsLogo} alt="After Effects" className="h-12 w-12" />
    ),
    description: "動画編集に使用しています。",
  },
  {
    name: "Illustrator",
    tags: ["ツール", "デザイン"],
    proficiency: "proficient",
    Icon: <img src={illustratorLogo} alt="Illustrator" className="h-12 w-12" />,
    description: "ロゴやアイコンの作成に使用しています。",
  },
  {
    name: "Figma",
    tags: ["ツール", "デザイン"],
    proficiency: "proficient",
    Icon: (
      <img
        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg"
        alt="Figma"
        className="h-12"
      />
    ),
    description: "UI デザインに使用しています。",
  },
  {
    name: "Claude Code",
    tags: ["ツール", "AI"],
    proficiency: "proficient",
    Icon: <img src={claudeLogo} alt="Claude" className="h-12 w-12" />,
    description: "コード生成や Vive Coding に使用しています。",
  },
] satisfies Skill[];

export const allTags = Array.from(
  new Set(skills.flatMap((skill) => skill.tags))
).sort();
