'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Jost, Zen_Kaku_Gothic_New } from 'next/font/google';

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

type Hotspot = {
  left: number;
  top: number;
  width: number;
  height: number;
  href: string;
  ariaLabel: string;
};

function HotspotImage({
  src,
  alt,
  hotspots = [],
  loading = 'lazy',
  fetchPriority,
}: {
  src: string;
  alt: string;
  hotspots?: Hotspot[];
  loading?: 'eager' | 'lazy';
  fetchPriority?: 'high' | 'low' | 'auto';
}) {
  const imgProps: React.ImgHTMLAttributes<HTMLImageElement> & {
    fetchPriority?: 'high' | 'low' | 'auto';
  } = {
    src,
    alt,
    className: 'hsImg',
    loading,
    draggable: false,
    decoding: 'async',
    onContextMenu: (e) => e.preventDefault(),
    onDragStart: (e) => e.preventDefault(),
    ...(fetchPriority ? { fetchPriority } : {}),
  };

  return (
    <div className="hsWrap">
      <img {...imgProps} />

      <div className="hsLayer" aria-hidden={hotspots.length === 0}>
        {hotspots.map((h, idx) => {
          const isExternal = /^https?:\/\//.test(h.href);

          return (
            <a
              key={idx}
              href={h.href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              aria-label={h.ariaLabel}
              className="hsLink"
              style={{
                left: `${h.left}%`,
                top: `${h.top}%`,
                width: `${h.width}%`,
                height: `${h.height}%`,
              }}
            />
          );
        })}
      </div>

      <style jsx>{`
        .hsWrap {
          position: relative;
          width: 100%;
        }
        .hsImg {
          width: 100%;
          height: auto;
          display: block;
          user-select: none;
          -webkit-user-drag: none;
        }

        /* ✅ iOS/アプリ内ブラウザ対策：必ず画像より上に */
        .hsLayer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 5;
        }
        .hsLink {
          position: absolute;
          display: block;
          pointer-events: auto;
          cursor: pointer;
          border-radius: 10px;
          z-index: 6;

          /* ✅ iOSのタップ判定を強める */
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}

/**
 * ✅ 強力版 Reveal
 * - IntersectionObserverが壊れても 1.2秒で強制表示
 * - アプリ内ブラウザの“スクロール検知死”を根絶
 */
function RevealOnView({
  children,
  enabled = true,
  rootMargin = '200px 0px 200px 0px',
}: {
  children: React.ReactNode;
  enabled?: boolean;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;

    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }

    let timeoutId: number | null = null;

    // ✅ 1.2秒たっても出てなければ強制表示（LINE等対策）
    timeoutId = window.setTimeout(() => {
      setShown(true);
    }, 1200);

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      if (timeoutId) window.clearTimeout(timeoutId);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
          if (timeoutId) window.clearTimeout(timeoutId);
        }
      },
      { threshold: 0.01, rootMargin }
    );

    obs.observe(el);

    return () => {
      obs.disconnect();
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [enabled, rootMargin]);

  return (
    <div ref={ref} className={`reveal ${shown ? 'isShown' : ''}`}>
      {children}

      <style jsx>{`
        .reveal {
          width: 100%;
          display: block;

          /* ✅ “見えないまま”を作らないため、最悪でも後で必ず isShown になる */
          opacity: 0;
          transform: translate3d(0, 14px, 0);
          transition:
            opacity 520ms cubic-bezier(0.2, 0.9, 0.2, 1),
            transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1);
          will-change: opacity, transform;
        }
        .reveal.isShown {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            transition: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
}

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

  if (!mounted) return <div style={{ height: 53, background: '#1B2024' }} />;

  const dd = String(timeLeft.days).padStart(2, '0');
  const hh = String(timeLeft.hours).padStart(2, '0');
  const mm = String(timeLeft.minutes).padStart(2, '0');
  const ss = String(timeLeft.seconds).padStart(2, '0');

  return (
    <div className={`countdownRoot ${zenKaku.className}`}>
      <div className="countdownInner">
        <div className="countdownBadge">
          <img src="/timer-left.svg" alt="特別キャンペーン 終了まで残り" className="badgeSvg" draggable={false} />
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
          font-size: clamp(24px, 8vw, 34.2px);
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

export default function LandingPage() {
  const PURCHASE_LINK = 'https://anyaku.co.jp/';

  const hotspotsByFile: Record<string, Hotspot[]> = {
    '1.webp': [
      { left: 9.5,
        top: 83.65,
        width: 81,
        height: 11.55,
         href: PURCHASE_LINK, ariaLabel: 'テンプレ集を購入する（画像1）' },
    ],
    '11.webp': [
      { left: 9.5,
        top: 87,
        width: 81,
        height: 11.55,
         href: PURCHASE_LINK, ariaLabel: 'テンプレ集を購入する（画像11）' },
    ],

    // 12.webpのホットスポットも残す（ただし「確実リンク」は RealFooterLinks が担保）
    '12.webp': [
      { left: 10.56, top: 64.5, width: 12.85, height: 7.91, href: '/terms', ariaLabel: '利用規約（画像フッター）' },
      { left: 35.21, top: 64.5, width: 30.69, height: 7.19, href: '/privacy', ariaLabel: 'プライバシーポリシー（画像フッター）' },
      { left: 75.28, top: 64.5, width: 12.92, height: 7.77, href: '/company', ariaLabel: '運営会社（画像フッター）' },
    ],
  };

  const images = ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp', '11.webp', '12.webp'];

  // ===============================
  // ① CTA用 state + ref + useEffect
  // ===============================
  const CTA_LINK = 'https://buy.stripe.com/8x214m9tW3vV6dMdzCeZ202';

  const footerSentinelRef = useRef<HTMLDivElement | null>(null);
  const [showCta, setShowCta] = useState(false);

  useEffect(() => {
    // ✅ PCは出さない（スマホだけ）
    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    if (!isMobile) return;

    let cleanupFns: Array<() => void> = [];

    // ✅ 少しスクロールしたら表示（例：120px）
    const onScroll = () => {
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (y > 120) setShowCta(true);
      else setShowCta(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    cleanupFns.push(() => window.removeEventListener('scroll', onScroll));

    // ✅ フッター領域まで来たら非表示（IntersectionObserverで監視）
    const sentinel = footerSentinelRef.current;
    if (!sentinel) return () => cleanupFns.forEach((fn) => fn());

    if (typeof IntersectionObserver === 'undefined') {
      // フォールバック：IOがない環境ではスクロール判定のみ（最悪OK）
      return () => cleanupFns.forEach((fn) => fn());
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // entry.isIntersecting === true → フッター付近に来た → CTAを消す
        if (entry?.isIntersecting) {
          setShowCta(false);
        } else {
          // フッターから離れていて、かつスクロールしているなら表示
          const y = window.scrollY || document.documentElement.scrollTop || 0;
          if (y > 120) setShowCta(true);
        }
      },
      {
        // ✅ 画面下部にフッターが"触れたら"消す
        //   rootMargin の bottom を少しマイナスにすると、少し手前で消える
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.01,
      }
    );

    obs.observe(sentinel);
    cleanupFns.push(() => obs.disconnect());

    return () => cleanupFns.forEach((fn) => fn());
  }, []);

  return (
    <main className="pageRoot">
      <div className="lpContainer">
        <div className="fixedHeader">
          <CountdownHeader />
        </div>

        <div className="headerSpacer" aria-hidden />

        <div className="lpBody">
          {images.map((imgName, index) => {
            const hs = hotspotsByFile[imgName] ?? [];

            // ✅ 1枚目は即表示、2枚目以降は Reveal（ただし壊れても強制表示される）
            const shouldReveal = index >= 1;
            const isSecond = index === 1;

            const content = (
              <div className="lpSection">
                <HotspotImage
                  src={`/lp-001/${imgName}`}
                  alt={`Slide ${index + 1}`}
                  hotspots={hs}
                  loading={index === 0 || isSecond ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 || isSecond ? 'high' : undefined}
                />
              </div>
            );

            return <React.Fragment key={imgName}>{shouldReveal ? <RevealOnView enabled>{content}</RevealOnView> : content}</React.Fragment>;
          })}

          {/* ✅ フッター監視用の見えない目印（最下部） */}
          <div ref={footerSentinelRef} aria-hidden style={{ height: 1 }} />
        </div>

        {/* ✅ 固定CTA（スマホで少しスクロール後に表示 / フッターで消える） */}
        <a
          href={CTA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className={`fixedCta ${showCta ? 'isShown' : ''}`}
          aria-label="購入へ進む"
        >
          <img src="/lp-001/cta-hover_btn.webp" alt="購入する" draggable={false} />
          <style jsx>{`
            .fixedCta {
              position: fixed;
              left: 50%;
              transform: translateX(-50%);
              bottom: calc(env(safe-area-inset-bottom, 0px) + 12px);
              width: min(92vw, 420px);
              z-index: 1000;

              display: block;
              line-height: 0;
              border-radius: 14px;
              overflow: hidden;
              box-shadow: 0 14px 28px rgba(0, 0, 0, 0.22);

              /* ✅ 初期は非表示 */
              opacity: 0;
              pointer-events: none;
              transform: translateX(-50%) translate3d(0, 10px, 0);
              transition:
                opacity 220ms ease,
                transform 220ms ease;
              -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
              touch-action: manipulation;
            }

            .fixedCta.isShown {
              opacity: 1;
              pointer-events: auto;
              transform: translateX(-50%) translate3d(0, 0, 0);
            }

            .fixedCta img {
              width: 100%;
              height: auto;
              display: block;
              user-select: none;
              -webkit-user-drag: none;
            }

            /* ✅ スマホのみ表示 */
            @media (min-width: 768px) {
              .fixedCta {
                display: none;
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .fixedCta {
                transition: none;
              }
            }
          `}</style>
        </a>
      </div>

      <style jsx>{`
        .pageRoot {
          min-height: 100vh;
          background: #f3f4f6;
          display: flex;
          justify-content: center;
          overflow-x: hidden;
        }

        .lpContainer {
          width: 100%;
          background: #ffffff;
          position: relative;
          min-height: 100vh;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.18);
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .lpContainer {
            width: clamp(425px, 40vw, 40vw);
          }
        }

        .fixedHeader {
          position: fixed;
          top: 0;
          z-index: 999;
          background: #1b2024;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
          left: 0;
          width: 100%;
        }

        @media (min-width: 768px) {
          .fixedHeader {
            left: 50%;
            transform: translateX(-50%);
            width: clamp(425px, 40vw, 40vw);
          }
        }

        .headerSpacer {
          height: 53px;
          width: 100%;
        }

        .lpBody {
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .lpSection {
          width: 100%;
          background: #fafafa;
        }
      `}</style>
    </main>
  );
}
