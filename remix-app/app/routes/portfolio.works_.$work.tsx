import * as AspectRatio from "@radix-ui/react-aspect-ratio";
import {
  Link,
  ClientLoaderFunctionArgs as LoaderFunctionArgs,
  useLoaderData,
} from "react-router";
import { css } from "styled-system/css";
import { hstack } from "styled-system/patterns";
import { BackAnchor } from "~/components/back-anchor";
import { Button } from "~/components/button";
import { LinkType, linkTypes, works } from "~/contents/works";
import { markdownStyles } from "~/styles/markdown";

export async function loader({ params }: LoaderFunctionArgs) {
  const [work] = works.filter((work) => work.detailPage === params.work);
  if (!work) {
    throw new Response("Work not found", { status: 404 });
  }

  try {
    const { default: Contents } = await import(
      `../contents/works/${work.detailPage}.mdx`
    );
    return {
      work,
      Contents: Contents || (() => null),
    };
  } catch (error) {
    return {
      work,
      Contents: () => null,
    };
  }
}

export default function WorkPage() {
  const { work, Contents } = useLoaderData<typeof loader>();

  return (
    <div className={css({ spaceY: "2" })}>
      <div className={hstack({ mb: "4" })}>
        <BackAnchor to={"/portfolio/works"} />
        <h1
          className={css({
            textStyle: "heading1",
          })}
        >
          {work.title}
        </h1>
      </div>
      <div className={hstack({ pb: "1" })}>
        {work.links.map((link) => {
          const Icon = linkTypes[link.type].icon;
          return (
            <Button
              asChild
              key={link.url}
              buttonColor={linkTypes[link.type].color}
              hoverColor={linkTypes[link.type].hoverColor}
            >
              <Link
                to={link.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className={hstack()}
              >
                <Icon size={16} />
                {(
                  link.label ||
                  (linkTypes[link.type] as LinkType).label ||
                  "LINK"
                ).toUpperCase()}
              </Link>
            </Button>
          );
        })}
      </div>
      <div
        className={css({
          overflow: "hidden",
          w: "96",
          maxW: "full",
          rounded: "md",
          display: "inline-block",
        })}
      >
        <AspectRatio.Root ratio={16 / 10}>
          <img
            className={css({
              width: "full",
              height: "full",
              objectFit: "cover",
              objectPosition: "top",
            })}
            src={work.imageSource}
            alt={work.title}
          />
        </AspectRatio.Root>
      </div>
      <h2 className={css({ textStyle: "heading2/markdown", mb: "2" })}>
        Overview
      </h2>
      <p>{work.description}</p>
      <div className={markdownStyles}>{Contents && <Contents />}</div>
    </div>
  );
}
