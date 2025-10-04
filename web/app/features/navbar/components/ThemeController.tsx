import { Moon, Sun } from "lucide-react";

export function ThemeController() {
  return (
    <label className="swap swap-rotate">
      <input type="checkbox" className="theme-controller" value="frappe" />

      <Sun className="swap-off h-6 w-6" />

      <Moon className="swap-on h-6 w-6" />
    </label>
  );
}
