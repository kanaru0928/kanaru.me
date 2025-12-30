import { TimelineItem } from "~/features/portfolio/components/TimelineItem";

export default function HistoryPage() {
  return (
    <div>
      <h1 className="mb-4 font-extrabold text-3xl">History</h1>
      <ul className="timeline timeline-vertical">
        <TimelineItem date="2004-09-28" start>
          <p className="font-bold">生誕</p>
        </TimelineItem>
        <TimelineItem date="2015?">
          <p className="font-bold">Java 言語に入門</p>
          <p>初めてプログラミングを経験。動画を見ながら学習した。</p>
        </TimelineItem>
        <TimelineItem date="2017-04" nextColor="accent">
          <p className="font-bold">創価中学校 入学 50 期生</p>
        </TimelineItem>
        <TimelineItem date="2019-08" prevColor="accent" nextColor="accent">
          <p className="font-bold">
            第 24 回 全国中学・高校ディベート甲子園 中学の部 優勝
          </p>
          <p>資料管理を担当。レギュラーメンバーの資料を精査し優勝に貢献。</p>
        </TimelineItem>
        <TimelineItem date="2020-04" prevColor="accent" nextColor="accent">
          <p className="font-bold">創価高等学校 入学 53 期生</p>
        </TimelineItem>
        <TimelineItem date="2020-12" prevColor="accent" nextColor="accent">
          <p className="font-bold">
            第 1 回 学力向上アプリコンテスト デザイン部門優秀賞
          </p>
          <p>英単語学習アプリ Blossom を作成。</p>
        </TimelineItem>
        <TimelineItem date="2021-11" prevColor="accent" nextColor="accent">
          <p className="font-bold">第 21 回 情報オリンピック 予選 B ランク</p>
          <p>本選出場まであと 1 点だった。</p>
        </TimelineItem>
        <TimelineItem date="2022-3" prevColor="accent" nextColor="accent">
          <p className="font-bold">第 4 回 中高生情報学研究コンテスト 入選</p>
          <p>
            スマホカメラを使用した MMD 用のモーションキャプチャーアプリを作成。
          </p>
        </TimelineItem>
        <TimelineItem date="2023-04" prevColor="accent" nextColor="primary">
          <p className="font-bold">電気通信大学 情報理工学域 I類 入学</p>
          <p>総合型選抜で入学。先述のモーションキャプチャーを発表した。</p>
        </TimelineItem>
        <TimelineItem date="2023-08" prevColor="primary" nextColor="primary">
          <p className="font-bold">U☆PoC～UECアイディア実証コンテスト 2023</p>
          <p>2 作品で企業賞を 2 つ受賞。</p>
        </TimelineItem>
        <TimelineItem date="2024-04" prevColor="primary" nextColor="primary">
          <p className="font-bold">技術系サークル team411 代表就任</p>
        </TimelineItem>
        <TimelineItem date="2024-06" prevColor="primary" nextColor="primary">
          <p className="font-bold">株式会社hacomono インターンとして入社</p>
          <p>2025-03 一身上の都合で退社。</p>
        </TimelineItem>
        <TimelineItem date="2025-08" prevColor="primary" nextColor="primary">
          <p className="font-bold">さくらインターネット株式会社 短期インターンに参加</p>
        </TimelineItem>
        <TimelineItem date="2025-10" prevColor="primary" nextColor="primary">
          <p className="font-bold">株式会社ドワンゴ インターンとして入社</p>
          <p>2025-12 契約期間満了につき退社。</p>
        </TimelineItem>
      </ul>
    </div>
  );
}
