import * as Dialog from "@radix-ui/react-dialog";
import type { MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  IconChevronsDown,
  IconChevronsRight,
  IconLink,
} from "@tabler/icons-react";
import { css } from "styled-system/css";
import { flex } from "styled-system/patterns";
import { Card } from "~/components/card";
import { Copyright } from "~/components/copyright";
import { GithubGraph } from "~/components/github-graph";
import { HambergerIcon } from "~/components/hamberger-icon";
import { HomeBG } from "~/components/home-bg";
import { SectionHeader } from "~/components/section-header";
import { VersionChip } from "~/components/version-chip";
import { getGithubContributesChart } from "~/loader/github-contributes";
import { HambergerDialog } from "~/components/hamberger-dialog";
import { incrementPageViews } from "~/loader/page-views";
import { GradientText } from "~/components/gradient-text";
import * as Tooltip from "@radix-ui/react-tooltip";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me" },
    {
      name: "description",
      content: "kanaru.meのホームページ",
    },
  ];
};

interface Contribute {
  month: string;
  amt: number;
}

interface LoaderData {
  contributes: Contribute[];
  count: number;
}

export const loader = async () => {
  const count = await incrementPageViews("/");

  const contributes = await getGithubContributesChart();

  return new Response(JSON.stringify({ contributes, count }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export default function App() {
  const { contributes, count } = useLoaderData<LoaderData>();

  return (
    <Dialog.Root>
      <div
        className={css({
          color: "white",
          bg: "zinc.900",
        })}
      >
        <header
          className={flex({
            h: "screen",
            bg: "black",
            justify: "center",
            position: "relative",
            zIndex: 1,
          })}
        >
          <HomeBG />
          <div
            className={flex({
              direction: "column",
              justify: "center",
              align: "center",
              h: "full",
              position: "relative",
              pb: 10,
              w: "full",
              maxW: 600,
            })}
          >
            <Dialog.Trigger asChild>
              <button>
                <HambergerIcon
                  size={120}
                  className={css({ cursor: "pointer" })}
                />
              </button>
            </Dialog.Trigger>
            <HambergerDialog />
            <GradientText
              component="h1"
              className={css({
                fontWeight: "bold",
                fontSize: "4xl",
              })}
            >
              kanaru.me
            </GradientText>
            <VersionChip />
            <GithubGraph contributes={contributes} />
            <GradientText className={css({ mt: 5 })}>
              <span
                className={css({
                  fontWeight: "bold",
                  fontSize: "2xl",
                  mr: 1,
                })}
              >
                {count.toLocaleString("ja-JP")}
              </span>
              PV
            </GradientText>
          </div>
          <div
            className={flex({
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              justify: "center",
              zIndex: -1,
            })}
          >
            <IconChevronsDown
              size={200}
              className={css({
                color: "white/10",
                animation: "bounce 2s infinite",
              })}
            />
          </div>
        </header>
        <div
          className={css({
            p: 5,
            bg: "zinc.900",
          })}
        >
          <div
            className={flex({
              direction: "column",
              alignItems: "center",
              spaceY: 5,
            })}
          >
            <div className={css({ w: "full", maxW: 600 })}>
              <SectionHeader>Portfolio</SectionHeader>
              <Card
                title="ポートフォリオ"
                className={css({ my: 3 })}
                anchor={
                  <div>
                    <IconChevronsRight />
                  </div>
                }
                as={Link}
                to="/portfolio"
              >
                <p>ポートフォリオはこちら。</p>
              </Card>
            </div>
            <div className={css({ w: "full", maxW: 600 })}>
              <SectionHeader>Articles</SectionHeader>
              <Card
                title="テストの記事"
                className={css({ my: 3 })}
                anchor={
                  <div>
                    <IconChevronsRight />
                  </div>
                }
              >
                <p>ここに記事の説明。</p>
              </Card>
            </div>
            <div className={css({ w: "full", maxW: 600 })}>
              <SectionHeader>Links</SectionHeader>
              <Card
                title="相互リンク"
                className={css({ my: 3 })}
                anchor={
                  <div>
                    <IconLink />
                  </div>
                }
              >
                <p>ここに相互リンク</p>
              </Card>
            </div>
          </div>
        </div>
        <footer
          className={css({
            textAlign: "center",
            p: 5,
            bg: "zinc.900",
          })}
        >
          <Copyright />
        </footer>
      </div>
    </Dialog.Root>
  );
}
