import { Briefcase, History, Newspaper, PanelsTopLeft, User, Wrench } from "lucide-react";
import { type ReactNode, useId } from "react";
import { Link, NavLink } from "react-router";
import { cn } from "~/lib/utils";
import { ThemeController } from "./ThemeController";

type NavbarProviderProps = { children?: ReactNode; defaultOpen?: boolean };

export function NavbarProvider({ children, defaultOpen }: NavbarProviderProps) {
  const drawerId = useId();

  return (
    <div className={cn("drawer", defaultOpen && "lg:drawer-open")}>
      <input type="checkbox" id={drawerId} className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <div className="flex min-h-screen flex-col">
          <nav className="navbar sticky top-0 z-50 justify-center bg-base-300/30 px-4 shadow-sm filter backdrop-blur-md">
            <div className="flex-1">
              <div className={cn(defaultOpen && "lg:hidden")}>
                <label htmlFor={drawerId} className="btn btn-ghost btn-square">
                  <PanelsTopLeft className="h-6 w-6" />
                </label>
                <Link to="/" className="btn btn-ghost text-xl normal-case">
                  kanaru.me
                </Link>
              </div>
            </div>
            <div>
              <ThemeController />
            </div>
          </nav>
          <div className="flex-1">{children}</div>
        </div>
      </div>
      <div className="drawer-side z-50">
        <label
          htmlFor={drawerId}
          className="drawer-overlay"
          aria-label="close sidebar"
        ></label>
        <ul className="menu min-h-full w-80 bg-base-200 p-4">
          <li className="mb-2">
            <Link to="/" className="btn btn-ghost font-bold text-xl">
              kanaru.me
            </Link>
          </li>
          <li>
            <details open>
              <summary>Portfolio</summary>
              <ul>
                <li>
                  <NavLink
                    to="/portfolio/about"
                    className={({ isActive, isPending }) =>
                      cn(
                        isActive && "bg-base-300",
                        isPending && "animate-pulse"
                      )
                    }
                  >
                    <User className="h-4 w-4" />
                    About
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/portfolio/works"
                    className={({ isActive, isPending }) =>
                      cn(
                        isActive && "bg-base-300",
                        isPending && "animate-pulse"
                      )
                    }
                  >
                    <Briefcase className="h-4 w-4" />
                    Works
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/portfolio/history"
                    className={({ isActive, isPending }) =>
                      cn(
                        isActive && "bg-base-300",
                        isPending && "animate-pulse"
                      )
                    }
                  >
                    <History className="h-4 w-4" />
                    History
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/portfolio/skills"
                    className={({ isActive, isPending }) =>
                      cn(
                        isActive && "bg-base-300",
                        isPending && "animate-pulse"
                      )
                    }
                  >
                    <Wrench className="h-4 w-4" />
                    Skills
                  </NavLink>
                </li>
              </ul>
            </details>
          </li>
          <li>
            <NavLink
              to="/articles"
              className={({ isActive, isPending }) =>
                cn(isActive && "bg-base-300", isPending && "animate-pulse")
              }
            >
              <Newspaper className="h-4 w-4" />
              Articles
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}
