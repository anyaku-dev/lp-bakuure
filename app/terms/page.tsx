import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '利用規約｜バク売れLPテンプレ',
  description: 'バク売れLPテンプレの利用規約です。',
};

export default function TermsPage() {
  const wrap: React.CSSProperties = {
    minHeight: '100vh',
    background: '#f3f4f6',
    display: 'flex',
    justifyContent: 'center',
    padding: '24px 16px',
  };

  const card: React.CSSProperties = {
    width: '100%',
    maxWidth: 860,
    background: '#ffffff',
    borderRadius: 16,
    boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
    padding: '28px 20px',
  };

  const h1: React.CSSProperties = { fontSize: 22, fontWeight: 800, margin: 0, color: '#111827' };
  const h2: React.CSSProperties = { fontSize: 16, fontWeight: 800, margin: '18px 0 6px', color: '#111827' };
  const p: React.CSSProperties = { margin: '8px 0 0', color: '#374151', lineHeight: 1.9, fontSize: 14.5 };
  const li: React.CSSProperties = { margin: '6px 0', color: '#374151', lineHeight: 1.9, fontSize: 14.5 };
  const ul: React.CSSProperties = { margin: '8px 0 0', paddingLeft: 18 };

  return (
    <main style={wrap}>
      <article style={card}>
        <h1 style={h1}>利用規約</h1>
        <p style={p}>
          本利用規約（以下「本規約」）は、バク売れLPテンプレ（以下「当サービス」）の利用条件を定めるものです。
          利用者は、本規約に同意のうえ当サービスを利用するものとします。
        </p>

        <h2 style={h2}>1. 提供内容</h2>
        <p style={p}>
          当サービスは、LPデザインテンプレートおよび関連素材（以下「本コンテンツ」）を提供します。
        </p>

        <h2 style={h2}>2. 利用許諾（商用利用・改変）</h2>
        <p style={p}>利用者は、購入・取得した本コンテンツについて、以下を許諾されます。</p>
        <ul style={ul}>
          <li style={li}>商用利用：可</li>
          <li style={li}>改変：可（自由に編集・改変して利用できます）</li>
          <li style={li}>制作物への組み込み：可（LP制作・納品物への組み込みを含みます）</li>
        </ul>

        <h2 style={h2}>3. 禁止事項（再配布等）</h2>
        <p style={p}>利用者は、以下の行為を行ってはなりません。</p>
        <ul style={ul}>
          <li style={li}>本コンテンツの全部または一部を、素材集・テンプレ集として再配布、販売、譲渡、貸与する行為</li>
          <li style={li}>本コンテンツを主目的として第三者がダウンロードできる状態にする行為（例：素材単体の配布）</li>
          <li style={li}>当サービス・当サイトの運営を妨害する行為</li>
          <li style={li}>法令または公序良俗に反する用途での利用</li>
        </ul>

        <h2 style={h2}>4. 素材の出所について</h2>
        <p style={p}>
          本コンテンツに含まれる一部素材は、配布サイト等にて商用利用・再利用可能として公開されている素材を使用しています。
          利用者は、各素材の利用条件が付随する場合があることを理解し、必要に応じて出典やライセンス条件を確認するものとします。
        </p>

        <h2 style={h2}>5. 免責事項</h2>
        <ul style={ul}>
          <li style={li}>当サービスは、成果や売上向上等を保証するものではありません。</li>
          <li style={li}>本コンテンツの利用により生じた損害について、当方は一切の責任を負いません（ただし法令で免責できない場合を除く）。</li>
          <li style={li}>外部サービス・ツール（決済、解析、広告等）の障害・停止等により生じた不利益について、当方は責任を負いません。</li>
        </ul>

        <h2 style={h2}>6. 変更・提供停止</h2>
        <p style={p}>
          当方は、事前告知なく当サービスの内容変更、提供停止、終了を行うことがあります。
        </p>

        <h2 style={h2}>7. 規約の変更</h2>
        <p style={p}>
          当方は必要に応じて本規約を変更できます。変更後の規約は当サイト上での掲示をもって効力を生じます。
        </p>

        <h2 style={h2}>8. 準拠法・裁判管轄</h2>
        <p style={p}>
          本規約は日本法に準拠し、本サービスに関連して紛争が生じた場合は、当方所在地を管轄する裁判所を第一審の専属的合意管轄とします。
        </p>
      </article>
    </main>
  );
}
