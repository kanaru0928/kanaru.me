import { GitHubIcon } from "~/features/top-page/components/GitHubIcon"
import { TwitterIcon } from "~/features/top-page/components/TwitterIcon"

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">About</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* プロフィールカード */}
        <section className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl">プロフィール</h2>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <span className="text-sm opacity-60">名前</span>
              <span>Kanaru</span>
              <span className="text-sm opacity-60">職業</span>
              <span>Software Developer</span>
              <span className="text-sm opacity-60">年齢</span>
              <span>21歳</span>
            </div>
          </div>
        </section>

        {/* 資格カード */}
        <section className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl">資格</h2>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>応用情報技術者</li>
              <li>第一種普通自動車運転免許 (AT限定)</li>
              <li>実用英語技能検定 2級</li>
            </ul>
          </div>
        </section>

        {/* 趣味カード */}
        <section className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl">趣味</h2>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>プログラミング</li>
              <li>動画制作</li>
              <li>ゲーム</li>
            </ul>
          </div>
        </section>

        {/* リンクカード */}
        <section className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title text-xl">リンク</h2>
            <div className="mt-4 space-y-3">
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
                href="https://twitter.com/Kanaru49570357"
                target="_blank"
                rel="noopener noreferrer"
                className="link link-hover flex items-center gap-3"
              >
                <TwitterIcon size={20} className="shrink-0" />
                <span>Twitter</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
