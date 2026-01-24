'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Jost, Zen_Kaku_Gothic_New } from 'next/font/google';

const jost = Jost({
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
});

const zen = Zen_Kaku_Gothic_New({
  subsets: ['latin'],
  weight: ['700'],
  display: 'swap',
});

type TimeLeft = { days: number; hours: number; minutes: number; seconds: number };

const DESIGN_W = 425;
const DESIGN_H = 53;

const BLUE = '#0852FF';
const BG = '#1B2024';
const YELLOW = '#FFF12F';

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

function getTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownHeader() {
  const targetDate = useMemo(() => new Date('2026-02-14T23:59:59'), []);
  const hostRef = useRef<HTMLDivElement | null>(null);

  const [mounted, setMounted] = useState(false);
  const [scale, setScale] = useState(1);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetDate));

  // 1秒ごとのカウントダウン（動かない問題の復旧）
  useEffect(() => {
    setMounted(true);

    const tick = () => setTimeLeft(getTimeLeft(targetDate));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  // セーフエリア + 親幅の「内側幅」から scale を算出して、絶対に切れないようにする
  const recalcScale = () => {
    const el = hostRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const style = window.getComputedStyle(el);

    const pl = Number.parseFloat(style.paddingLeft || '0') || 0;
    const pr = Number.parseFloat(style.paddingRight || '0') || 0;

    // さらに安全マージン（ギリギリ端末で 2〜4px ずれることがあるので確保）
    const SAFETY = 6;

    const innerW = Math.max(0, rect.width - pl - pr - SAFETY);
    const next = Math.min(1, innerW / DESIGN_W);

    setScale(next);
  };

  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;

    recalcScale();

    const el = hostRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => recalcScale());
    ro.observe(el);

    window.addEventListener('resize', recalcScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', recalcScale);
    };
  }, []);

  const scaledH = Math.round(DESIGN_H * scale);

  if (!mounted) {
    return (
      <div
        className="w-full"
        style={{
          height: DESIGN_H,
          background: BG,
          overflow: 'hidden',
        }}
      />
    );
  }

  const d = pad2(timeLeft.days);
  const h = pad2(timeLeft.hours);
  const m = pad2(timeLeft.minutes);
  const s = pad2(timeLeft.seconds);

  return (
    <div
      ref={hostRef}
      className="w-full"
      style={{
        // ✅ セーフエリア対応（ノッチ端末で右が切れるのを防ぐ）
        paddingLeft: 'env(safe-area-inset-left)',
        paddingRight: 'env(safe-area-inset-right)',

        height: scaledH,
        background: BG,
        overflow: 'hidden',
        position: 'relative',
        minWidth: 0,
      }}
    >
      {/* 425×53 の“デザインキャンバス”を scale して再現 */}
      <div
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `scale(${scale})`,
          transformOrigin: 'left top',
          position: 'absolute',
          left: 0,
          top: 0,
          background: BG,
          overflow: 'hidden',
          contain: 'layout paint size',
        }}
      >
        {/* 左の青帯（色・配置：Figma合わせ） */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 136,
            height: 53,
            background: BLUE,
            clipPath: 'polygon(0 0, 92% 0, 100% 100%, 0 100%)',
          }}
        >
          {/* 特別キャンペーン */}
          <div
            className={zen.className}
            style={{
              width: 110.75,
              height: 20,
              left: 18.31,
              top: 2.33,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 13.8,
              fontWeight: 700,
              lineHeight: '16.42px',
              whiteSpace: 'nowrap',
            }}
          >
            特別キャンペーン
          </div>

          {/* 線（「特別キャンペーン」と「終了まで残り」の間） */}
          <div
            style={{
              width: 116.95,
              height: 5,
              left: 13.6,
              top: 21.34,
              position: 'absolute',
              pointerEvents: 'none',
            }}
          >
            {/* 見た目が近くなるように細線＋影線 */}
            <div style={{ width: '100%', height: 1, background: 'rgba(255,255,255,0.9)' }} />
            <div style={{ width: '100%', height: 1, marginTop: 1, background: 'rgba(0,0,0,0.25)' }} />
          </div>

          {/* 終了まで残り */}
          <div
            className={zen.className}
            style={{
              width: 111.95,
              height: 27,
              left: 17.7,
              top: 22.73,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 18.6,
              fontWeight: 700,
              lineHeight: '21.95px',
              whiteSpace: 'nowrap',
            }}
          >
            終了まで残り
          </div>

          {/* 右端の青ブロック */}
          <div
            style={{
              width: 24.27,
              height: 53,
              left: 125,
              top: 0,
              position: 'absolute',
              background: BLUE,
            }}
          />
        </div>

        {/* 右側タイマー（Figmaの絶対座標を忠実に再現） */}
        <NumAbs x={154.88} y={1.5} w={44.63} text={d} />
        <UnitAbs x={201.17} y={24} w={11.32} text="日" />

        <NumAbs x={220.78} y={1.5} w={37.78} text={h} />
        <UnitAbs x={262.86} y={24} w={22.33} text="時間" />

        <NumAbs x={290.86} y={1.5} w={44.25} text={m} />
        <UnitAbs x={336.78} y={24} w={11.32} text="分" />

        {/* ✅ 秒も必ず表示 */}
        <NumAbs x={353.78} y={1.5} w={44.92} text={s} />
        <UnitAbs x={400.36} y={24} w={11.32} text="秒" />
      </div>
    </div>
  );
}

function NumAbs({
  x,
  y,
  w,
  text,
}: {
  x: number;
  y: number;
  w: number;
  text: string;
}) {
  return (
    <div
      className={jost.className}
      style={{
        width: w,
        height: 50,
        left: x,
        top: y,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        // ✅ はみ出し絶対禁止（最後の砦）
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',

        color: YELLOW,
        fontSize: 34.2,
        fontWeight: 500,
        letterSpacing: '0.80px',
        lineHeight: 1,

        // ✅ 桁幅ブレ防止
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum" 1, "lnum" 1',

        transform: 'translateZ(0)',
      }}
    >
      {text}
    </div>
  );
}

function UnitAbs({
  x,
  y,
  w,
  text,
}: {
  x: number;
  y: number;
  w: number;
  text: string;
}) {
  return (
    <div
      className={zen.className}
      style={{
        width: w,
        height: 16,
        left: x,
        top: y,
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',

        // ✅ 単位も切れないように（フォントを正しく読み込む前提でこの幅で収まる）
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        textOverflow: 'clip',

        color: YELLOW,
        fontSize: 11,
        fontWeight: 700,
        lineHeight: 1,

        transform: 'translateZ(0)',
      }}
    >
      {text}
    </div>
  );
}
