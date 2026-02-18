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
          background: 'linear-gradient(180deg, #f8f6f3 0%, #fff 40%, #f8f6f3 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 16px',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", Meiryo, sans-serif',
        }}
      >
        {/* ロゴ */}
        <div style={{ marginTop: 40, marginBottom: 8 }}>
          <Image
            src="/bakuure-logo-new.png"
            alt="バク売れLPテンプレ"
            width={180}
            height={50}
            style={{ height: 'auto', width: 180 }}
            priority
          />
        </div>

        {/* 完了アイコン + バッジ */}
        <div
          style={{
            marginTop: 32,
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(16,185,129,0.25)',
          }}
        >
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* メインメッセージ */}
        <h1
          style={{
            marginTop: 24,
            fontSize: 22,
            fontWeight: 700,
            color: '#1a1a1a',
            textAlign: 'center',
            lineHeight: 1.5,
            letterSpacing: '0.02em',
          }}
        >
          ご購入ありがとうございます！
        </h1>

        <p
          style={{
            marginTop: 8,
            fontSize: 14,
            color: '#6b7280',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          決済が正常に完了しました
        </p>

        {/* メール案内カード */}
        <div
          style={{
            marginTop: 32,
            width: '100%',
            maxWidth: 400,
            background: '#fff',
            borderRadius: 16,
            padding: '28px 24px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            border: '1px solid #f0ebe5',
          }}
        >
          {/* メールアイコン */}
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="3" stroke="#7c3aed" strokeWidth="1.8" />
              <path d="M2 7l10 6 10-6" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: '#1a1a1a',
              textAlign: 'center',
              marginBottom: 12,
              lineHeight: 1.6,
            }}
          >
            購入完了メールをご確認ください
          </h2>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.85,
              color: '#4b5563',
              textAlign: 'center',
            }}
          >
            ご購入いただき誠にありがとうございます。
            <br />
            ご登録いただいたメールアドレス宛に
            <strong style={{ color: '#1a1a1a' }}>購入完了メール</strong>
            を送信しております。
          </p>

          <div
            style={{
              marginTop: 16,
              padding: '14px 16px',
              background: '#faf5ff',
              borderRadius: 10,
              border: '1px solid #ede9fe',
            }}
          >
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.8,
                color: '#6d28d9',
                textAlign: 'center',
                fontWeight: 500,
                margin: 0,
              }}
            >
              📩 メール内に
              <strong>LPテンプレートのダウンロード方法</strong>
              をご案内しておりますので、ご確認くださいませ。
            </p>
          </div>
        </div>

        {/* 注意書き */}
        <div
          style={{
            marginTop: 20,
            width: '100%',
            maxWidth: 400,
            padding: '16px 20px',
            background: '#fffbeb',
            borderRadius: 12,
            border: '1px solid #fde68a',
          }}
        >
          <p
            style={{
              fontSize: 12,
              lineHeight: 1.7,
              color: '#92400e',
              margin: 0,
            }}
          >
            <strong>⚠ メールが届かない場合</strong>
            <br />
            迷惑メールフォルダやプロモーションタブもご確認ください。
            数分経っても届かない場合は、お問い合わせくださいませ。
          </p>
        </div>

        {/* イメージ画像 */}
        <div
          style={{
            marginTop: 36,
            width: '100%',
            maxWidth: 400,
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          <Image
            src="/image-01.jpg"
            alt="バク売れLPテンプレート イメージ"
            width={800}
            height={600}
            style={{ width: '100%', height: 'auto', display: 'block' }}
            priority
          />
        </div>

        {/* フッター */}
        <footer
          style={{
            marginTop: 48,
            marginBottom: 40,
            textAlign: 'center',
          }}
        >
          <Image
            src="/bakuure-logo-new.png"
            alt="バク売れLPテンプレ"
            width={120}
            height={34}
            style={{ height: 'auto', width: 120, opacity: 0.5 }}
          />
          <p
            style={{
              marginTop: 12,
              fontSize: 11,
              color: '#9ca3af',
              lineHeight: 1.6,
            }}
          >
            &copy; {new Date().getFullYear()} バク売れLPテンプレ
          </p>
        </footer>
      </main>
    </>
  );
}
