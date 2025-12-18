import type { ReactNode } from "react";

export type Work = {
  name: string;
  description: string;
  links?: {
    name: string;
    to: string;
    Icon: ReactNode;
    color?: string;
  }[];
  techs?: string[];
  image: string;
};


