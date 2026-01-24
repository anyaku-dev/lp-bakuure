import React from 'react';

export default function LandingPage() {
  // ==========================================
  // 画像設定エリア
  // ==========================================
  
  // 固定ヘッダーの画像名
  // ※もしヘッダー画像のファイル名が違う場合はここを書き換えてください
  const headerImage = "hover.webp";

  // コンテンツの画像リスト
  // 全て .webp に変更しました
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
        - mx-auto: 中央寄せ
      */}
      <div className="w-full md:max-w-[45vw] bg-white relative shadow-2xl min-h-screen">
        
        {/* 固定ヘッダーエリア */}
        <div className="sticky top-0 z-50 w-full bg-white">
          <img 
            src={`/${headerImage}`}
            alt="Header" 
            className="w-full h-auto block"
            style={{ minHeight: '50px', background: '#f0f0f0' }} 
          />
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