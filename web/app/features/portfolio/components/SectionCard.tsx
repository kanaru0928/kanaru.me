import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <section className="card bg-base-100 shadow-xl break-inside-avoid-column overflow-hidden">
      <div className="bg-primary absolute inset-0 w-1.5 h-100"></div>
      <div className="card-body pl-8">
        <h2 className="card-title text-xl mb-2">{title}</h2>
        {children}
      </div>
    </section>
  );
}
