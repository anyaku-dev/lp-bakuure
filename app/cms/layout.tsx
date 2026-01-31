import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '画像LP爆速アップローダーPRO',
  description: 'LPの画像コーディングと、実装を爆速にする『LP専用』CMSツール。LP検証を高速化し、広告パフォーマンスの改善、しいては売り上げアップに貢献します。',
};

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}