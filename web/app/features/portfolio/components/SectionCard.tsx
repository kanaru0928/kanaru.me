import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="card break-inside-avoid-column overflow-hidden bg-base-100 shadow-xl">
      <div className="absolute inset-0 h-100 w-1.5 bg-primary"></div>
      <div className="card-body pl-8">
        <h2 className="card-title mb-2 text-xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}
