import { BookText, Link, Megaphone } from "lucide-react";
import kanarumeImage from "../images/kanarume.png";
import moImage from "../images/mo.png";
import osansakuImage from "../images/osansaku.png";
import vbcImage from "../images/vbc.png";
import githubLogo from "../logos/github-mark.svg";
import type { Work } from "./types";

export const works = [
  {
    name: "kanaru.me",
    description:
      "このサイトです。React Router v7 と AWS Lambda で構築しています。CMS 機能も実装しています。",
    links: [
      {
        name: "リポジトリ",
        to: "https://github.com/kanaru0928/kanaru.me",
        Icon: <img src={githubLogo} alt="GitHub" className="h-4 w-4" />,
        color: "secondary",
      },
      {
        name: "サイトを見る",
        to: "https://kanaru.me",
        Icon: <Link size={16} />,
        color: "primary",
      },
    ],
    techs: ["TypeScript", "React", "React Router", "Hono", "AWS", "CDK"],
    image: kanarumeImage,
  },
  {
    name: "MO",
    description:
      "文化祭向けモバイルオーダーシステムです。3 年連続で導入しています。2025 年度はフロントエンドとインフラ構築を担当しました。2023 年度 U☆PoC ハートビーツ賞受賞。",
    links: [
      {
        name: "PR ページ",
        to: "https://team411.net/projects/mo/",
        Icon: <Megaphone size={16} />,
        color: "primary",
      },
    ],
    techs: ["TypeScript", "React", "Next.js", "NestJS", "Storybook", "SQL", "AWS", "CDK"],
    image: moImage,
  },
  {
    name: "VRC Browser Chat",
    description:
      "スマホから VRChat のチャットを送信できるアプリケーションです。Tauri でデスクトップアプリを作成しています。",
    links: [
      {
        name: "リポジトリ",
        to: "https://github.com/kanaru0928/vrc-browser-chat",
        Icon: <img src={githubLogo} alt="GitHub" className="h-4 w-4" />,
        color: "secondary",
      },
      {
        name: "ドキュメント",
        to: "https://vrc-browser-chat.kanaru.me",
        Icon: <BookText size={16} />,
        color: "primary",
      },
    ],
    techs: ["Rust", "TypeScript", "Next.js"],
    image: vbcImage,
  },
  {
    name: "Osansaku",
    description: "ランダムな散策をサポートするアプリケーションです。",
    techs: ["Python", "FastAPI", "React Native", "AWS"],
    image: osansakuImage,
  },
] satisfies Work[];
