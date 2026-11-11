import { BookText, Form, Link, Megaphone } from "lucide-react";
import kanarumeImage from "../images/kanarume.png";
import moImage from "../images/mo.png";
import osansakuImage from "../images/osansaku.png";
import riatoraImage from "../images/riatora.png";
import vbcImage from "../images/vbc.png";
import githubLogo from "../logos/github-mark.svg";
import warikanImage from "../images/warikan.jpg";
import teireiImage from "../images/teireikun.jpg";
import sakurallyImage from "../images/sakurally.png";
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
    techs: [
      "TypeScript",
      "React",
      "Next.js",
      "NestJS",
      "Storybook",
      "SQL",
      "AWS",
      "CDK",
    ],
    image: moImage,
  },
  {
    name: "Sakurally",
    description: "コミュニティで作り上げるデジタルスタンプラリーツールです。調布市郷土博物館と協力して実証実験をしています。U☆PoC 2026 調布市長賞受賞。",
    links: [
      {
        name: "プレスリリース",
        to: "https://www.uec.ac.jp/news/newsrelease/2026/20261020_8016.html",
        Icon: <Megaphone size={16} />,
        color: "primary",
      },
      {
        name: "広報",
        to: "https://chofu-city.liqlid.jp/spaceyf09sq5p/info-iq75v0q4",
        Icon: <Form size={16} />,
        color: "primary",
      },
      {
        name: "アプリを見る",
        to: "https://sakurally.com/",
        Icon: <Link size={16} />,
        color: "primary",
      }
    ],
    techs: ["React", "Python", "AWS", "Next.js"],
    image: sakurallyImage,
  },
  {
    name: "warikan",
    description: "旅行等で使える清算アプリです。誰がいくら払ったかを記録し、最終的なお金の移動量を計算します。",
    links: [
      {
        name: "サイトを見る",
        to: "https://warikan.kanaru.me",
        Icon: <Link size={16} />,
        color: "primary"
      },
    ],
    techs: ["React", "Tanstack Start", "Cloudflare"],
    image: warikanImage,
  },
  {
    name: "定例くん Pro",
    description: "なぜか使い慣れた UI で日時や週次の日程調整ができるアプリです。",
    links: [
      {
        name: "サイトを見る",
        to: "https://teireikun.kanaru.me",
        Icon: <Link size={16} />,
        color: "primary",
      },
    ],
    techs: ["React", "React Router", "Cloudflare"],
    image: teireiImage,
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
    description:
      "ランダムな散策をサポートするアプリケーションです。2023 年度 U☆PoC たましん賞受賞。",
    techs: ["Python", "FastAPI", "React Native", "AWS"],
    image: osansakuImage,
  },
  {
    name: "りあとら",
    description:
      "スマホカメラの映像から人物の骨格を推定し、リアルタイムで MMD モデルに反映するアプリケーションです。2022 年度中高生情報学研究コンテスト入賞。",
    links: [
      {
        name: "リポジトリ",
        to: "https://github.com/kanaru0928/3DTracking_PostProcessing",
        Icon: <img src={githubLogo} alt="GitHub" className="h-4 w-4" />,
        color: "secondary",
      },
    ],
    techs: ["Python", "C#"],
    image: riatoraImage,
  },
] satisfies Work[];
