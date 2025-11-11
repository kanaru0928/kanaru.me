import { ChevronsRight } from "lucide-react";
import { Link } from "react-router";
import iconImage from "~/features/top-page/images/icon@512.webp";
import type { GitHubContributionData } from "../loaders/github";
import { GitHubContributionGraph } from "./GitHubContributionGraph";
import { GitHubIcon } from "./GitHubIcon";
import { TwitterIcon } from "./TwitterIcon";

type HeroSectionProps = {
  gitHubContributionData: GitHubContributionData;
};

export function HeroSection({ gitHubContributionData }: HeroSectionProps) {
  return (
    <div className="hero min-h-full bg-base-200">
      <div className="hero-content max-w-screen flex-col gap-6 lg:gap-12">
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
          <div className="avatar">
            <div className="w-36 rounded-full ring-2 ring-accent ring-offset-3 ring-offset-base-200">
              <img src={iconImage} alt="Kanaru's Avatar" />
            </div>
          </div>
          <div className="max-w-md text-center lg:text-left">
            <h1 className="font-extrabold text-5xl">kanaru.me</h1>
            <p className="py-6">the University of Electro-Communications</p>
            <div className="flex justify-center gap-4 lg:justify-start">
              <a
                href="https://github.com/kanaru0928"
                className="btn btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitHubIcon size={16} />
                GitHub
              </a>
              <a
                href="https://x.com/kanaru0928"
                className="btn btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                <TwitterIcon size={16} />
                Twitter
              </a>
            </div>
          </div>
        </div>
        <div className="w-full max-w-md">
          <GitHubContributionGraph weeks={gitHubContributionData.weeks} />
        </div>
        <div>
          <Link to="/portfolio" className="btn btn-primary btn-lg">
            Go to my portfolio
            <ChevronsRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
