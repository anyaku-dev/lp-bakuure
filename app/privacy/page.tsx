import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー｜バク売れLPテンプレ',
  description: 'バク売れLPテンプレのプライバシーポリシーです。',
};

export default function PrivacyPolicyPage() {
  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 16px',
  };

  const card: React.CSSProperties = {
    width: '100%',
    maxWidth: 860,
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    padding: '28px 20px',
  };

  const h1: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: 0, color: '#111827' };
  const h2: React.CSSProperties = { fontSize: 16, fontWeight: 800, margin: '18px 0 6px', color: '#111827' };
  const p: React.CSSProperties = { margin: '8px 0 0', color: '#374151', lineHeight: 1.9, fontSize: 14.5 };
  const li: React.CSSProperties = { margin: '6px 0', color: '#374151', lineHeight: 1.9, fontSize: 14.5 };
  const ul: React.CSSProperties = { margin: '8px 0 0', paddingLeft: 18 };

  return (
    <main style={wrap}>
      <article style={card}>
        <h1 style={h1}>プライバシーポリシー</h1>
        <p style={p}>
          バク売れLPテンプレ（以下「当サイト」）は、利用者の個人情報を適切に取り扱うため、
          以下のとおりプライバシーポリシーを定めます。
        </p>

        <h2 style={h2}>1. 取得する情報</h2>
        <p style={p}>当サイトでは、以下の情報を取得する場合があります。</p>
        <ul style={ul}>
          <li style={li}>お問い合わせ時に入力された情報（氏名、メールアドレス、内容等）</li>
          <li style={li}>アクセス解析等により自動取得される情報（IPアドレス、閲覧ページ、端末情報、リファラ等）</li>
          <li style={li}>Cookie等の識別子（後述）</li>
        </ul>

        <h2 style={h2}>2. 利用目的</h2>
        <ul style={ul}>
          <li style={li}>お問い合わせへの対応、連絡、本人確認</li>
          <li style={li}>サービスの提供・維持・改善、利用状況の分析</li>
          <li style={li}>不正利用防止、セキュリティ確保</li>
          <li style={li}>広告効果測定（導入する場合）</li>
        </ul>

        <h2 style={h2}>3. Cookie等の利用</h2>
        <p style={p}>
          当サイトは、利便性向上やアクセス解析、広告効果測定のためCookie等を利用する場合があります。
          Cookieはブラウザ設定により無効化できますが、一部機能が正しく動作しない可能性があります。
        </p>

        <h2 style={h2}>4. アクセス解析・広告計測ツール</h2>
        <p style={p}>
          当サイトでは、Google Analytics 4（GA4）、Metaピクセル、Microsoft Clarity等を導入する場合があります。
          これらのツールはCookie等を用いてトラフィックデータを収集することがあります。
          収集される情報は各事業者のプライバシーポリシーに基づき管理されます。
        </p>

        <h2 style={h2}>5. 第三者提供</h2>
        <p style={p}>
          法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供しません。
        </p>

        <h2 style={h2}>6. 安全管理</h2>
        <p style={p}>
          個人情報への不正アクセス、漏えい等を防止するため、合理的な安全管理措置を講じます。
        </p>

        <h2 style={h2}>7. 開示・訂正・削除等</h2>
        <p style={p}>
          本人からの開示・訂正・削除等の請求があった場合、本人確認のうえ合理的な範囲で対応します。
        </p>

        <h2 style={h2}>8. 改定</h2>
        <p style={p}>
          本ポリシーは、必要に応じて改定されることがあります。改定後は当サイト上で告知します。
        </p>

        <h2 style={h2}>9. お問い合わせ</h2>
        <p style={p}>
          本ポリシーに関するお問い合わせは、運営会社ページをご参照ください。
        </p>
      </article>
    </main>
  );
}
