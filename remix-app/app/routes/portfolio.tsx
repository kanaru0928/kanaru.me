import { Separator } from "@radix-ui/react-separator";
import {
  IconBoltFilled,
  IconFoldersFilled,
  IconHomeFilled,
  IconLayoutFilled,
  IconLayoutSidebar,
  IconLink,
} from "@tabler/icons-react";
import clsx from "clsx";
import { ElementType, useState } from "react";
import { NavLink, Outlet } from "react-router";
import { css } from "styled-system/css";
import { flex, hstack, stack } from "styled-system/patterns";
import { token } from "styled-system/tokens";
import { useWindowSize } from "~/hooks/use-window-size";

const gradientProperties: { [key: string]: string } = {
  "--x-0": "14%",
  "--y-0": "8%",
  "--c-0": "hsla(207, 70%, 100%, 1)",
  "--c-1": "hsla(356, 78%, 92%, 1)",
  "--x-1": "38%",
  "--y-1": "34%",
  "--x-2": "52%",
  "--c-2": "hsla(272, 95%, 62%, 1)",
  "--y-2": "0%",
  "--x-3": "38%",
  "--y-3": "3%",
  "--c-3": "hsla(334, 73%, 51%, 1)",
  "--x-4": "42%",
  "--c-4": "hsla(356, 51%, 81%, 1)",
  "--y-4": "65%",
  backgroundColor: "hsla(217, 86%, 67%, 1)",
  backgroundImage:
    "radial-gradient(circle at var(--x-0) var(--y-0), var(--c-0) var(--s-start-0), transparent var(--s-end-0)), radial-gradient(circle at var(--x-1) var(--y-1), var(--c-1) var(--s-start-1), transparent var(--s-end-1)), radial-gradient(circle at var(--x-2) var(--y-2), var(--c-2) var(--s-start-2), transparent var(--s-end-2)), radial-gradient(circle at var(--x-3) var(--y-3), var(--c-3) var(--s-start-3), transparent var(--s-end-3)), radial-gradient(circle at var(--x-4) var(--y-4), var(--c-4) var(--s-start-4), transparent var(--s-end-4))",
  animation: "hero-gradient-animation 10s linear infinite alternate",
};

const tabTriggerStyles = flex({
  rounded: "full",
  w: "full",
  py: "2",
  px: "4",
  spaceX: "2",
  align: "center",
  _hover: {
    bg: "violet.50",
  },
});

interface SidebarRoute {
  path: string;
  label: string;
  icon: ElementType;
}

const routes = [
  {
    path: "about",
    label: "About",
    icon: IconLayoutFilled,
  },
  {
    path: "skills",
    label: "Skills",
    icon: IconBoltFilled,
  },
  {
    path: "works",
    label: "Works",
    icon: IconFoldersFilled,
  },
  {
    path: "links",
    label: "Links",
    icon: IconLink,
  },
] as const satisfies SidebarRoute[];

export default function PortfolioPage() {
  const { width: windowWidth } = useWindowSize();
  const lgBreakPoint = parseInt(token("breakpoints.lg"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isOverlaySidebarOpen, setIsOverlaySidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    if (windowWidth < lgBreakPoint) {
      setIsOverlaySidebarOpen((prev) => !prev);
    } else {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={css({
        minHeight: "100vh",
        ...gradientProperties,
      })}
    >
      <div
        className={flex({
          direction: "row",
        })}
      >
        <div
          className={css({
            lg: {
              width: isSidebarOpen ? "250px" : "0",
              transition: "width 0.5s",
              position: "relative",
            },
          })}
        >
          <div
            className={flex({
              direction: "column",
              padding: "4",
              bg: "zinc.50/70",
              backdropFilter: "auto",
              backdropBlur: "sm",
              height: "100vh",
              overflowY: "auto",
              shadow: "lg",
              justify: "space-between",
              position: "fixed",
              width: ["100%", "250px"],
              lgDown: {
                transform: isOverlaySidebarOpen
                  ? "translateX(0)"
                  : "translateX(-100%)",
                transition: "transform 0.5s",
                zIndex: "100",
              },
              lg: {
                position: "sticky",
                top: "0",
                transform: isSidebarOpen
                  ? "translateX(0)"
                  : "translateX(-100%)",
                transition: "transform 0.5s",
                background: "zinc.50/40",
              },
            })}
          >
            <div
              className={flex({
                direction: "column",
              })}
            >
              <div
                className={css({
                  lg: {
                    display: "none",
                  },
                })}
              >
                <div className={flex({ justify: "end" })}>
                  <a
                    href="#"
                    className={css({
                      p: "1",
                      rounded: "full",
                      _hover: {
                        bg: "zinc.900/20",
                      },
                    })}
                    onClick={() => handleSidebarToggle()}
                  >
                    <IconLayoutSidebar />
                  </a>
                </div>
                <Separator
                  className={css({
                    bg: "zinc.900",
                    height: "0.5px",
                    my: "4",
                  })}
                />
              </div>
              <div
                className={stack({
                  align: "start",
                  spaceY: "2",
                })}
              >
                {routes.map((route) => (
                  <NavLink
                    key={route.path}
                    className={({ isActive }) =>
                      clsx(
                        tabTriggerStyles,
                        isActive &&
                          css({
                            bg: "violet.50",
                            shadow: "lg",
                          })
                      )
                    }
                    to={route.path}
                  >
                    <route.icon size={20} />
                    <span>{route.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
            <div
              className={stack({
                align: "start",
                spaceY: "2",
              })}
            >
              <NavLink
                className={({ isActive }) =>
                  clsx(
                    tabTriggerStyles,
                    isActive &&
                      css({
                        bg: "violet.50",
                        shadow: "lg",
                      })
                  )
                }
                to="/"
              >
                <IconHomeFilled size={20} />
                <span>Home</span>
              </NavLink>
            </div>
          </div>
        </div>
        <div
          className={css({
            flex: 1,
            overflowY: "auto",
            position: "relative",
            px: "6",
            pt: "4",
            pb: "6",
          })}
        >
          <div className={hstack()}>
            <a
              href="#"
              className={css({
                p: "1",
                rounded: "full",
                _hover: {
                  bg: "zinc.900/20",
                },
              })}
              onClick={() => handleSidebarToggle()}
            >
              <IconLayoutSidebar />
            </a>
          </div>
          <Separator
            className={css({
              bg: "zinc.900",
              height: "0.5px",
              my: "3",
            })}
          />
          <Outlet />
          <div
            className={css({
              background: "zinc.800/70",
              position: "fixed",
              top: "0",
              left: "0",
              right: "0",
              bottom: "0",
              zIndex: "10",
              display: isOverlaySidebarOpen ? "block" : "none",
              lg: {
                display: "none",
              },
            })}
          ></div>
        </div>
      </div>
    </div>
  );
}
