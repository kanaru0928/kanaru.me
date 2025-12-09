import type { ReactNode } from "react";

type CollapseProps = {
  children: ReactNode;
  summary?: ReactNode;
};

export function Collapse({ children, summary }: CollapseProps) {
  return (
    <details className="not-prose collapse-arrow collapse my-4 border border-base-300 bg-base-100 text-sm">
      <summary className="collapse-title ps-12 pe-4 font-semibold after:start-5 after:end-auto">
        {summary ?? "詳細を表示"}
      </summary>
      <div className="collapse-content text-sm">{children}</div>
    </details>
  );
}
