'use client';

import React, { useEffect, useMemo, useState } from 'react';
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

// =====================================================
// CountdownHeader（左：SVG完全置換 / 右：完全レスポンシブ）
// =====================================================
function CountdownHeader() {
  const targetDate = useMemo(() => new Date('2026-02-14T23:59:59'), []);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
  setMounted(true);

  const PERIOD_SEC = 3 * 24 * 60 * 60; // 3日周期

  const tick = () => {
    const nowMs = Date.now();
    const nowSec = Math.floor(nowMs / 1000);

    // 3日周期の「残り秒数」
    let remain = PERIOD_SEC - (nowSec % PERIOD_SEC);

    // 0になった瞬間に「3日」に戻す
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
        {/* 左：SVG（public/timer-left.svg を参照して完全置換） */}
        <div className="countdownBadge">
          <img
            src="/timer-left.svg"
            alt="特別キャンペーン 終了まで残り"
            className="badgeSvg"
            draggable={false}
          />
        </div>

        {/* 右：タイマー（はみ出しゼロ設計） */}
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

        /* 左SVG */
.countdownBadge {
  flex: 0 0 auto;
  height: 53px;
  width: clamp(140px, 36vw, 150px);
  overflow: hidden;

  /* ベースライン由来の微妙な余白を潰す */
  line-height: 0;
}

.badgeSvg {
  width: 100%;
  height: 100%;
  display: block;

  /* これが本命：上下の余白が出る比率差を“埋める” */
  object-fit: cover;
  object-position: center;
}

        /* 右タイマー */
        .timer {
          flex: 1 1 auto;
          min-width: 0; /* ← これがないと縮まなくてはみ出します */
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

        /* 超小型の最後の保険 */
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
// メインページ（LP画像12枚を復活）
// =====================================================
export default function LandingPage() {
  const images = [
    '1.webp',
    '2.webp',
    '3.webp',
    '4.webp',
    '5.webp',
    '6.webp',
    '7.webp',
    '8.webp',
    '9.webp',
    '10.webp',
    '11.webp',
    '12.webp',
  ];

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center overflow-x-hidden">
      <div className="w-full md:max-w-[45vw] bg-white relative shadow-2xl min-h-screen">
        {/* 固定ヘッダー */}
        <div className="sticky top-0 z-50 w-full shadow-lg">
          <CountdownHeader />
        </div>

        {/* LP本体画像 */}
        <div className="flex flex-col w-full">
          {images.map((imgName, index) => (
            <div key={index} className="w-full">
              <img
                src={`/${imgName}`}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto block align-top"
                loading={index === 0 ? 'eager' : 'lazy'}
                style={{ minHeight: '100px', background: '#fafafa' }}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
