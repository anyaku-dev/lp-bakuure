import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '爆速画像LPコーディングPRO',
  description: 'LPの画像コーディングと、実装を爆速にする『LP専用』CMSツール。LP検証を高速化し、広告パフォーマンスの改善、売り上げアップに貢献。',
};

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}