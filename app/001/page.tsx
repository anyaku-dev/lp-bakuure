'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import CountdownHeader from '@/components/CountdownHeader';

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
          const isInternal = h.href.startsWith('/');

          const commonStyle: React.CSSProperties = {
            left: `${h.left}%`,
            top: `${h.top}%`,
            width: `${h.width}%`,
            height: `${h.height}%`,
          };

          // 内部リンクは next/link、外部リンクは a
          return isInternal ? (
            <Link key={idx} href={h.href} aria-label={h.ariaLabel} className="hsLink" style={commonStyle} />
          ) : (
            <a
              key={idx}
              href={h.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={h.ariaLabel}
              className="hsLink"
              style={commonStyle}
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

        /* iOS/LINE等でリンクが効かない問題を潰すため、必ず画像より上 */
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

          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          touch-action: manipulation;
        }
      `}</style>
    </div>
  );
}

/**
 * “確実に表示される” Reveal
 * - IntersectionObserverが死んでも 1.2秒で強制表示
 * - LINE/アプリ内ブラウザの「2枚目以降が出ない」を根絶
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

    // 1.2秒たっても出てなければ強制表示
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

export default function Landing001Page() {
  // ✅ CTAリンク（ここだけ本番URLに差し替え）
  const CTA_LINK = 'https://anyaku.co.jp/';

  // ✅ 画像フォルダ
  const BASE = '/lp-001';

  // 1.webp〜12.webp
  const images = Array.from({ length: 12 }, (_, i) => `${i + 1}.webp`);

  /**
   * ホットスポット座標は “%” 指定
   * まずは最小：1,11はCTA／12はフッター3リンク
   *
   * ※ CTA/フッターの位置はデザインごとに変わるので
   *   もし位置が違う場合は、left/top/width/heightを調整していく感じでOK
   */
  const hotspotsByFile: Record<string, Hotspot[]> = {
    // 1.webp CTA（仮座標：以前のLPの値。合わなければ調整）
    '1.webp': [
      {
        left: 11.81,
        top: 83.65,
        width: 79.23,
        height: 9.61,
        href: CTA_LINK,
        ariaLabel: 'テンプレ集を購入する（画像1）',
      },
    ],

    // 11.webp CTA（仮座標：以前のLPの値。合わなければ調整）
    '11.webp': [
      {
        left: 12.08,
        top: 80.54,
        width: 79.0,
        height: 11.55,
        href: CTA_LINK,
        ariaLabel: 'テンプレ集を購入する（画像11）',
      },
    ],

    // 12.webp フッター（内部リンク）
    '12.webp': [
      {
        left: 10.56,
        top: 80.0,
        width: 12.85,
        height: 7.91,
        href: '/terms',
        ariaLabel: '利用規約（画像フッター）',
      },
      {
        left: 35.21,
        top: 80.29,
        width: 30.69,
        height: 7.19,
        href: '/privacy',
        ariaLabel: 'プライバシーポリシー（画像フッター）',
      },
      {
        left: 75.28,
        top: 80.0,
        width: 12.92,
        height: 7.77,
        href: '/company',
        ariaLabel: '運営会社（画像フッター）',
      },
    ],
  };

  return (
    <main className="pageRoot">
      <div className="lpContainer">
        {/* 固定ヘッダー：PCでも425px枠に収めて中央固定 */}
        <div className="fixedHeader">
          <CountdownHeader />
        </div>

        <div className="headerSpacer" aria-hidden />

        <div className="lpBody">
          {images.map((imgName, index) => {
            const hs = hotspotsByFile[imgName] ?? [];
            const isFirstOrSecond = index === 0 || index === 1;

            const content = (
              <div className="lpSection">
                <HotspotImage
                  src={`${BASE}/${imgName}`}
                  alt={`LP 001 Slide ${index + 1}`}
                  hotspots={hs}
                  loading={isFirstOrSecond ? 'eager' : 'lazy'}
                  fetchPriority={isFirstOrSecond ? 'high' : undefined}
                />
              </div>
            );

            // 1枚目は即表示、それ以外は強力Reveal（でも強制表示で詰まらない）
            return (
              <React.Fragment key={imgName}>
                {index === 0 ? content : <RevealOnView enabled>{content}</RevealOnView>}
              </React.Fragment>
            );
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

        /* ✅ PCで右側に黒帯が伸びないよう、枠の中央固定 */
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
