import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '運営会社｜バク売れLPテンプレ',
  description: 'バク売れLPテンプレの運営会社情報ページです。',
};

export default function CompanyPage() {
  const siteUrl = 'https://bakuure.vercel.app/';
  const refUrl = 'https://chainsoda.jp/';

  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 16px',
  };

  const card: React.CSSProperties = {
    width: '100%',
    maxWidth: 760,
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    padding: '28px 20px',
  };

  const h1: React.CSSProperties = {
    fontSize: 22,
    fontWeight: 800,
    margin: 0,
    color: '#111827',
    letterSpacing: '0.02em',
  };

  const p: React.CSSProperties = {
    margin: '10px 0 0',
    color: '#374151',
    lineHeight: 1.8,
    fontSize: 15,
  };

  const section: React.CSSProperties = {
    marginTop: 18,
    paddingTop: 18,
    borderTop: '1px solid #e5e7eb',
  };

  const dl: React.CSSProperties = {
    margin: '12px 0 0',
    display: 'grid',
    gridTemplateColumns: '140px 1fr',
    rowGap: 10,
    columnGap: 12,
    fontSize: 15,
    color: '#111827',
  };

  const dt: React.CSSProperties = {
    color: '#6b7280',
    fontWeight: 700,
  };

  const dd: React.CSSProperties = {
    margin: 0,
    color: '#111827',
  };

  const link: React.CSSProperties = {
    color: '#2563eb',
    textDecoration: 'underline',
    textUnderlineOffset: 3,
  };

  const note: React.CSSProperties = {
    marginTop: 14,
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 1.7,
  };

  return (
    <main style={wrap}>
      <article style={card}>
        <h1 style={h1}>運営会社</h1>
        <p style={p}>
          本ページの会社情報は、株式会社CHAINSODA様の公開情報を参考に構成しています。
          詳細は下記公式サイトをご確認ください。
        </p>

        <div style={section}>
          <dl style={dl}>
            <dt style={dt}>会社名</dt>
            <dd style={dd}>株式会社CHAINSODA</dd>

            <dt style={dt}>公式サイト</dt>
            <dd style={dd}>
              <a href={refUrl} target="_blank" rel="noopener noreferrer" style={link}>
                株式会社CHAINSODA 公式サイト
              </a>
            </dd>

            <dt style={dt}>本LP</dt>
            <dd style={dd}>
              <a href={siteUrl} style={link}>
                バク売れLPテンプレ（トップへ）
              </a>
            </dd>
          </dl>

          <p style={note}>
            詳細な会社情報は公式サイトをご確認ください。
          </p>
        </div>

        <div style={section}>
          <p style={p}>
            お問い合わせは、上記公式サイトの窓口をご利用ください。
          </p>
        </div>
      </article>
    </main>
  );
}
