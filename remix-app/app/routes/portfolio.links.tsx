import { css } from "styled-system/css";
import { stack, grid } from "styled-system/patterns";
import { DashboardContainer } from "~/components/dashboard-container";

const mutualLinks = [
  {
    title: "Keita Ito",
    url: "https://keitaito.net",
    description: "Former construction site.",
  },
  {
    title: "mimifuwa.cc",
    url: "https://mimifuwa.cc",
    description: "Surely AI driven design of Reiwa latest.",
  },
  {
    title: "Syougo Matsunaga",
    url: "https://portfolio.akaaku.net",
    description: "Reiwa latest design part 2.",
  },
  {
    title: "SHINNの研究室",
    url: "https://shinn-chan.net",
    description: "He is a good data scientist and a good mathematician.",
  },
  {
    title: "いーちゃん",
    url: "https://www.e-chan.me",
    description: "He should be in a second life as a frontend engineer.",
  },
];

export default function LinksPage() {
  return (
    <div className={stack()}>
      <h1
        className={css({
          textStyle: "heading1",
        })}
      >
        Links
      </h1>
      <div
        className={grid({
          columns: { base: 1, sm: 2, md: 3, lg: 4 },
          gap: 4,
          alignItems: "stretch",
        })}
      >
        {mutualLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={css({
              textDecoration: "none",
              transition: "transform 0.2s ease",
              display: "block",
              _hover: {
                transform: "translateY(-2px)",
              },
            })}
          >
            <DashboardContainer className={css({ h: "full" })}>
              <h3 className={css({ textStyle: "heading3", mb: 2 })}>
                {link.title}
              </h3>
              <p className={css({ fontSize: "sm", color: "gray.600" })}>
                {link.description}
              </p>
            </DashboardContainer>
          </a>
        ))}
      </div>
    </div>
  );
}
