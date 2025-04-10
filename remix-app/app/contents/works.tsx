import { ReactNode } from "react";
import { MySkill } from "./skills";
import {
  IconBrandGithub,
  IconBrandGithubFilled,
  IconLink,
} from "@tabler/icons-react";
import { css } from "styled-system/css";

export type WorkLink = {
  type: "github" | "other";
  url: string;
};

export const LinkIcons = {
  github: (
    <IconBrandGithubFilled className={css({ color: "zinc.50" })} size={16} />
  ),
  other: <IconLink className={css({ color: "zinc.50" })} size={16} />,
} satisfies Record<WorkLink["type"], ReactNode>;

export const linkColors = {
  github: "zinc.900",
  other: "violet.400",
} as const satisfies Record<WorkLink["type"], string>;

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
      {
        type: "other",
        url: "https://www.kanaru.me",
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
