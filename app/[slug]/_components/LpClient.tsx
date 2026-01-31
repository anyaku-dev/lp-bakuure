'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Jost, Zen_Kaku_Gothic_New } from 'next/font/google';
import { LpData } from '../../cms/actions';

const jost = Jost({ subsets: ['latin'], weight: ['500'], display: 'swap' });
const zenKaku = Zen_Kaku_Gothic_New({ subsets: ['latin'], weight: ['700'], display: 'swap' });

const ANIMATION_CLASS_VISIBLE = 'opacity-100 translate-y-0';
const ANIMATION_CLASS_HIDDEN = 'opacity-0 translate-y-10';
const ANIMATION_TRANSITION = 'transition-all duration-1000 ease-out';

export function CountdownHeader({ periodDays }: { periodDays: number }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const PERIOD_SEC = periodDays * 24 * 60 * 60;

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
  }, [periodDays]);

  if (!mounted) return <div style={{ height: 53, background: '#1B2024' }} />;

  return (
    <div className={`w-full bg-[#1b2024] overflow-hidden ${zenKaku.className}`}>
      <div className="w-full h-[53px] flex items-stretch bg-[#1b2024] overflow-hidden">
        <div className="flex-none h-[53px] w-[clamp(140px,36vw,150px)] overflow-hidden leading-[0]">
             {/* タイマーアイコン画像は既存のものを使用 */}
            <img src="/lp-001/timer-left.svg" alt="Remain" className="w-full h-full block object-cover object-center" draggable={false} />
        </div>
        <div className="flex-1 min-w-0 h-[53px] flex items-center justify-start gap-[clamp(10px,3vw,18px)] px-[clamp(10px,3vw,16px)] overflow-hidden text-white">
           {/* 時間表示ロジックは簡略化して記述 */}
           <TimerItem num={timeLeft.days} unit="日" />
           <TimerItem num={timeLeft.hours} unit="時間" />
           <TimerItem num={timeLeft.minutes} unit="分" />
           <TimerItem num={timeLeft.seconds} unit="秒" />
        </div>
      </div>
    </div>
  );
}

const TimerItem = ({ num, unit }: { num: number, unit: string }) => (
  <div className="inline-flex items-baseline gap-[clamp(4px,1.2vw,8px)] whitespace-nowrap min-w-0">
     <span className={`text-[#fff12f] font-medium tabular-nums leading-none tracking-[0.8px] text-[clamp(23px,6.5vw,28px)] ${jost.className}`}>
       {String(num).padStart(2, '0')}
     </span>
     <i className="text-[#fff12f] not-italic font-bold leading-none whitespace-nowrap text-[clamp(9px,2.7vw,11px)]">{unit}</i>
  </div>
);

export const FadeInImage = ({ data, index }: { data: any; index: number }) => {
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
      { rootMargin: '0px 0px -10% 0px', threshold: 0 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative w-full ${ANIMATION_TRANSITION} ${isVisible ? ANIMATION_CLASS_VISIBLE : ANIMATION_CLASS_HIDDEN}`}>
      <Image
        src={data.src}
        alt={data.alt}
        width={0} height={0}
        sizes="(max-width: 768px) 100vw, 425px"
        className="w-full h-auto block"
        priority={index < 2}
      />
      {data.links?.map((link: any, i: number) => (
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