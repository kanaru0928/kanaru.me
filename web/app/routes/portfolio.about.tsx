import { Mail } from "lucide-react";
import { SectionCard } from "~/features/portfolio/components/SectionCard";
import { GitHubIcon } from "~/features/top-page/components/GitHubIcon";
import { TwitterIcon } from "~/features/top-page/components/TwitterIcon";
import iconImage from "~/features/top-page/images/icon@512.webp";

export default function AboutPage() {
  return (
    <div className="flex min-h-full flex-col gap-8">
      <h1 className="font-extrabold text-3xl">About</h1>

      <div className="columns-1 gap-6 space-y-6 sm:columns-2">
        {/* プロフィールカード */}
        <SectionCard title="プロフィール">
          <div className="mb-4 flex flex-wrap items-center gap-6">
            <div className="avatar">
              <div className="w-24 rounded-full ring-2 ring-accent ring-offset-2 ring-offset-base-100">
                <img src={iconImage} alt="Kanaru's Avatar" />
              </div>
            </div>
            <div className="min-w-10 space-y-4">
              <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                <span className="text-sm opacity-60">名前</span>
                <div>
                  <p>東 翔生</p>
                  <p>AZUMA Kanaru</p>
                </div>
                <span className="text-sm opacity-60">所属</span>
                <div>
                  <p>電気通信大学</p>
                  <p>情報理工学域 I類</p>
                  <p>
                    コンピュータ
                    <wbr />
                    サイエンス
                    <wbr />
                    プログラム
                  </p>
                </div>
                <span className="text-sm opacity-60">年齢</span>
                <span>21歳</span>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 資格カード */}
        <SectionCard title="資格">
          <ul className="list-inside list-disc space-y-2">
            <li>応用情報技術者</li>
            <li>第一種普通自動車運転免許 (AT限定)</li>
            <li>実用英語技能検定 2級</li>
          </ul>
        </SectionCard>

        {/* 趣味カード */}
        <SectionCard title="趣味">
          <ul className="list-inside list-disc space-y-2">
            <li>プログラミング</li>
            <li>動画制作</li>
            <li>VRChat</li>
          </ul>
        </SectionCard>

        {/* リンクカード */}
        <SectionCard title="リンク">
          <div className="space-y-3">
            <a
              href="https://github.com/kanaru0928"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-3"
            >
              <GitHubIcon size={20} className="shrink-0" />
              <span>GitHub</span>
            </a>
            <a
              href="https://twitter.com/kanaru0928"
              target="_blank"
              rel="noopener noreferrer"
              className="link link-hover flex items-center gap-3"
            >
              <TwitterIcon size={20} className="shrink-0" />
              <span>Twitter</span>
            </a>
            <span className="flex items-center gap-3">
              <Mail size={20} className="shrink-0" />
              <span>
                me
                <wbr />
                [at]kanaru.me
              </span>
            </span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
