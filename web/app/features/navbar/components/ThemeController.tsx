import { Monitor, Moon, Sun } from "lucide-react";

export function ThemeController() {
  return (
    <div className="join">
      <label className="join-item btn btn-square has-checked:btn-primary">
        <Monitor className="h-4 w-4" />
        <input type="radio" name="theme" className="hidden" defaultChecked />
      </label>

      <label className="join-item btn btn-square has-checked:btn-primary">
        <Sun className="h-4 w-4" />
        <input
          type="radio"
          name="theme"
          className="theme-controller hidden"
          value="latte"
        />
      </label>

      <label className="join-item btn btn-square has-checked:btn-primary">
        <Moon className="h-4 w-4" />
        <input
          type="radio"
          name="theme"
          className="theme-controller hidden"
          value="frappe"
        />
      </label>
    </div>
  );
}
