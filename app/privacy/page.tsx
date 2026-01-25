import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー｜バク売れLPテンプレ",
  description: "バク売れLPテンプレのプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 20px", lineHeight: 1.8 }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>プライバシーポリシー</h1>
      <p style={{ color: "#444", marginBottom: 20 }}>
        バク売れLPテンプレ（以下「当サイト」）は、ユーザーの個人情報を適切に保護し、取り扱うために本プライバシーポリシーを定めます。
      </p>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>1. 取得する情報</h2>
        <p>当サイトでは、以下の情報を取得する場合があります。</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>お問い合わせやフォーム送信時に入力された情報（氏名、メールアドレス、会社名等）</li>
          <li>決済や購入手続きに関連して提供される情報（決済事業者を介して提供される範囲）</li>
          <li>アクセスログ情報（IPアドレス、ブラウザ、参照元、閲覧ページ、滞在時間等）</li>
          <li>Cookie等を用いて収集される識別子や行動履歴</li>
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>2. 利用目的</h2>
        <p>取得した情報は、以下の目的で利用します。</p>
        <ul style={{ paddingLeft: 20 }}>
          <li>商品・サービスの提供、本人確認、サポート対応</li>
          <li>お問い合わせへの回答、重要なお知らせ等の連絡</li>
          <li>不正行為・利用規約違反の防止、セキュリティ確保</li>
          <li>当サイトの改善、利用状況の分析、品質向上</li>
          <li>新機能、キャンペーン等の案内（必要に応じて）</li>
        </ul>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>3. Cookie等の利用</h2>
        <p>
          当サイトでは、利便性向上やアクセス解析のため、Cookieや類似技術を使用する場合があります。
          Cookieはブラウザ設定により無効化できますが、一部機能が正しく動作しない場合があります。
        </p>
        <p style={{ marginTop: 10 }}>
          また、当サイトでは今後、Google Analytics（GA4）、Metaピクセル、Microsoft Clarity等の解析・計測ツールを導入する場合があります。
          これらのツールはCookie等を利用してトラフィックデータを収集することがあります。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>4. 第三者提供</h2>
        <p>
          当サイトは、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。
          ただし、業務委託先（決済、メール配信、ホスティング等）に必要な範囲で取り扱いを委託することがあります。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>5. 安全管理</h2>
        <p>
          個人情報への不正アクセス、漏えい、改ざん、滅失等を防止するため、適切な安全管理措置を講じます。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>6. 開示・訂正・削除等</h2>
        <p>
          ユーザーご本人から個人情報の開示、訂正、削除等の要請があった場合、法令に従い適切に対応します。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>7. 本ポリシーの変更</h2>
        <p>
          本ポリシーは、法令改正や運用改善に伴い、予告なく改定される場合があります。最新の内容は当ページにて公表します。
        </p>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 18, marginBottom: 8 }}>8. お問い合わせ</h2>
        <p>
          本ポリシーに関するお問い合わせは、運営会社ページをご参照ください。
        </p>
      </section>
    </main>
  );
}
