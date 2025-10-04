import { Link } from "react-router";
import { ThemeController } from "./ThemeController";

export function NavBar() {
  return (
    <nav className="navbar bg-base-300/30  filter backdrop-blur-md shadow-sm fixed justify-center px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">
          kanaru.me
        </Link>
      </div>
      <div>
        <ThemeController />
      </div>
    </nav>
  );
}
