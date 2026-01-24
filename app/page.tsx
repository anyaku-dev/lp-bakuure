'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Jost, Zen_Kaku_Gothic_New } from 'next/font/google';

// Figma指定フォント（数字=Jost 500 / 日本語=Zen Kaku Gothic New 700）
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
  left: number; // %
  top: number; // %
  width: number; // %
  height: number; // %
  href: string;
  ariaLabel: string;
};

function HotspotImage({
  src,
  alt,
  hotspots = [],
  loading = 'lazy',
}: {
  src: string;
  alt: string;
  hotspots?: Hotspot[];
  loading?: 'eager' | 'lazy';
}) {
  return (
    <div
      className="hsWrap"
      // ✅ 右クリック（保存メニュー）抑止
      onContextMenu={(e) => e.preventDefault()}
      // ✅ 画像のドラッグ開始も抑止（img側にも入れるが、念のためラッパーにも）
      onDragStart={(e) => e.preventDefault()}
    >
      <img
        src={src}
        alt={alt}
        className="hsImg"
        loading={loading}
        draggable={false}
        // ✅ 右クリック抑止（ブラウザ差分対策）
        onContextMenu={(e) => e.preventDefault()}
      />

      {/* ✅ 画像保護用：ホットスポット以外の操作を吸う（リンクは別レイヤーで生かす） */}
      <div className="imgGuard" aria-hidden />

      {/* ホットスポットレイヤー（リンクだけクリック可） */}
      <div className="hsLayer" aria-hidden={hotspots.length === 0}>
        {hotspots.map((h, idx) => (
          <a
            key={idx}
            href={h.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={h.ariaLabel}
            className="hsLink"
            style={{
              left: `${h.left}%`,
              top: `${h.top}%`,
              width: `${h.width}%`,
              height: `${h.height}%`,
            }}
            // ✅ リンク自体も右クリック抑止（新規タブは通常クリックでOK）
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        ))}
      </div>

      <style jsx>{`
        .hsWrap {
          position: relative;
          width: 100%;

          /* ✅ 選択/長押し/コールアウト抑止（ライト層の保存導線を減らす） */
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }

        /* 子要素でも選択されないように */
        .hsWrap * {
          -webkit-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }

        .hsImg {
          width: 100%;
          height: auto;
          display: block;
          align-top: top;

          /* iOS系での変なハイライト抑止 */
          -webkit-user-drag: none;
          user-drag: none;

          /* 画像の長押し保存導線を減らす */
          pointer-events: none;
        }

        /* ✅ 画像の上を覆う透明ガード（ここが本命）
           - 画像自体は pointer-events:none にして、ガードが操作を吸う
           - ホットスポットは z-index を上げてクリック可能にする
        */
        .imgGuard {
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: auto;

          background: transparent;

          /* モバイル長押し系を抑止 */
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }

        .hsLayer {
          position: absolute;
          inset: 0;
          z-index: 2; /* guardより前 */
          pointer-events: none; /* レイヤー自体は透過 */
        }

        .hsLink {
          position: absolute;
          display: block;
          pointer-events: auto; /* リンクだけクリック可 */
          cursor: pointer;
          border-radius: 10px;

          /* デバッグしたい時だけON
          outline: 2px solid rgba(0, 255, 0, 0.35);
          background: rgba(0, 255, 0, 0.08);
          */
        }
      `}</style>
    </div>
  );
}

/**
 * 画面に入ったら1回だけ「ふわっ」と表示するラッパー
 * 既存レイアウトを崩さないため、wrapperは block / width:100% のみ
 */
function RevealOnView({
  children,
  enabled = true,
  rootMargin = '0px 0px -10% 0px',
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
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setShown(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [enabled, rootMargin]);

  return (
    <div ref={ref} className={`reveal ${shown ? 'isShown' : ''}`}>
      {children}

      <style jsx>{`
        .reveal {
          width: 100%;
          display: block;

          /* ✅ 下からふわっと上がる */
          opacity: 0;
          transform: translate3d(0, 28px, 0) scale(0.985);
          filter: blur(3px);

          /* ✅ ちょっとゆっくり */
          transition:
            opacity 980ms cubic-bezier(0.2, 0.9, 0.2, 1),
            transform 980ms cubic-bezier(0.2, 0.9, 0.2, 1),
            filter 980ms cubic-bezier(0.2, 0.9, 0.2, 1);

          will-change: opacity, transform, filter;
        }

        .reveal.isShown {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          filter: blur(0);
        }

        @media (prefers-reduced-motion: reduce) {
          .reveal {
            transition: none;
            opacity: 1;
            transform: none;
            filter: none;
          }
        }
      `}</style>
    </div>
  );
}

// =====================================================
// CountdownHeader（左：SVG完全置換 / 右：完全レスポンシブ）
// =====================================================
function CountdownHeader() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const PERIOD_SEC = 3 * 24 * 60 * 60; // 3日周期

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
          max-width: 425px;
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

// =====================================================
// メインページ
// =====================================================
export default function LandingPage() {
  const LINK = 'https://anyaku.co.jp/';

  const hotspotsByFile: Record<string, Hotspot[]> = {
    '1.webp': [
      { left: 11.81, top: 83.65, width: 79.23, height: 9.61, href: LINK, ariaLabel: 'テンプレ集を購入する（画像1）' },
    ],
    '2.webp': [
      { left: 12.08, top: 77.83, width: 79.0, height: 11.43, href: LINK, ariaLabel: 'テンプレ集を購入する（画像2）' },
    ],
    '11.webp': [
      { left: 12.08, top: 80.54, width: 79.0, height: 11.55, href: LINK, ariaLabel: 'テンプレ集を購入する（画像11）' },
    ],
    '12.webp': [
      { left: 10.56, top: 80.0, width: 12.85, height: 7.91, href: LINK, ariaLabel: '利用規約（フッター）' },
      { left: 35.21, top: 80.29, width: 30.69, height: 7.19, href: LINK, ariaLabel: 'プライバシーポリシー（フッター）' },
      { left: 75.28, top: 80.0, width: 12.92, height: 7.77, href: LINK, ariaLabel: '運営会社（フッター）' },
    ],
  };

  const images = ['1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp', '9.webp', '10.webp', '11.webp', '12.webp'];

  return (
    <main className="pageRoot">
      <div className="lpContainer">
        <div className="stickyHeader">
          <CountdownHeader />
        </div>

        <div className="lpBody">
          {images.map((imgName, index) => {
            const hs = hotspotsByFile[imgName] ?? [];
            const shouldReveal = index >= 1;

            const content = (
              <div className="lpSection">
                <HotspotImage src={`/${imgName}`} alt={`Slide ${index + 1}`} hotspots={hs} loading={index === 0 ? 'eager' : 'lazy'} />
              </div>
            );

            return <React.Fragment key={imgName}>{shouldReveal ? <RevealOnView enabled>{content}</RevealOnView> : content}</React.Fragment>;
          })}
        </div>
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

        /* ここは要件どおり：lpContainer幅の中で固定 */
        .stickyHeader {
          position: sticky;
          top: 0;
          z-index: 50;
          width: 100%;
          box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
          background: #1b2024;
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
