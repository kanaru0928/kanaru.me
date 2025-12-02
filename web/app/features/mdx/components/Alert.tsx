import {
  CircleCheck,
  CircleChevronRight,
  CircleX,
  Info,
  TriangleAlert,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { cn } from "~/lib/utils";

const typeMap = {
  neutral: {
    style: "bg-neutral/10 before:bg-neutral text-base-content",
    Icon: CircleChevronRight,
  },
  info: {
    style: "bg-info/10 before:bg-info text-info",
    Icon: Info,
  },
  success: {
    style: "bg-success/10 before:bg-success text-success",
    Icon: CircleCheck,
  },
  warning: {
    style: "bg-warning/10 before:bg-warning text-warning",
    Icon: TriangleAlert,
  },
  error: {
    style: "bg-error/10 before:bg-error text-error",
    Icon: CircleX,
  },
} satisfies Record<string, { style: string; Icon: ComponentType }>;

type AlertProps = {
  children: ReactNode;
  type?: keyof typeof typeMap;
};

export function Alert({ children, type = "neutral" }: AlertProps) {
  const { Icon, style } = typeMap[type];
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg px-6 text-sm",
        "before:absolute before:top-0 before:bottom-0 before:left-0 before:h-full before:w-1.5 before:rounded-l-lg before:content-['']",
        style
      )}
    >
      <div className="flex items-start gap-3">
        <Icon className="mt-4.5 h-5 w-5 shrink-0" />
        <div>{children}</div>
      </div>
    </div>
  );
}
