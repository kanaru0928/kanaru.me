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
import { DashboardContainer } from "~/components/dashboard-container";
import { IconBrandWantedly } from "~/components/icon-brand-wantedly";
import { SkeltonLetter } from "~/components/skelton-letter";
import { useBirthday } from "~/hooks/use-birthday";
import * as Progress from "@radix-ui/react-progress";

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
  const { progress, age, nextBirthday, isLoading } = useBirthday(birthday);

  return (
    <div className={stack()}>
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
          className={css({
            flexGrow: 10,
            maxW: "100%",
            sm: {
              minW: "max(17rem, 50%)",
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
            maxW: "100%",
            sm: {
              minW: "max(15rem, 30%)",
            },
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
              {isLoading ? (
                <SkeltonLetter>00</SkeltonLetter>
              ) : (
                <span className={css({ fontWeight: "bold" })}>{age}</span>
              )}{" "}
              years old
            </p>
          </div>
          <div>since {format(birthday, "PP")}</div>
          <div>
            {isLoading ? (
              <SkeltonLetter>00.</SkeltonLetter>
            ) : (
              Math.round(progress * 10) / 10
            )}
            % (
            {isLoading ? (
              <SkeltonLetter>0 days</SkeltonLetter>
            ) : (
              formatDistanceToNow(nextBirthday)
            )}{" "}
            left)
          </div>
          <Progress.Root
            className={css({
              backgroundColor: "violet.100",
              height: "1.5",
              position: "absolute",
              bottom: "0",
              left: "0",
              right: "0",
            })}
            value={progress}
          >
            <Progress.Indicator
              className={css({
                height: "full",
                transition: "width 0.5s ease-in-out",
              })}
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${token(
                  "colors.violet.400"
                )} 100%)`,
                width: `${progress}%`,
              }}
            />
          </Progress.Root>
        </DashboardContainer>
        <DashboardContainer
          className={css({
            flexGrow: 5,
            maxW: "100%",
            sm: {
              minW: "max(12rem, 20%)",
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
            maxW: "100%",
            sm: {
              minW: "max(17rem, 40%)",
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
            sm: {
              minW: "max(12rem, 25%)",
            },
            maxW: "100%",
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
