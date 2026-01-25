import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "運営会社 | バク売れLPテンプレ",
  description:
    "バク売れLPテンプレ（BAKUUURE LPテンプレ）の運営会社情報（株式会社CHAINSODA）です。",
};

export default function CompanyPage() {
  return (
    <main className="wrap">
      <div className="card">
        <header className="header">
          <h1 className="title">運営会社</h1>
          <p className="lead">バク売れLPテンプレ（BAKUUURE LPテンプレ）の運営会社情報です。</p>
        </header>

        <section className="section">
          <h2 className="h2">会社概要</h2>
          <dl className="dl">
            <div className="row">
              <dt>会社名</dt>
              <dd>株式会社CHAINSODA</dd>
            </div>
            <div className="row">
              <dt>所在地</dt>
              <dd>
                〒150-0001 東京都渋谷区神宮前6-23-4 桑野ビル2F
              </dd>
            </div>
            <div className="row">
              <dt>代表者</dt>
              <dd>代表取締役社長 濵村 涼輔</dd>
            </div>
            <div className="row">
              <dt>連絡先</dt>
              <dd>070-4350-0294</dd>
            </div>
            <div className="row">
              <dt>事業内容</dt>
              <dd>
                マーケティングコンサルティング／人材系プラットフォーム事業／SaaS型事業の開発・運用 等
              </dd>
            </div>
            <div className="row">
              <dt>設立</dt>
              <dd>2022年10月28日</dd>
            </div>
          </dl>

          <p className="note">
            ※上記は CHAINSODA 公式サイト掲載の会社概要を参考にしています。 :contentReference[oaicite:1]{index=1}
          </p>

          <p className="links">
            <a
              href="https://chainsoda.jp/"
              target="_blank"
              rel="noopener noreferrer"
              className="a"
            >
              CHAINSODA公式サイト（https://chainsoda.jp/）
            </a>
          </p>
        </section>

        <nav className="nav">
          <Link className="btn" href="/terms">
            利用規約
          </Link>
          <Link className="btn" href="/privacy">
            プライバシーポリシー
          </Link>
          <Link className="btn" href="/">
            トップへ戻る
          </Link>
        </nav>
      </div>

      <style jsx>{`
        .wrap {
          min-height: 100vh;
          background: #f3f4f6;
          display: flex;
          justify-content: center;
          padding: 24px 12px;
        }
        .card {
          width: 100%;
          max-width: 425px;
          background: #fff;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.14);
          overflow: hidden;
        }
        .header {
          padding: 20px 18px 10px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }
        .title {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          letter-spacing: 0.2px;
        }
        .lead {
          margin: 8px 0 0;
          color: rgba(0, 0, 0, 0.68);
          font-size: 13px;
          line-height: 1.7;
        }
        .section {
          padding: 16px 18px 6px;
        }
        .h2 {
          margin: 0 0 10px;
          font-size: 15px;
          font-weight: 800;
        }
        .dl {
          margin: 0;
          display: grid;
          gap: 10px;
        }
        .row {
          display: grid;
          grid-template-columns: 92px 1fr;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          background: #fafafa;
        }
        dt {
          font-size: 12px;
          font-weight: 800;
          color: rgba(0, 0, 0, 0.65);
        }
        dd {
          margin: 0;
          font-size: 13px;
          line-height: 1.7;
          color: rgba(0, 0, 0, 0.85);
          word-break: break-word;
        }
        .note {
          margin: 12px 0 0;
          font-size: 12px;
          line-height: 1.7;
          color: rgba(0, 0, 0, 0.6);
        }
        .links {
          margin: 10px 0 0;
        }
        .a {
          color: #0b63ce;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-size: 13px;
        }
        .nav {
          display: flex;
          gap: 10px;
          padding: 14px 18px 18px;
          flex-wrap: wrap;
        }
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 10px 12px;
          border-radius: 12px;
          background: #111827;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
          font-weight: 700;
        }
      `}</style>
    </main>
  );
}
