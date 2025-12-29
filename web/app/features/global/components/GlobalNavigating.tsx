import "../styles/animation.css";

export function GlobalNavigating() {
  return (
    <div className="fixed top-0 left-0 z-50 h-1 w-full bg-base-100">
      <div className="absolute h-full w-full origin-left animate-[loading0_1.5s_infinite] bg-secondary"></div>
      <div className="absolute h-full w-full origin-left animate-[loading5_1.5s_infinite] bg-accent"></div>
      <div className="absolute h-full w-full origin-left animate-[loading10_1.5s_infinite] bg-primary"></div>
      <div className="absolute h-full w-full origin-left animate-[loading40_1.5s_infinite] bg-base-100"></div>
    </div>
  );
}
