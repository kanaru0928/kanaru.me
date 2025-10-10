import { Outlet } from "react-router";

export default function SandboxPage() {
  return (
    <div className="p-8 break-keep wrap-anywhere min-h-full">
      <Outlet />
    </div>
  );
}
