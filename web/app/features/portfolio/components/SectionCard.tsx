import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="card bg-base-100 break-inside-avoid-column overflow-hidden shadow-xl">
      <div className="bg-primary absolute inset-0 h-100 w-1.5"></div>
      <div className="card-body pl-8">
        <h2 className="card-title mb-2 text-xl">{title}</h2>
        {children}
      </div>
    </section>
  );
}
