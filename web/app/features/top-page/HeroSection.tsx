import { GitHubContributionGraph } from "./GitHubContributionGraph";
import type { GitHubContributionData } from "./types";

type HeroSectionProps = {
  gitHubContributionData: GitHubContributionData;
};

export function HeroSection({ gitHubContributionData }: HeroSectionProps) {
  return (
    <div className="hero min-h-screen bg-base-100">
      <div className="hero-content flex-col lg:flex-row-reverse gap-12">
        <div className="text-center lg:text-left max-w-md">
          <h1 className="text-5xl font-bold">kanaru.me</h1>
          <p className="py-6">the University of Electro-Communications</p>
          <div className="flex justify-center lg:justify-start gap-4">
            <a
              href="https://github.com/kanaru0928"
              className="btn btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://x.com/Kanaru49570357"
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter
            </a>
          </div>
        </div>
        <div className="w-full max-w-md">
          <GitHubContributionGraph weeks={gitHubContributionData.weeks} />
        </div>
      </div>
    </div>
  );
}
