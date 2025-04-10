import { ReactNode } from "react";
import { MySkill } from "./skills";

export type WorkLink = {
  type: "github" | "other";
  url: string;
};

export type Work = {
  title: string;
  description: ReactNode;
  imageSource?: string;
  imageAlt?: string;
  skills: MySkill[];
  detailPage?: string;
  links: WorkLink[];
};

export const works = [
  {
    title: "Home Page",
    description: "My personal website including portfolio.",
    imageSource: "/works/kanaru.me.png",
    imageAlt: "Home Page",
    skills: [],
    detailPage: "home-page",
    links: [
      {
        type: "github",
        url: "https://github.com/kanaru0928/kanaru.me",
      },
    ],
  },
  {
    title: "Osansaku",
    description:
      "A web application which supports walking and discovering new places.",
    imageSource: "/works/osansaku.png",
    imageAlt: "Osansaku",
    skills: [],
    links: [],
  },
] satisfies Work[];
