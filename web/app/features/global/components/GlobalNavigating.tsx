import "../styles/animation.css";

export function GlobalNavigating() {
  return (
    <div className="bg-base-100 fixed top-0 left-0 z-50 h-1 w-full">
      <div className="bg-secondary absolute h-full w-full origin-left animate-[loading0_1.5s_infinite]"></div>
      <div className="bg-accent absolute h-full w-full origin-left animate-[loading5_1.5s_infinite]"></div>
      <div className="bg-primary absolute h-full w-full origin-left animate-[loading10_1.5s_infinite]"></div>
      <div className="bg-base-100 absolute h-full w-full origin-left animate-[loading40_1.5s_infinite]"></div>
    </div>
  );
}
