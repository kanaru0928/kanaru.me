import { Suspense, use } from "react";
import { Await } from "react-router";
import { OgpMapContext } from "../contexts/OgpMapContext";
import { LinkCard } from "./LinkCard";

type SuspenseLinkCardProps = {
  url: string;
};

export function SuspenseLinkCard({ url }: SuspenseLinkCardProps) {
  const ogpMap = use(OgpMapContext);

  return (
    <Suspense fallback={<LinkCard url={url} />}>
      <Await resolve={ogpMap.get(url)}>
        {(ogpData) => <LinkCard url={url} {...ogpData} />}
      </Await>
    </Suspense>
  );
}
