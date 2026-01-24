import React, { useState, useEffect } from 'react';

// ==========================================
// カウントダウンヘッダーコンポーネント
// ※プレビュー環境での動作を保証するため、同一ファイル内に定義しています。
// ==========================================
function CountdownHeader() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // ターゲット日時: 2026年2月14日 23:59:59
    const targetDate = new Date('2026-02-14T23:59:59');

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return <div className="w-full bg-gray-200 aspect-[5/1]" />;

  return (
    <div className="relative w-full">
      {/* 背景画像: ローカルファイルを参照 */}
      <img 
        src="/hover.webp" 
        alt="Countdown Header" 
        className="w-full h-auto block"
      />

      {/* カウントダウン表示エリア */}
      <div className="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)] pt-[1%]">
        
        {/* 数字部分: 間隔(space-x)を少し調整して見やすくしています */}
        <div className="flex items-baseline space-x-2 md:space-x-4 lg:space-x-5 leading-none tracking-tight font-sans">
          
          {/* 日 */}
          <div className="flex items-baseline">
            <span className="text-3xl md:text-5xl lg:text-6xl font-black">{timeLeft.days}</span>
            <span className="text-[10px] md:text-sm lg:text-base font-bold ml-[2px]">日</span>
          </div>

          {/* 時間 */}
          <div className="flex items-baseline">
            <span className="text-3xl md:text-5xl lg:text-6xl font-black">
              {String(timeLeft.hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-sm lg:text-base font-bold ml-[2px]">時間</span>
          </div>

          {/* 分 */}
          <div className="flex items-baseline">
            <span className="text-3xl md:text-5xl lg:text-6xl font-black">
              {String(timeLeft.minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-sm lg:text-base font-bold ml-[2px]">分</span>
          </div>

          {/* 秒 */}
          <div className="flex items-baseline">
            <span className="text-3xl md:text-5xl lg:text-6xl font-black text-yellow-300">
              {String(timeLeft.seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] md:text-sm lg:text-base font-bold ml-[2px] text-yellow-300">秒</span>
          </div>

        </div>
      </div>
    </div>
  );
}

// ==========================================
// メインページコンポーネント
// ==========================================
export default function LandingPage() {
  // コンテンツの画像リスト
  const images = [
    "1.webp",
    "2.webp",
    "3.webp",
    "4.webp",
    "5.webp",
    "6.webp",
    "7.webp",
    "8.webp",
    "9.webp",
    "10.webp",
    "11.webp",
    "12.webp"
  ];

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center overflow-x-hidden">
      {/* メインコンテナ
        - w-full: スマホで横幅100%
        - md:max-w-[45vw]: PCで画面幅の45%（45vw）に制限
      */}
      <div className="w-full md:max-w-[45vw] bg-white relative shadow-2xl min-h-screen">
        
        {/* 固定ヘッダーエリア */}
        <div className="sticky top-0 z-50 w-full bg-white shadow-lg">
          {/* ここでカウントダウン機能を表示 */}
          <CountdownHeader />
        </div>

        {/* コンテンツエリア */}
        <div className="flex flex-col w-full">
          {images.map((imgName, index) => (
            <div key={index} className="w-full">
              <img
                src={`/${imgName}`}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto block align-top"
                loading={index === 0 ? "eager" : "lazy"}
                style={{ minHeight: '100px', background: '#fafafa' }} 
              />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}