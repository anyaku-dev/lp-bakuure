'use server';

import { revalidatePath } from 'next/cache';
import { Redis } from '@upstash/redis';
import { put, list } from '@vercel/blob';

// --- DB設定 (Upstash Redis) ---
const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const KEY_LPS = 'lps_data';
const KEY_SETTINGS = 'global_settings';

// --- 型定義 ---

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

export type FooterCtaConfig = {
  enabled: boolean;
  imageSrc: string;
  href: string;
  widthPercent: number;
  bottomMargin: number;
  showAfterPx: number;       
  hideBeforeBottomPx: number; 
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
  footerCta: FooterCtaConfig;
  tracking: TrackingConfig;
  customHeadCode?: string;
  customMetaDescription?: string;
  customFavicon?: string;
  customOgpImage?: string;
  customCss?: string;
  createdAt: string;
  updatedAt: string;
};

// --- 全体設定 ---

export async function getGlobalSettings(): Promise<GlobalSettings> {
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

// --- LP管理 ---

export async function getLps() {
  const lps = await redis.get<any[]>(KEY_LPS) || [];
  
  return lps.map(lp => {
    const headerDefaults: HeaderConfig = {
      type: 'none',
      timerPeriodDays: 3,
      logoSrc: '',
      menuItems: []
    };
    
    const footerDefaults: FooterCtaConfig = {
      enabled: false,
      imageSrc: '',
      href: '',
      widthPercent: 90,
      bottomMargin: 20,
      showAfterPx: 0,
      hideBeforeBottomPx: 0
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

    if (!lp.footerCta) {
      lp.footerCta = { ...footerDefaults };
    } else {
      lp.footerCta = { ...footerDefaults, ...lp.footerCta };
    }

    if (!lp.pageTitle) lp.pageTitle = '';
    
    return lp as LpData;
  });
}

export async function saveLp(lp: LpData) {
  const lps = await getLps();
  const index = lps.findIndex((item) => item.id === lp.id);
  
  const slugExists = lps.some(item => item.slug === lp.slug && item.id !== lp.id);
  if (slugExists) {
    throw new Error('このスラッグは既に使用されています。');
  }

  const now = new Date().toISOString();

  const safeLp = {
    ...lp,
    header: {
      type: lp.header?.type || 'none',
      timerPeriodDays: lp.header?.timerPeriodDays ?? 3,
      logoSrc: lp.header?.logoSrc || '',
      menuItems: lp.header?.menuItems || []
    },
    footerCta: {
      enabled: lp.footerCta?.enabled ?? false,
      imageSrc: lp.footerCta?.imageSrc || '',
      href: lp.footerCta?.href || '',
      widthPercent: lp.footerCta?.widthPercent ?? 90,
      bottomMargin: lp.footerCta?.bottomMargin ?? 20,
      showAfterPx: lp.footerCta?.showAfterPx ?? 0,
      hideBeforeBottomPx: lp.footerCta?.hideBeforeBottomPx ?? 0
    },
    customCss: lp.customCss || ''
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

// ★追加: 複製機能
export async function duplicateLp(sourceId: string) {
  const lps = await getLps();
  const sourceLp = lps.find(item => item.id === sourceId);
  if (!sourceLp) throw new Error('コピー元のLPが見つかりません');

  // データのディープコピー（参照を切るため）
  const newLp = JSON.parse(JSON.stringify(sourceLp)) as LpData;

  // タイトル決定ロジック
  const baseTitle = `${sourceLp.title}のコピー`;
  let newTitle = baseTitle;
  let count = 1;

  // 同名のタイトルが存在するかチェックし、あれば番号を振る
  while (lps.some(item => item.title === newTitle)) {
    newTitle = `${baseTitle}${count}`;
    count++;
  }

  const now = new Date().toISOString();

  // 新しいプロパティの設定
  newLp.id = crypto.randomUUID();
  newLp.title = newTitle;
  // スラッグは一意である必要があるため、タイムスタンプを付与
  newLp.slug = `${sourceLp.slug}-copy-${Date.now().toString(36)}`;
  newLp.status = 'draft'; // 下書きにする
  newLp.createdAt = now;
  newLp.updatedAt = now;
  // パスワードも再生成
  newLp.password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-7);

  // リストに追加して保存
  lps.push(newLp);
  await redis.set(KEY_LPS, lps);
  revalidatePath('/cms');
  return { success: true };
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file uploaded');

  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return blob.url;
}

export async function generateRandomPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-7);
}

//アップロード済み画像リストの取得
export async function getBlobList() {
  const { blobs } = await list({ limit: 100 }); // 最新100件を取得
  return blobs.map(b => b.url);
}