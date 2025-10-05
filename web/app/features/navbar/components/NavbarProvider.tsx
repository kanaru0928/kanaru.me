import { Briefcase, History, PanelsTopLeft, User, Wrench } from "lucide-react";
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
        <div className="flex flex-col min-h-screen">
          <nav className="navbar bg-base-300/30  filter backdrop-blur-md shadow-sm sticky top-0 z-50 justify-center px-4">
            <div className="flex-1">
              <div className={cn(defaultOpen && "lg:hidden")}>
                <label htmlFor={drawerId} className="btn btn-ghost btn-square">
                  <PanelsTopLeft className="h-6 w-6" />
                </label>
                <Link to="/" className="btn btn-ghost normal-case text-xl">
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
      <div className="drawer-side">
        <label
          htmlFor={drawerId}
          className="drawer-overlay"
          aria-label="close sidebar"
        ></label>
        <ul className="menu bg-base-200 min-h-full w-80 p-4">
          <li className="mb-2">
            <Link to="/" className="btn btn-ghost text-xl font-bold">
              kanaru.me
            </Link>
          </li>
          <li>
            <details open>
              <summary>Portfolio</summary>
              <ul>
                <li>
                  <Link to="/portfolio/about">
                    <User className="h-4 w-4" />
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio/works">
                    <Briefcase className="h-4 w-4" />
                    Works
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio/history">
                    <History className="h-4 w-4" />
                    History
                  </Link>
                </li>
                <li>
                  <Link to="/portfolio/skills">
                    <Wrench className="h-4 w-4" />
                    Skills
                  </Link>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </div>
    </div>
  );
}
