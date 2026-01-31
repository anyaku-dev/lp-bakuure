'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { Jost, Zen_Kaku_Gothic_New } from 'next/font/google';

// ==========================================
// フォント設定
// ==========================================
const jost = Jost({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
});

const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

// ==========================================
// 設定・定数
// ==========================================

// 購入リンク（あとから変数で変更しやすいように管理）
const PURCHASE_LINK = 'https://buy.stripe.com/8x214m9tW3vV6dMdzCeZ202';

// GTM ID
const GTM_ID = 'GTM-TN6P9QF8';

// アニメーション設定（後から編集しやすいようにメモ）
// 出現速度: duration-1000 (1000ms)
// 遅延: delay-0 (0ms)
// イージング: ease-out
const ANIMATION_CLASS_VISIBLE = 'opacity-100 translate-y-0';
const ANIMATION_CLASS_HIDDEN = 'opacity-0 translate-y-10';
const ANIMATION_TRANSITION = 'transition-all duration-1000 ease-out';

// ==========================================
// 型定義
// ==========================================

type LinkArea = {
  left: number; // %
  top: number; // %
  width: number; // %
  height: number; // %
  href: string;
  ariaLabel: string;
};

type ImageData = {
  src: string;
  alt: string;
  links?: LinkArea[];
};

// ==========================================
// 画像データ定義
// ==========================================

const IMAGES: ImageData[] = [
  {
    src: '/lp-001/1.webp',
    alt: 'LP Image 1',
    links: [
      { left: 9.5, top: 83.65, width: 81, height: 11.55, href: PURCHASE_LINK, ariaLabel: 'テンプレ集を購入する（画像1）' },
    ],
  },
  { src: '/lp-001/2.webp', alt: 'LP Image 2' },
  { src: '/lp-001/3.webp', alt: 'LP Image 3' },
  { src: '/lp-001/4.webp', alt: 'LP Image 4' },
  { src: '/lp-001/5.webp', alt: 'LP Image 5' },
  { src: '/lp-001/6.webp', alt: 'LP Image 6' },
  { src: '/lp-001/7.webp', alt: 'LP Image 7' },
  { src: '/lp-001/8.webp', alt: 'LP Image 8' },
  { src: '/lp-001/9.webp', alt: 'LP Image 9' },
  { src: '/lp-001/10.webp', alt: 'LP Image 10' },
  {
    src: '/lp-001/11.webp',
    alt: 'LP Image 11',
    links: [
      { left: 9.5, top: 87, width: 81, height: 11.55, href: PURCHASE_LINK, ariaLabel: 'テンプレ集を購入する（画像11）' },
    ],
  },
  {
    src: '/lp-001/12.webp',
    alt: 'LP Image 12',
    links: [
      { left: 10.56, top: 64.5, width: 12.85, height: 7.91, href: '/terms', ariaLabel: '利用規約（画像フッター）' },
      { left: 35.21, top: 64.5, width: 30.69, height: 7.19, href: '/privacy', ariaLabel: 'プライバシーポリシー（画像フッター）' },
      { left: 75.28, top: 64.5, width: 12.92, height: 7.77, href: '/company', ariaLabel: '運営会社（画像フッター）' },
    ],
  },
];

// ==========================================
// コンポーネント
// ==========================================

function CountdownHeader() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const PERIOD_SEC = 3 * 24 * 60 * 60;

    const tick = () => {
      const nowSec = Math.floor(Date.now() / 1000);
      let remain = PERIOD_SEC - (nowSec % PERIOD_SEC);
      if (remain === 0) remain = PERIOD_SEC;

      const days = Math.floor(remain / (24 * 60 * 60));
      const hours = Math.floor((remain % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((remain % (60 * 60)) / 60);
      const seconds = remain % 60;

      setTimeLeft({ days, hours, minutes, seconds });
    };

    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // SSR/CSR差分によるガタつき防止（元コード同様）
  if (!mounted) return <div style={{ height: 53, background: '#1B2024' }} />;

  const dd = String(timeLeft.days).padStart(2, '0');
  const hh = String(timeLeft.hours).padStart(2, '0');
  const mm = String(timeLeft.minutes).padStart(2, '0');
  const ss = String(timeLeft.seconds).padStart(2, '0');

  return (
    <div className={`countdownRoot ${zenKaku.className}`}>
      <div className="countdownInner">
        <div className="countdownBadge">
          <img
            src="/lp-001/timer-left.svg"
            alt="特別キャンペーン 終了まで残り"
            className="badgeSvg"
            draggable={false}
          />
        </div>

        <div className="timer" aria-label="カウントダウン">
          <div className="tItem">
            <span className={`tNum ${jost.className}`}>{dd}</span>
            <i className="tUnit">日</i>
          </div>
          <div className="tItem">
            <span className={`tNum ${jost.className}`}>{hh}</span>
            <i className="tUnit">時間</i>
          </div>
          <div className="tItem">
            <span className={`tNum ${jost.className}`}>{mm}</span>
            <i className="tUnit">分</i>
          </div>
          <div className="tItem">
            <span className={`tNum ${jost.className}`}>{ss}</span>
            <i className="tUnit">秒</i>
          </div>
        </div>
      </div>

      <style jsx>{`
        .countdownRoot {
          width: 100%;
          background: #1b2024;
          overflow: hidden;
        }
        .countdownInner {
          width: 100%;
          height: 53px;
          display: flex;
          align-items: stretch;
          background: #1b2024;
          overflow: hidden;
        }
        .countdownBadge {
          flex: 0 0 auto;
          height: 53px;
          width: clamp(140px, 36vw, 150px);
          overflow: hidden;
          line-height: 0;
        }
        .badgeSvg {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          object-position: center;
        }
        .timer {
          flex: 1 1 auto;
          min-width: 0;
          height: 53px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: clamp(10px, 3vw, 18px);
          padding-left: clamp(10px, 3vw, 16px);
          padding-right: clamp(10px, 3vw, 16px);
          overflow: hidden;
        }
        .tItem {
          display: inline-flex;
          align-items: baseline;
          gap: clamp(4px, 1.2vw, 8px);
          white-space: nowrap;
          min-width: 0;
        }
        .tNum {
          color: #fff12f;
          font-weight: 500;
          font-variant-numeric: tabular-nums;
          line-height: 1;
          letter-spacing: 0.8px;
          font-size: clamp(23px, 6.5vw, 28px);
        }
        .tUnit {
          color: #fff12f;
          font-style: normal;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          font-size: clamp(9px, 2.7vw, 11px);
        }
        @media (max-width: 380px) {
          .timer {
            gap: 10px;
            padding-left: 10px;
            padding-right: 12px;
          }
          .tNum {
            font-size: 23px;
            letter-spacing: 0.6px;
          }
        }
      `}</style>
    </div>
  );
}

const FadeInImage = ({ data, index }: { data: ImageData; index: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '0px 0px -10% 0px', // 画面の下10%に入ったら発火
        threshold: 0,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full ${ANIMATION_TRANSITION} ${
        isVisible ? ANIMATION_CLASS_VISIBLE : ANIMATION_CLASS_HIDDEN
      }`}
    >
      <Image
        src={data.src}
        alt={data.alt}
        width={0}
        height={0}
        sizes="(max-width: 425px) 100vw, 425px"
        className="w-full h-auto block"
        priority={index < 2} // ファーストビュー付近は優先読み込み
      />
      {data.links?.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          aria-label={link.ariaLabel}
          className="absolute block z-10"
          style={{
            left: `${link.left}%`,
            top: `${link.top}%`,
            width: `${link.width}%`,
            height: `${link.height}%`,
          }}
        />
      ))}
    </div>
  );
};

export default function LpPage() {
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const distanceToBottom = documentHeight - (scrollY + windowHeight);

      // ページトップから1000pxスクロールしたときに出現し、
      // ページの最下部から1000pxより後にスクロールした時は消える（残り1000px未満）
      setShowCta(scrollY > 1000 && distanceToBottom > 1000);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期チェック
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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

      <main className="min-h-screen bg-white">
        {/* 固定ヘッダー */}
        <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none">
          <div className="w-full max-w-[425px] pointer-events-auto shadow-lg">
            <CountdownHeader />
          </div>
        </div>

        {/* ヘッダー分のスペーサー */}
        <div className="w-full h-[53px] bg-[#1B2024]" />

        <div className="max-w-[425px] w-full mx-auto bg-white relative">
          {IMAGES.map((img, index) => (
            <section key={index} className="w-full">
              <FadeInImage data={img} index={index} />
            </section>
          ))}

          <div
            className={`fixed bottom-0 left-0 w-full flex justify-center z-50 pointer-events-none transition-opacity duration-500 ${
              showCta ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className={`w-full max-w-[425px] flex justify-center pb-[28px] ${showCta ? 'pointer-events-auto' : 'pointer-events-none'}`}>
              <Link
                href={PURCHASE_LINK}
                className="block relative transition-transform hover:scale-105 active:scale-95 shadow-xl rounded-full overflow-hidden"
                style={{ width: '80.47%' }}
              >
                <Image
                  src="/lp-001/cta-hover.webp"
                  alt="テンプレ集を購入する"
                  width={0}
                  height={0}
                  sizes="(max-width: 425px) 80vw, 342px"
                  className="w-full h-auto block"
                />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}