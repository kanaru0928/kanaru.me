import { createContext } from "react";
import type { OGPData } from "~/features/articles/loaders/ogp";

export const OgpMapContext = createContext<Map<string, Promise<OGPData>>>(
  new Map(),
);
