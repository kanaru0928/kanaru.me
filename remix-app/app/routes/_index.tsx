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
}

export const loader = async () => {
  const contributes = await getGithubContributesChart();

  return new Response(JSON.stringify({ contributes }), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};

export default function App() {
  const { contributes } = useLoaderData<LoaderData>();

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
            h: "dvh",
            bg: "black",
            justify: "center",
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
            <h1
              className={css({
                textGradient: "to-r",
                gradientFrom: "violet.300",
                gradientVia: "violet.50",
                gradientTo: "violet.300",
                fontWeight: "bold",
                fontSize: "4xl",
                position: "relative",
                _before: {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  bg: "violet.300/60",
                  filter: "auto",
                  blur: "2xl",
                  zIndex: -1,
                },
              })}
            >
              kanaru.me
            </h1>
            <VersionChip />
            <GithubGraph contributes={contributes} />
          </div>
          <div
            className={css({
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
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
