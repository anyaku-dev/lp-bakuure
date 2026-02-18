import type { Metadata } from 'next';
import Script from 'next/script';
import Image from 'next/image';

// ==========================================
// Meta情報
// ==========================================
export const metadata: Metadata = {
  title: 'ご購入ありがとうございます | バク売れLPテンプレ',
  description: 'バク売れLPテンプレートをご購入いただきありがとうございます。購入完了メールをご確認ください。',
  robots: { index: false, follow: false },
};

// ==========================================
// GTM設定
// ==========================================
const GTM_ID = 'GTM-5382V9Z5';

// ==========================================
// ページ本体
// ==========================================
export default function ThanksPage() {
  return (
    <>
      {/* GTM Script */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${GTM_ID}');`}
      </Script>
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>

      <main
        style={{
          minHeight: '100dvh',
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 20px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
        }}
      >
        {/* ロゴ */}
        <div style={{ marginTop: 48, marginBottom: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/bakuure-logo-new.png"
            alt="バク売れLPテンプレ"
            width={160}
            height={60}
            style={{ height: 'auto', width: 160 }}
          />
        </div>

        {/* 区切り線 */}
        <div style={{ width: 40, height: 1, background: '#d4d4d4', margin: '32px 0' }} />

        {/* メインメッセージ */}
        <h1
          style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: '#111',
            textAlign: 'center',
            lineHeight: 1.6,
            letterSpacing: '0.04em',
          }}
        >
          ご購入ありがとうございます
        </h1>

        {/* イメージ画像（メッセージのすぐ下） */}
        <div
          style={{
            marginTop: 28,
            width: '100%',
            maxWidth: 380,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/image-01.jpg"
            alt="バク売れLPテンプレート"
            width={1024}
            height={542}
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* メール案内 */}
        <div
          style={{
            marginTop: 32,
            width: '100%',
            maxWidth: 380,
          }}
        >
          <p
            style={{
              fontSize: 14,
              lineHeight: 2,
              color: '#333',
              textAlign: 'center',
              margin: 0,
            }}
          >
            購入完了メールを送信しております。
            <br />
            メール内にLPテンプレートの
            <br />
            ダウンロード方法をご案内しておりますので、
            <br />
            ご確認くださいませ。
          </p>
        </div>

        {/* 注意書き */}
        <div
          style={{
            marginTop: 28,
            width: '100%',
            maxWidth: 380,
            padding: '14px 16px',
            background: '#fafafa',
            border: '1px solid #e5e5e5',
          }}
        >
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.8,
              color: '#666',
              margin: 0,
              textAlign: 'center',
            }}
          >
            メールが届かない場合は、
            <br />
            迷惑メールフォルダもご確認ください。
          </p>
        </div>

        {/* フッター */}
        <footer
          style={{
            marginTop: 56,
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          <div style={{ width: 32, height: 1, background: '#d4d4d4', margin: '0 auto 20px' }} />
          <p
            style={{
              margin: 0,
              fontSize: 10,
              color: '#aaa',
              letterSpacing: '0.06em',
            }}
          >
            &copy; {new Date().getFullYear()} バク売れLPテンプレ
          </p>
        </footer>
      </main>
    </>
  );
}
