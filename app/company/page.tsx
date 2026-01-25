import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "運営会社｜バク売れLPテンプレ",
  description: "バク売れLPテンプレの運営会社情報です。",
};

export default function CompanyPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px", lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>運営会社</h1>
      <p style={{ color: "#444", marginBottom: 20 }}>
        本サービス「バク売れLPテンプレ」の運営会社情報です。
      </p>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>会社概要</h2>

        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, background: "#fff" }}>
          <dl style={{ display: "grid", gridTemplateColumns: "160px 1fr", rowGap: 10, columnGap: 16, margin: 0 }}>
            <dt style={{ color: "#555" }}>会社名</dt>
            <dd style={{ margin: 0 }}>株式会社CHAINSODA</dd>

            <dt style={{ color: "#555" }}>所在地</dt>
            <dd style={{ margin: 0 }}>
              〒150-0001<br />
              東京都渋谷区神宮前6-23-4 桑野ビル2F
            </dd>

            <dt style={{ color: "#555" }}>代表者</dt>
            <dd style={{ margin: 0 }}>代表取締役社長 濵村 涼輔</dd>

            <dt style={{ color: "#555" }}>連絡先</dt>
            <dd style={{ margin: 0 }}>070-4350-0294</dd>

            <dt style={{ color: "#555" }}>事業内容</dt>
            <dd style={{ margin: 0 }}>
              マーケティングコンサルティング／人材系プラットフォーム事業／SaaS型事業の開発・運用 等
            </dd>

            <dt style={{ color: "#555" }}>設立</dt>
            <dd style={{ margin: 0 }}>2022年10月28日</dd>
          </dl>

          <div style={{ marginTop: 14 }}>
            <a
              href="https://chainsoda.jp/"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#2563eb", textDecoration: "underline" }}
            >
              公式サイト（株式会社CHAINSODA）
            </a>
          </div>
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>お問い合わせ</h2>
        <p>
          サービス内容・利用規約・プライバシーポリシーに関するお問い合わせは、上記の公式サイトよりご連絡ください。
        </p>
      </section>
    </main>
  );
}
