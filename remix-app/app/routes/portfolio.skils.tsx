import { MetaFunction } from "react-router";
import { css } from "styled-system/css";
import { flex, stack } from "styled-system/patterns";
import DashboardContainer from "~/components/dashboard-container";
import { LogoAfterEffects } from "~/components/logo-aftereffects";
import { LogoDocker } from "~/components/logo-docker";
import { LogoIllustrator } from "~/components/logo-illustrator";
import { SkilIcon } from "~/components/skil-icon";

export const meta: MetaFunction = () => {
  return [
    { title: "kanaru.me Portfolio | Skils" },
    {
      name: "description",
      content: "Portfolio page",
    },
  ];
};

export default function SkilsPage() {
  return (
    <div
      className={stack({
        px: "6",
        py: "2",
      })}
    >
      <h1
        className={css({
          textStyle: "heading1",
        })}
      >
        Skils
      </h1>
      <DashboardContainer className={css({ spaceY: "2" })}>
        <h2 className={css({ textStyle: "heading2" })}>Languages</h2>
        <div className={flex({ gap: "2", wrap: "wrap" })}>
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg"
            alt="Python"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg"
            alt="JavaScript"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg"
            alt="TypeScript"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg"
            alt="C#"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg"
            alt="C++"
          />
        </div>
        <div className={flex({ gap: "2", wrap: "wrap" })}>
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/ruby/ruby-original.svg"
            alt="Ruby"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/c/c-original.svg"
            alt="C"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg"
            alt="Java"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dart/dart-original.svg"
            alt="Dart"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/swift/swift-original.svg"
            alt="Swift"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/go/go-original.svg"
            alt="Go"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg"
            alt="Rust"
            size={24}
          />
        </div>
      </DashboardContainer>
      <DashboardContainer className={css({ spaceY: "2" })}>
        <h2
          className={css({
            textStyle: "heading2",
          })}
        >
          Frameworks
        </h2>
        <div className={flex({ gap: "2", wrap: "wrap" })}>
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg"
            alt="React"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg"
            alt="Node.js"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg"
            alt="PyTorch"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/dot-net/dot-net-original.svg"
            alt=".NET"
          />
        </div>
        <div className={flex({ gap: "2", wrap: "wrap" })}>
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg"
            alt="Flutter"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg"
            alt="Unity"
            size={24}
          />
        </div>
      </DashboardContainer>
      <DashboardContainer className={css({ spaceY: "2" })}>
        <h2 className={css({ textStyle: "heading2" })}>Tools</h2>
        <div className={flex({ gap: "2", wrap: "wrap" })}>
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg"
            alt="Git"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg"
            alt="GitHub"
          />
          <SkilIcon icon={<LogoDocker width={36} height={36} />} alt="Docker" />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg"
            alt="AWS"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/terraform/terraform-original.svg"
            alt="Terraform"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/githubactions/githubactions-original.svg"
            alt="GitHub Actions"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cloudflare/cloudflare-original.svg"
            alt="Cloudflare"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg"
            alt="VSCode"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg"
            alt="HTML5"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg"
            alt="CSS3"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg"
            alt="OpenCV"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/latex/latex-original.svg"
            alt="LaTeX"
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg"
            alt="Linux"
          />
          <SkilIcon
            icon={<LogoAfterEffects width={36} height={36} />}
            alt="AfterEffects"
          />
          <SkilIcon
            icon={<LogoIllustrator width={36} height={36} />}
            alt="Illustrator"
          />
        </div>
        <div className={flex({ gap: "2", wrap: "wrap" })}>
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg"
            alt="MySQL"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/firebase/firebase-original.svg"
            alt="Firebase"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/photoshop/photoshop-original.svg"
            alt="Photoshop"
            size={24}
          />
          <SkilIcon
            source="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg"
            alt="Figma"
            size={24}
          />
        </div>
      </DashboardContainer>
    </div>
  );
}
