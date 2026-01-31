'use server';

import { revalidatePath } from 'next/cache';
import { Redis } from '@upstash/redis';
import { put } from '@vercel/blob';

// --- DB設定 (Upstash Redis) ---
// 環境変数を自動検知して接続します
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY_LPS = 'lps_data';
const KEY_SETTINGS = 'global_settings';

// --- 型定義 (変更なし) ---

export type LinkArea = {
  left: number;
  top: number;
  width: number;
  height: number;
  href: string;
  ariaLabel: string;
};

export type ImageData = {
  src: string;
  alt: string;
  customId?: string;
  links?: LinkArea[];
};

export type MenuItem = {
  label: string;
  href: string;
};

export type HeaderConfig = {
  type: 'timer' | 'menu' | 'none';
  timerPeriodDays: number;
  logoSrc?: string;
  menuItems: MenuItem[];
};

export type TrackingConfig = {
  gtm?: string;
  meta?: string;
  pixel?: string;
  useDefault: boolean;
};

export type GlobalSettings = {
  defaultGtm: string;
  defaultPixel: string;
  defaultHeadCode: string;
  defaultMetaDescription: string;
  defaultFavicon: string;
  defaultOgpImage: string;
};

export type LpData = {
  id: string;
  slug: string;
  title: string;      
  pageTitle?: string; 
  status: 'draft' | 'public' | 'private';
  password?: string;
  images: ImageData[];
  header: HeaderConfig;
  tracking: TrackingConfig;
  customHeadCode?: string;
  customMetaDescription?: string;
  customFavicon?: string;
  customOgpImage?: string;
  createdAt: string;
  updatedAt: string;
};

// --- 全体設定 (Redis) ---

export async function getGlobalSettings(): Promise<GlobalSettings> {
  // Redisから取得。なければnullが返るのでデフォルト値を適用
  const settings = await redis.get<GlobalSettings>(KEY_SETTINGS);
  
  return {
    defaultGtm: '',
    defaultPixel: '',
    defaultHeadCode: '',
    defaultMetaDescription: '',
    defaultFavicon: '',
    defaultOgpImage: '',
    ...(settings || {})
  };
}

export async function saveGlobalSettings(settings: GlobalSettings) {
  await redis.set(KEY_SETTINGS, settings);
  revalidatePath('/cms');
  return { success: true };
}

// --- LP管理 (Redis) ---

export async function getLps() {
  // Redisからデータを取得
  const lps = await redis.get<any[]>(KEY_LPS) || [];
  
  // データの正規化処理（古いデータ構造対策）
  return lps.map(lp => {
    const headerDefaults: HeaderConfig = {
      type: 'none',
      timerPeriodDays: 3,
      logoSrc: '',
      menuItems: []
    };

    if (!lp.header) {
      lp.header = {
        ...headerDefaults,
        type: lp.timer?.enabled ? 'timer' : 'none',
        timerPeriodDays: lp.timer?.periodDays ?? 3,
      };
    } else {
      lp.header = { ...headerDefaults, ...lp.header };
    }

    if (!lp.pageTitle) lp.pageTitle = '';
    
    return lp as LpData;
  });
}

export async function saveLp(lp: LpData) {
  // 最新のリストを取得
  const lps = await getLps();
  const index = lps.findIndex((item) => item.id === lp.id);
  
  // スラッグ重複チェック（自分自身は除外）
  const slugExists = lps.some(item => item.slug === lp.slug && item.id !== lp.id);
  if (slugExists) {
    throw new Error('このスラッグは既に使用されています。');
  }

  const now = new Date().toISOString();

  // 保存データの整形
  const safeLp = {
    ...lp,
    header: {
      type: lp.header?.type || 'none',
      timerPeriodDays: lp.header?.timerPeriodDays ?? 3,
      logoSrc: lp.header?.logoSrc || '',
      menuItems: lp.header?.menuItems || []
    }
  };

  if (index >= 0) {
    lps[index] = { 
      ...safeLp, 
      createdAt: lps[index].createdAt || now,
      updatedAt: now 
    };
  } else {
    lps.push({ 
      ...safeLp, 
      createdAt: now, 
      updatedAt: now 
    });
  }

  // Redisに保存
  await redis.set(KEY_LPS, lps);
  
  revalidatePath('/cms');
  revalidatePath(`/${lp.slug}`);
  return { success: true };
}

export async function deleteLp(id: string) {
  const lps = await getLps();
  const newLps = lps.filter(item => item.id !== id);
  await redis.set(KEY_LPS, newLps);
  revalidatePath('/cms');
  return { success: true };
}

// 画像アップロード (Vercel Blob)
export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file uploaded');

  // Vercel Blobへアップロード (publicアクセス)
  const blob = await put(file.name, file, {
    access: 'public',
  });

  // BlobのURL (https://...) を返す
  return blob.url;
}

export async function generateRandomPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-7);
}