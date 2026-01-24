import React from 'react';

export default function LandingPage() {
  // 画像ファイル名の配列（1.png から 12.png まで）
  // 順番を変更したい場合はこの配列の並びを変えてください
  const images = Array.from({ length: 12 }, (_, i) => `${i + 1}.png`);

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center">
      {/* メインコンテナ
        - w-full: スマホで横幅100%
        - md:max-w-[45vw]: PC（タブレット以上）で画面幅の45%を最大幅に設定
        - bg-white: コンテンツ背景色
        - shadow-2xl: 左右に空間がある際に見やすくするための影
      */}
      <div className="w-full md:max-w-[45vw] bg-white relative shadow-2xl">
        
        {/* 固定ヘッダーエリア (hover.png)
          - sticky: スクロールしても親要素(45%幅)の中で上部に張り付く
          - top-0: 画面の一番上に固定
          - z-50: 他の画像より手前に表示
        */}
        <div className="sticky top-0 z-50 w-full">
          {/* 画像読み込みエラーを防ぐため標準のimgタグを使用 */}
          <img 
            src="/hover.png" 
            alt="Header" 
            className="w-full h-auto block" 
          />
        </div>

        {/* メインコンテンツエリア (1.png 〜 12.png)
          - flex-col: 縦並び
        */}
        <div className="flex flex-col w-full">
          {images.map((imgName, index) => (
            <div key={index} className="w-full">
              <img
                src={`/${imgName}`}
                alt={`Content ${index + 1}`}
                className="w-full h-auto block align-top" // align-topで画像間の隙間を排除
                loading="lazy" // 2枚目以降は遅延読み込みでパフォーマンス確保
              />
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}