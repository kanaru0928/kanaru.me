import { Suspense } from "react";
import { Await } from "react-router";
import type { OGPData } from "~/features/articles/loaders/ogp";
import { LinkCard } from "./LinkCard";

type SuspenseLinkCardProps = {
  url: string;
  ogpMap: Map<string, Promise<OGPData>>;
};

export function SuspenseLinkCard({ url, ogpMap }: SuspenseLinkCardProps) {
  return (
    <Suspense fallback={<LinkCard url={url} />}>
      <Await resolve={ogpMap.get(url)}>
        {(ogpData) => <LinkCard url={url} {...ogpData} />}
      </Await>
    </Suspense>
  );
}
