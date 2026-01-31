'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';

const DB_PATH = path.join(process.cwd(), 'data/lps.json');
const SETTINGS_PATH = path.join(process.cwd(), 'data/settings.json');
const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

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

// --- ヘルパー関数 ---

const readJSON = <T>(filePath: string, defaultVal: T): T => {
  if (!fs.existsSync(filePath)) return defaultVal;
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    if (Array.isArray(defaultVal)) {
      return (Array.isArray(parsed) ? parsed : defaultVal) as T;
    } else if (typeof defaultVal === 'object' && defaultVal !== null) {
      return { ...defaultVal, ...parsed };
    }
    return parsed as T;
  } catch (e) {
    return defaultVal;
  }
};

const writeJSON = (filePath: string, data: any) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// --- 全体設定 ---

export async function getGlobalSettings(): Promise<GlobalSettings> {
  return readJSON<GlobalSettings>(SETTINGS_PATH, {
    defaultGtm: '',
    defaultPixel: '',
    defaultHeadCode: '',
    defaultMetaDescription: '',
    defaultFavicon: '',
    defaultOgpImage: '',
  });
}

export async function saveGlobalSettings(settings: GlobalSettings) {
  writeJSON(SETTINGS_PATH, settings);
  revalidatePath('/cms');
  return { success: true };
}

// --- LP管理 ---

export async function getLps() {
  const lps = readJSON<any[]>(DB_PATH, []);
  
  return lps.map(lp => {
    // ヘッダー設定のマイグレーション & 完全補完
    const headerDefaults = {
      type: 'none',
      timerPeriodDays: 3,
      logoSrc: '',
      menuItems: []
    };

    if (!lp.header) {
      // 古いタイマー設定があれば引き継ぎ
      lp.header = {
        ...headerDefaults,
        type: lp.timer?.enabled ? 'timer' : 'none',
        timerPeriodDays: lp.timer?.periodDays ?? 3,
      };
    } else {
      // headerオブジェクトはあるが中身が欠けている場合の補完
      lp.header = {
        ...headerDefaults,
        ...lp.header
      };
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

  // 保存時にデータを整形
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

  writeJSON(DB_PATH, lps);
  revalidatePath('/cms');
  revalidatePath(`/${lp.slug}`);
  return { success: true };
}

export async function deleteLp(id: string) {
  const lps = await getLps();
  const newLps = lps.filter(item => item.id !== id);
  writeJSON(DB_PATH, newLps);
  revalidatePath('/cms');
  return { success: true };
}

export async function uploadImage(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) throw new Error('No file uploaded');

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const fileName = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
  const filePath = path.join(UPLOAD_DIR, fileName);

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  fs.writeFileSync(filePath, buffer);
  return `/uploads/${fileName}`;
}

export async function generateRandomPassword() {
  return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-7);
}