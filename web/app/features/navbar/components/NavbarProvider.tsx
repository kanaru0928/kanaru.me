import { PanelsTopLeft } from "lucide-react";
import { type ReactNode, useId } from "react";
import { Link } from "react-router";
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
          <nav className="navbar bg-base-300/30  filter backdrop-blur-md shadow-sm sticky top-0 justify-center px-4">
            <div className="flex-1">
              <label htmlFor={drawerId} className="btn btn-ghost btn-square">
                <PanelsTopLeft className="h-6 w-6" />
              </label>
              <Link to="/" className="btn btn-ghost normal-case text-xl">
                kanaru.me
              </Link>
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
          {/* Sidebar content here */}
          <li>Sidebar Item 1</li>
          <li>Sidebar Item 2</li>
        </ul>
      </div>
    </div>
  );
}
