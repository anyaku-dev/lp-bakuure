import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約｜バク売れLPテンプレ",
  description: "バク売れLPテンプレの利用規約です。",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px", lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>利用規約</h1>
      <p style={{ color: "#444", marginBottom: 20 }}>
        本利用規約（以下「本規約」）は、バク売れLPテンプレ（以下「本サービス」）の利用条件を定めるものです。
        ユーザーは本規約に同意のうえ、本サービスを利用するものとします。
      </p>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>1. 定義</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>「テンプレート」：本サービスで提供するLPデザインテンプレート、構成、素材セット等</li>
          <li>「ユーザー」：本サービスを閲覧、購入、利用する個人または法人</li>
          <li>「運営者」：本サービスの運営主体</li>
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>2. ライセンス（利用範囲）</h2>
        <p>
          ユーザーは、購入したテンプレートを、以下の範囲で利用できます。
        </p>
        <ul style={{ paddingLeft: 20 }}>
          <li>商用利用：可（自社・クライアント案件いずれも可）</li>
          <li>改変：可（文字・画像差し替え、レイアウト調整、色変更、構成追加等）</li>
          <li>制作物の公開：可（完成したLPをWeb公開、広告配信等）</li>
        </ul>
        <p style={{ marginTop: 10, color: "#444" }}>
          なお、テンプレートそのもの（データ一式）の再配布・転売・共有を許諾するものではありません。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>3. 禁止事項</h2>
        <p>ユーザーは、以下の行為を行ってはなりません。</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>テンプレートデータの再配布、販売、貸与、無償配布、共有（第三者がテンプレとして使える状態で渡す行為を含む）</li>
          <li>本サービスの著作権表示・権利表示の不正な削除（必要な範囲を除く）</li>
          <li>法令または公序良俗に反する目的での利用</li>
          <li>第三者の権利侵害（著作権、商標権、プライバシー等）に該当する利用</li>
          <li>運営者または第三者に不利益・損害を与える行為</li>
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>4. 素材の取り扱い</h2>
        <p>
          本サービスで使用している一部素材（画像・アイコン等）は、配布サイトの利用規約上、商用利用・再利用が可能な素材を採用しています。
          ただし、ユーザーの利用方法や利用先の媒体によっては、追加の確認が必要となる場合があります。
        </p>
        <p style={{ marginTop: 10 }}>
          ユーザーが差し替える素材（写真、ロゴ、文章等）については、ユーザー自身の責任で権利処理を行ってください。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>5. 免責事項</h2>
        <ul style={{ paddingLeft: 20 }}>
          <li>本サービスは、特定の成果（売上増加等）を保証するものではありません。</li>
          <li>ユーザーの利用により生じた損害について、運営者は故意または重過失がある場合を除き責任を負いません。</li>
          <li>通信回線、端末、外部サービスの不具合等により生じた損害について、運営者は責任を負いません。</li>
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>6. 返品・返金</h2>
        <p>
          デジタルコンテンツの性質上、原則として購入後の返品・返金はお受けできません。
          ただし、提供データに重大な欠陥があり、合理的な範囲で修正が不可能な場合は、この限りではありません。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>7. 規約の変更</h2>
        <p>
          運営者は、必要に応じて本規約を改定できます。改定後の規約は当ページに掲示した時点で効力を生じます。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>8. 準拠法・管轄</h2>
        <p>
          本規約は日本法に準拠し、紛争が生じた場合は運営者所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </p>
      </section>
    </main>
  );
}
