import {
  IconBrandGithubFilled,
  IconLink,
  IconProps,
} from "@tabler/icons-react";
import { Component, ForwardRefExoticComponent, ReactNode } from "react";
import { MySkill } from "./skills";
import { ColorToken } from "styled-system/tokens";

export type WorkLink = {
  type: "github" | "other";
  url: string;
  label?: string;
};

export type LinkType = {
  icon: ForwardRefExoticComponent<IconProps>;
  label?: string;
  color: ColorToken;
  hoverColor: ColorToken;
  iconColor: ColorToken;
};

export const linkTypes = {
  github: {
    icon: IconBrandGithubFilled,
    label: "GitHub",
    color: "zinc.900",
    iconColor: "zinc.50",
    hoverColor: "zinc.800",
  },
  other: {
    icon: IconLink,
    color: "violet.400",
    iconColor: "zinc.50",
    hoverColor: "violet.500",
  },
} as const satisfies Record<WorkLink["type"], LinkType>;

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
        label: "Link",
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
    detailPage: "osansaku",
  },
] satisfies Work[];
