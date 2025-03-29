import {
  IconBrandGithub,
  IconBrandX,
  IconExternalLink,
  IconMail,
} from "@tabler/icons-react";
import { format, formatDistanceToNow } from "date-fns";
import { MetaFunction } from "react-router";
import { css } from "styled-system/css";
import { flex, hstack, stack } from "styled-system/patterns";
import { token } from "styled-system/tokens";
import { BarProgress } from "~/components/bar-progress";
import DashboardContainer from "~/components/dashboard-container";
import { IconBrandWantedly } from "~/components/icon-brand-wantedly";
import { useBirthday } from "~/hooks/use-birthday";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me Portfolio | About" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
};

export default function AboutPage() {
  const birthday = new Date("2004-09-28");
  const { progress, age, nextBirthday } = useBirthday(birthday);

  return (
    <div
      className={stack({
        px: "6",
        py: "4",
      })}
    >
      <h1
        className={css({
          textStyle: "heading1",
        })}
      >
        About
      </h1>
      <div
        className={flex({
          gap: "4",
          wrap: "wrap",
        })}
      >
        <DashboardContainer
          className={css({ flexGrow: 10, minW: "max(17rem, 50%)" })}
        >
          <h2
            className={css({
              textStyle: "heading2",
              color: "zinc.800",
              mb: "2",
            })}
          >
            Hello,
          </h2>
          <p>
            I'm{" "}
            <span className={css({ fontSize: "2xl", fontWeight: "bold" })}>
              Kanaru Azuma
            </span>
            .
          </p>
        </DashboardContainer>
        <DashboardContainer
          className={css({
            flexGrow: 7,
            minW: "max(15rem, 30%)",
            position: "relative",
            overflow: "hidden",
          })}
        >
          <h2
            className={css({
              textStyle: "heading2",
              color: "zinc.800",
              mb: "2",
            })}
          >
            Age
          </h2>
          <div className={flex({ gap: "2", align: "center" })}>
            <p className={css({ fontSize: "xl" })}>
              <span className={css({ fontWeight: "bold" })}>{age}</span> years
              old
            </p>
          </div>
          <div>since {format(birthday, "PP")}</div>
          <div>
            {Math.round(progress * 10) / 10}% (
            {formatDistanceToNow(nextBirthday)} left)
          </div>
          <BarProgress
            progress={progress}
            progressColor={`linear-gradient(90deg, transparent 0%, ${token(
              "colors.violet.400"
            )} 100%)`}
            className={css({
              backgroundColor: "violet.100",
              height: "1.5",
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
            })}
          />
        </DashboardContainer>
        <DashboardContainer
          className={css({
            flexGrow: 5,
            minW: "max(12rem, 20%)",
          })}
        >
          <h2
            className={css({
              textStyle: "heading2",
              color: "zinc.800",
              mb: "2",
            })}
          >
            Location
          </h2>
          <p
            className={css({
              fontSize: "lg",
            })}
          >
            Tokyo, Japan
          </p>
        </DashboardContainer>
        <DashboardContainer
          className={css({
            flexGrow: 7,
            minW: "max(17rem, 40%)",
          })}
        >
          <h2
            className={css({
              textStyle: "heading2",
              color: "zinc.800",
              mb: "2",
            })}
          >
            Institution
          </h2>
          <p
            className={css({
              fontSize: "lg",
            })}
          >
            the University of Electro-Communications
          </p>
          <p>School of Informatics and Engineering</p>
          <p>Cluster I, Computer Science Program</p>
        </DashboardContainer>
        <DashboardContainer
          className={css({
            flexGrow: 5,
            minW: "max(12rem, 25%)",
            md: {
              maxW: "35%",
            },
          })}
        >
          <h2
            className={css({
              textStyle: "heading2",
              color: "zinc.800",
              mb: "2",
            })}
          >
            Contact
          </h2>
          <ul>
            <li>
              <a
                className={hstack({
                  color: "violet.950",
                  _hover: { color: "violet.600" },
                })}
                href="https://github.com/kanaru0928"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandGithub size={20} />
                <span>kanaru0928</span>
                <IconExternalLink size={16} />
              </a>
            </li>
            <li>
              <a
                className={hstack({
                  color: "violet.950",
                  _hover: { color: "violet.600" },
                })}
                href="https://x.com/Kanaru49570357"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandX size={20} />
                <span>Kanaru49570357</span>
                <IconExternalLink size={16} />
              </a>
            </li>
            <li className={hstack()}>
              <IconMail size={20} />
              <span>kanaru [at] kanaru.me</span>
            </li>
            <li>
              <a
                className={hstack({
                  color: "violet.950",
                  _hover: { color: "violet.600" },
                })}
                href="https://www.wantedly.com/id/k_azuma"
                target="_blank"
                rel="noopener noreferrer"
              >
                <IconBrandWantedly size={20} />
                <span>k_azuma</span>
                <IconExternalLink size={16} />
              </a>
            </li>
          </ul>
        </DashboardContainer>
      </div>
    </div>
  );
}
