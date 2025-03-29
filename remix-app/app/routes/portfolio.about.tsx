import { format, formatDistanceToNow } from "date-fns";
import { MetaFunction } from "react-router";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";
import { token } from "styled-system/tokens";
import { BarProgress } from "~/components/bar-progress";
import DashboardContainer from "~/components/dashboard-container";
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
        <DashboardContainer className={css({ flexGrow: 10, minW: "17rem" })}>
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
            minW: "15rem",
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
      </div>
    </div>
  );
}
