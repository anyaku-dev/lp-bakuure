'use client';

import React, { useState, useEffect } from 'react';
import { 
  getLps, saveLp, uploadImage, generateRandomPassword, deleteLp, duplicateLp, getBlobList, // ★追加: getBlobList
  getGlobalSettings, saveGlobalSettings,
  LpData, GlobalSettings, MenuItem, HeaderConfig, FooterCtaConfig
} from './actions';
import styles from './cms.module.css';

// --- フォーマット関数 ---
const formatDate = (isoString?: string) => {
  if (!isoString) return '-';
  const d = new Date(isoString);
  return d.toLocaleString('ja-JP', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
};

const STATUS_LABELS = {
  draft: '下書き',
  public: '公開',
  private: '限定公開'
};

// --- 初期値と正規化関数 ---

const EMPTY_HEADER: HeaderConfig = {
  type: 'none',
  timerPeriodDays: 3,
  logoSrc: '',
  menuItems: []
};

const EMPTY_FOOTER_CTA: FooterCtaConfig = {
  enabled: false,
  imageSrc: '',
  href: '',
  widthPercent: 90,
  bottomMargin: 20,
  showAfterPx: 0,
  hideBeforeBottomPx: 0
};

const EMPTY_LP: LpData = {
  id: '',
  slug: '',
  title: '新規LPプロジェクト',
  pageTitle: '',
  status: 'draft',
  images: [],
  header: { ...EMPTY_HEADER },
  footerCta: { ...EMPTY_FOOTER_CTA },
  tracking: { gtm: '', pixel: '', meta: '', useDefault: true },
  customCss: '',
  createdAt: '',
  updatedAt: '',
};

const EMPTY_GLOBAL: GlobalSettings = {
  defaultGtm: '',
  defaultPixel: '',
  defaultHeadCode: '',
  defaultMetaDescription: '',
  defaultFavicon: '',
  defaultOgpImage: ''
};

// LPデータの正規化
const normalizeLp = (lp: Partial<LpData>): LpData => {
  return {
    ...EMPTY_LP,
    ...lp,
    header: {
      ...EMPTY_HEADER,
      ...(lp.header || {}),
      menuItems: lp.header?.menuItems || [], 
      timerPeriodDays: lp.header?.timerPeriodDays ?? 3,
    },
    footerCta: {
      ...EMPTY_FOOTER_CTA,
      ...(lp.footerCta || {}),
      widthPercent: lp.footerCta?.widthPercent ?? 90,
      bottomMargin: lp.footerCta?.bottomMargin ?? 20,
      showAfterPx: lp.footerCta?.showAfterPx ?? 0,
      hideBeforeBottomPx: lp.footerCta?.hideBeforeBottomPx ?? 0,
    },
    tracking: {
      gtm: '', pixel: '', meta: '', useDefault: true,
      ...(lp.tracking || {})
    },
    images: lp.images || [],
    pageTitle: lp.pageTitle ?? '',
    customHeadCode: lp.customHeadCode ?? '',
    customMetaDescription: lp.customMetaDescription ?? '',
    customFavicon: lp.customFavicon ?? '',
    customOgpImage: lp.customOgpImage ?? '',
    customCss: lp.customCss ?? '',
  };
};

const normalizeGlobal = (g: Partial<GlobalSettings>): GlobalSettings => {
  return {
    defaultGtm: g.defaultGtm ?? '',
    defaultPixel: g.defaultPixel ?? '',
    defaultHeadCode: g.defaultHeadCode ?? '',
    defaultMetaDescription: g.defaultMetaDescription ?? '',
    defaultFavicon: g.defaultFavicon ?? '',
    defaultOgpImage: g.defaultOgpImage ?? '',
  };
};

// --- ローディングコンポーネント ---
const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  if (!isVisible) return null;
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.spinner}></div>
      <span className={styles.loadingText}>Processing...</span>
    </div>
  );
};

// ★追加: 画像ライブラリモーダル
const ImageLibrary = ({ 
  isOpen, 
  onClose, 
  onSelect 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSelect: (url: string) => void;
}) => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // モーダルが開いた時にリストを取得
  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      getBlobList()
        .then(setImages)
        .catch(err => alert('読み込みエラー:' + err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.libraryContainer} onClick={onClose}>
      <div className={styles.libraryContent} onClick={e => e.stopPropagation()}>
        <div className={styles.libraryHeader}>
          <h3 style={{margin:0}}>画像ライブラリ (最新100件)</h3>
          <button onClick={onClose} className={styles.btnCloseLibrary}>閉じる</button>
        </div>
        <div className={styles.libraryBody}>
          {loading ? (
            <p style={{textAlign:'center', color:'#888'}}>読み込み中...</p>
          ) : (
            <div className={styles.imageGrid}>
              {images.map((url, i) => (
                <div key={i} className={styles.gridItem} onClick={() => { onSelect(url); onClose(); }}>
                  <img src={url} loading="lazy" alt="uploaded" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function CmsPage() {
  const [lps, setLps] = useState<LpData[]>([]);
  const [editingLp, setEditingLp] = useState<LpData | null>(null);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>(EMPTY_GLOBAL);
  const [loading, setLoading] = useState(false);

  // ★追加: ライブラリ用のState
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [onLibrarySelect, setOnLibrarySelect] = useState<((url: string) => void) | null>(null);

  // ★追加: ライブラリを開くヘルパー関数
  const openLibrary = (callback: (url: string) => void) => {
    setOnLibrarySelect(() => callback);
    setIsLibraryOpen(true);
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [lpsData, settingsData] = await Promise.all([getLps(), getGlobalSettings()]);
    setLps(lpsData.map(normalizeLp));
    setGlobalSettings(normalizeGlobal(settingsData));
  };

  const handleCreate = async () => {
    const newPass = await generateRandomPassword();
    const newLp = normalizeLp({
      id: crypto.randomUUID(),
      slug: `new-${Date.now()}`,
      password: newPass,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    setEditingLp(newLp);
  };

  const handleEdit = (lp: LpData) => {
    setEditingLp(normalizeLp(JSON.parse(JSON.stringify(lp))));
  };

  // 複製ボタンのハンドラ
  const handleDuplicate = async (id: string) => {
    if (!confirm('このプロジェクトを複製しますか？')) return;
    setLoading(true);
    try {
      await duplicateLp(id);
      await loadData();
      alert('プロジェクトを複製しました');
    } catch (e: any) {
      alert('エラー: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLp = async () => {
    if (!editingLp) return;
    setLoading(true);
    try {
      await saveLp(editingLp);
      await loadData();
      alert('LP設定を保存しました');
    } catch (e: any) {
      alert('エラー: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAndClose = async () => {
    if (!editingLp) return;
    setLoading(true);
    try {
      await saveLp(editingLp);
      await loadData();
      alert('LPを保存しました');
      setEditingLp(null);
    } catch (e: any) {
      alert('エラー: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGlobal = async () => {
    setLoading(true);
    try {
      await saveGlobalSettings(globalSettings);
      alert('全体設定を保存しました');
    } catch (e: any) {
      alert('エラー: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLp = async () => {
    if (!editingLp) return;
    if (!confirm('本当にこのLPを削除しますか？この操作は取り消せません。')) return;
    setLoading(true);
    try {
      await deleteLp(editingLp.id);
      await loadData();
      alert('LPを削除しました');
      setEditingLp(null);
    } catch (e: any) {
      alert('エラー: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return await uploadImage(formData);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !editingLp) return;
    setLoading(true);
    try {
      const src = await handleUpload(e.target.files[0]);
      setEditingLp({
        ...editingLp,
        images: [...editingLp.images, { src, alt: 'LP Image' }]
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageReplace = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!e.target.files?.[0] || !editingLp) return;
    setLoading(true);
    try {
      const src = await handleUpload(e.target.files[0]);
      const newImages = [...editingLp.images];
      newImages[index] = { ...newImages[index], src };
      setEditingLp({ ...editingLp, images: newImages });
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof GlobalSettings) => {
    if (!e.target.files?.[0]) return;
    setLoading(true);
    try {
      const src = await handleUpload(e.target.files[0]);
      setGlobalSettings(prev => ({ ...prev, [key]: src }));
    } finally {
      setLoading(false);
    }
  };

  const handleLpOverrideUpload = async (e: React.ChangeEvent<HTMLInputElement>, key: keyof LpData) => {
    if (!e.target.files?.[0] || !editingLp) return;
    setLoading(true);
    try {
      const src = await handleUpload(e.target.files[0]);
      setEditingLp({ ...editingLp, [key]: src });
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !editingLp) return;
    setLoading(true);
    try {
      const src = await handleUpload(e.target.files[0]);
      setEditingLp({
        ...editingLp,
        header: { ...editingLp.header, logoSrc: src }
      });
    } finally {
      setLoading(false);
    }
  };

  // --- フッターCTA画像アップロード ---
  const handleFooterCtaImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0] || !editingLp) return;
    setLoading(true);
    try {
      const src = await handleUpload(e.target.files[0]);
      setEditingLp({
        ...editingLp,
        footerCta: { ...editingLp.footerCta, imageSrc: src }
      });
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = () => {
    if (!editingLp) return;
    const newItems = [...(editingLp.header.menuItems || []), { label: '', href: '' }];
    setEditingLp({ ...editingLp, header: { ...editingLp.header, menuItems: newItems } });
  };

  const updateMenuItem = (index: number, key: keyof MenuItem, val: string) => {
    if (!editingLp) return;
    const newItems = [...(editingLp.header.menuItems || [])];
    newItems[index] = { ...newItems[index], [key]: val };
    setEditingLp({ ...editingLp, header: { ...editingLp.header, menuItems: newItems } });
  };

  const removeMenuItem = (index: number) => {
    if (!editingLp) return;
    const newItems = editingLp.header.menuItems.filter((_, i) => i !== index);
    setEditingLp({ ...editingLp, header: { ...editingLp.header, menuItems: newItems } });
  };

  const moveMenuItem = (index: number, direction: -1 | 1) => {
    if (!editingLp) return;
    const newItems = [...editingLp.header.menuItems];
    const target = index + direction;
    if (target < 0 || target >= newItems.length) return;
    [newItems[index], newItems[target]] = [newItems[target], newItems[index]];
    setEditingLp({ ...editingLp, header: { ...editingLp.header, menuItems: newItems } });
  };

  const updateImageId = (imgIndex: number, id: string) => {
    if (!editingLp) return;
    const newImages = [...editingLp.images];
    newImages[imgIndex].customId = id;
    setEditingLp({ ...editingLp, images: newImages });
  };

  const addLink = (imgIndex: number) => {
    if (!editingLp) return;
    const newImages = [...editingLp.images];
    if (!newImages[imgIndex].links) newImages[imgIndex].links = [];
    newImages[imgIndex].links!.push({
      left: 10, top: 10, width: 80, height: 10, href: '#', ariaLabel: 'リンク'
    });
    setEditingLp({ ...editingLp, images: newImages });
  };

  const updateLink = (imgIndex: number, linkIndex: number, key: string, val: any) => {
    if (!editingLp) return;
    const newImages = [...editingLp.images];
    // @ts-ignore
    newImages[imgIndex].links![linkIndex][key] = val;
    setEditingLp({ ...editingLp, images: newImages });
  };

  const removeLink = (imgIndex: number, linkIndex: number) => {
    if (!editingLp) return;
    const newImages = [...editingLp.images];
    newImages[imgIndex].links = newImages[imgIndex].links!.filter((_, i) => i !== linkIndex);
    setEditingLp({ ...editingLp, images: newImages });
  };

  const moveImage = (index: number, direction: -1 | 1) => {
    if (!editingLp) return;
    const newImages = [...editingLp.images];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newImages.length) return;
    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    setEditingLp({ ...editingLp, images: newImages });
  };

  const deleteImage = (index: number) => {
    if (!editingLp || !confirm('この画像を削除しますか？')) return;
    const newImages = editingLp.images.filter((_, i) => i !== index);
    setEditingLp({ ...editingLp, images: newImages });
  };

  const loadingOverlay = <LoadingOverlay isVisible={loading} />;
  // ★追加: モーダル要素
  const libraryModal = <ImageLibrary isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} onSelect={(url) => onLibrarySelect?.(url)} />;

  if (editingLp) {
    const h = editingLp.header;
    const f = editingLp.footerCta;

    return (
      <div className={styles.container}>
        {loadingOverlay}
        {libraryModal}
        <div className={styles.editorHeader}>
          <h2 className={styles.pageTitle} style={{margin:0}}>
            編集: {editingLp.title}
          </h2>
          <div className={styles.flexGap}>
             <button onClick={() => setEditingLp(null)} className={`${styles.btn} ${styles.btnSecondary}`}>キャンセル</button>
             <button onClick={handleSaveAndClose} disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`}>保存</button>
          </div>
        </div>

        <div className={styles.splitLayout}>
          <div className={styles.leftPane}>
            <div className={styles.panel}>
              <h3 className={styles.sectionTitle}>基本設定</h3>
              
              <div className={styles.row}>
                <label className={styles.label}>管理用タイトル</label>
                <input type="text" className={styles.input} value={editingLp.title ?? ''} 
                  onChange={e => setEditingLp({...editingLp, title: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>公開ページのタイトル</label>
                <input type="text" className={styles.input} value={editingLp.pageTitle ?? ''} placeholder="ブラウザタブに表示される名前"
                  onChange={e => setEditingLp({...editingLp, pageTitle: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>URLスラッグ</label>
                <input type="text" className={styles.input} value={editingLp.slug ?? ''} 
                  onChange={e => setEditingLp({...editingLp, slug: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>ステータス</label>
                <select className={styles.select} value={editingLp.status ?? 'draft'} 
                  onChange={e => setEditingLp({...editingLp, status: e.target.value as any})}>
                  <option value="draft">{STATUS_LABELS.draft}</option>
                  <option value="private">{STATUS_LABELS.private}</option>
                  <option value="public">{STATUS_LABELS.public}</option>
                </select>
              </div>

              {editingLp.status === 'private' && (
                <div className={styles.row}>
                  <label className={styles.label}>閲覧パスワード</label>
                  <input 
                    type="text" 
                    className={styles.input} 
                    value={editingLp.password ?? ''} 
                    placeholder="パスワードを入力"
                    onChange={e => setEditingLp({...editingLp, password: e.target.value})} 
                  />
                  <p className={styles.subLabel} style={{marginTop:4}}>※このパスワードを知っている人だけが閲覧できます</p>
                </div>
              )}
              
              <div className={styles.row} style={{borderTop:'1px dashed #e5e5e5', paddingTop:'20px'}}>
                <label className={styles.label}>ヘッダー表示設定</label>
                <select className={styles.select} value={h.type ?? 'none'}
                  onChange={e => {
                    setEditingLp({
                      ...editingLp,
                      header: { ...h, type: e.target.value as any }
                    });
                  }}>
                  <option value="timer">カウントダウンタイマー</option>
                  <option value="menu">左ロゴ + ハンバーガーメニュー</option>
                  <option value="none">表示なし</option>
                </select>
              </div>

              {h.type === 'timer' && (
                <div className={styles.row}>
                  <label className={styles.label}>タイマー周期 (日)</label>
                  <input type="number" className={styles.input} style={{width:'80px'}} 
                    value={h.timerPeriodDays ?? 3} 
                    onChange={e => {
                      const val = parseInt(e.target.value, 10);
                      setEditingLp({
                        ...editingLp,
                        header: { ...h, timerPeriodDays: isNaN(val) ? 0 : val }
                      });
                    }} />
                </div>
              )}

              {h.type === 'menu' && (
                <div style={{background:'#f9f9f9', padding:'16px', borderRadius:'8px', marginBottom:'24px'}}>
                  <div className={styles.row}>
                    <label className={styles.label}>ロゴ画像</label>
                    {/* ★追加: ファイル選択とライブラリボタンの横並び */}
                    <div style={{display:'flex', gap:8}}>
                      <input key={h.logoSrc || 'logo'} type="file" className={styles.input} accept="image/*" onChange={handleHeaderLogoUpload} style={{flex:1}} />
                      <button onClick={() => openLibrary(url => setEditingLp(prev => prev ? {...prev, header: {...prev.header, logoSrc: url}} : null))} className={`${styles.btnSmall} ${styles.btnSecondary}`}>ライブラリ</button>
                    </div>
                    {h.logoSrc && <img src={h.logoSrc} alt="logo" style={{height:40, marginTop:8}} />}
                  </div>
                  
                  <label className={styles.label}>ドロワーメニュー項目</label>
                  {h.menuItems.map((item, idx) => (
                    <div key={idx} className={styles.menuItemRow}>
                      <div style={{flex:1}}>
                        <input type="text" placeholder="表示名" className={styles.input} style={{marginBottom:4}}
                          value={item.label ?? ''} onChange={e => updateMenuItem(idx, 'label', e.target.value)} />
                        <input type="text" placeholder="リンクURL" className={styles.input}
                          value={item.href ?? ''} onChange={e => updateMenuItem(idx, 'href', e.target.value)} />
                      </div>
                      <div style={{display:'flex', flexDirection:'column', gap:4}}>
                        <button onClick={() => moveMenuItem(idx, -1)} disabled={idx===0} className={styles.btnSmall}>↑</button>
                        <button onClick={() => moveMenuItem(idx, 1)} disabled={idx===h.menuItems.length-1} className={styles.btnSmall}>↓</button>
                        <button onClick={() => removeMenuItem(idx)} className={`${styles.btnSmall} ${styles.btnDanger}`}>×</button>
                      </div>
                    </div>
                  ))}
                  <button onClick={addMenuItem} className={`${styles.btnSmall} ${styles.btnSecondary}`} style={{width:'100%', marginTop:8}}>
                    + メニュー項目を追加
                  </button>
                </div>
              )}

              {/* 固定フッターCTA設定 */}
              <div className={styles.row} style={{borderTop:'1px dashed #e5e5e5', paddingTop:'20px'}}>
                <label className={styles.checkboxGroup} style={{marginBottom:'16px', fontSize:'15px'}}>
                   <input type="checkbox" checked={f.enabled} 
                     onChange={e => setEditingLp({...editingLp, footerCta: {...f, enabled: e.target.checked}})} />
                   固定フッターCTAを表示する
                </label>

                {f.enabled && (
                  <div style={{background:'#f9f9f9', padding:'16px', borderRadius:'8px', marginBottom:'24px'}}>
                     <div className={styles.row}>
                        <label className={styles.label}>ボタン画像</label>
                        {/* ★追加: ファイル選択とライブラリボタンの横並び */}
                        <div style={{display:'flex', gap:8}}>
                           <input key={f.imageSrc || 'cta'} type="file" className={styles.input} accept="image/*" onChange={handleFooterCtaImageUpload} style={{flex:1}} />
                           <button onClick={() => openLibrary(url => setEditingLp(prev => prev ? {...prev, footerCta: {...prev.footerCta, imageSrc: url}} : null))} className={`${styles.btnSmall} ${styles.btnSecondary}`}>ライブラリ</button>
                        </div>
                        {f.imageSrc && <img src={f.imageSrc} alt="cta" style={{width:'100%', maxWidth:'200px', marginTop:8}} />}
                     </div>
                     <div className={styles.row}>
                        <label className={styles.label}>飛び先URL</label>
                        <input type="text" className={styles.input} placeholder="https://..."
                          value={f.href ?? ''} onChange={e => setEditingLp({...editingLp, footerCta: {...f, href: e.target.value}})} />
                     </div>
                     <div className={styles.grid2} style={{marginBottom:'16px'}}>
                        <div>
                          <label className={styles.label}>横幅 (%)</label>
                          <input type="number" className={styles.input} 
                            value={f.widthPercent ?? 90} onChange={e => setEditingLp({...editingLp, footerCta: {...f, widthPercent: Number(e.target.value)}})} />
                        </div>
                        <div>
                          <label className={styles.label}>下マージン (px)</label>
                          <input type="number" className={styles.input} 
                            value={f.bottomMargin ?? 20} onChange={e => setEditingLp({...editingLp, footerCta: {...f, bottomMargin: Number(e.target.value)}})} />
                        </div>
                     </div>
                     <div className={styles.grid2}>
                        <div>
                          <label className={styles.label}>出現位置 (px)</label>
                          <p className={styles.subLabel}>スクロール量。0で最初から表示</p>
                          <input type="number" className={styles.input} 
                            value={f.showAfterPx ?? 0} onChange={e => setEditingLp({...editingLp, footerCta: {...f, showAfterPx: Number(e.target.value)}})} />
                        </div>
                        <div>
                          <label className={styles.label}>非表示位置 (px)</label>
                          <p className={styles.subLabel}>最下部からの距離。0で最後まで表示</p>
                          <input type="number" className={styles.input} 
                            value={f.hideBeforeBottomPx ?? 0} onChange={e => setEditingLp({...editingLp, footerCta: {...f, hideBeforeBottomPx: Number(e.target.value)}})} />
                        </div>
                     </div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.panel}>
              <h3 className={styles.sectionTitle}>メタデータ・タグ設定</h3>
              <div className={styles.row}>
                 <label className={styles.checkboxGroup}>
                    <input type="checkbox" checked={editingLp.tracking.useDefault} 
                      onChange={e => setEditingLp({...editingLp, tracking: {...editingLp.tracking, useDefault: e.target.checked}})} />
                    デフォルト設定を使用
                 </label>
              </div>
              {!editingLp.tracking.useDefault && (
                <>
                  <div className={styles.row}>
                    <label className={styles.label}>GTM ID</label>
                    <input type="text" className={styles.input} value={editingLp.tracking.gtm ?? ''} 
                      onChange={e => setEditingLp({...editingLp, tracking: {...editingLp.tracking, gtm: e.target.value}})} />
                  </div>
                  <div className={styles.row}>
                    <label className={styles.label}>Meta Pixel ID</label>
                    <input type="text" className={styles.input} value={editingLp.tracking.meta ?? ''} 
                      onChange={e => setEditingLp({...editingLp, tracking: {...editingLp.tracking, meta: e.target.value}})} />
                  </div>
                </>
              )}
              <div className={styles.row}>
                 <label className={styles.label}>Head内コード (追加)</label>
                 <textarea className={styles.textarea} value={editingLp.customHeadCode ?? ''}
                   onChange={e => setEditingLp({...editingLp, customHeadCode: e.target.value})} />
              </div>
              <div className={styles.row}>
                 <label className={styles.label}>Meta Description</label>
                 <textarea className={styles.textarea} style={{minHeight:'60px'}} value={editingLp.customMetaDescription ?? ''}
                   onChange={e => setEditingLp({...editingLp, customMetaDescription: e.target.value})} />
              </div>
              
              <div className={styles.row}>
                 <label className={styles.label}>カスタムCSS</label>
                 <p className={styles.subLabel} style={{marginBottom:'8px'}}>このページのみに適用されるCSS（&lt;style&gt;タグは不要）</p>
                 <textarea className={styles.textarea} style={{minHeight:'120px', fontFamily:'monospace', fontSize:'13px', background:'#2b2b2b', color:'#f8f8f2'}} 
                   value={editingLp.customCss ?? ''}
                   placeholder=".my-class { color: red; }"
                   onChange={e => setEditingLp({...editingLp, customCss: e.target.value})} />
              </div>

              <div className={styles.row}>
                 <label className={styles.label}>Favicon (上書き)</label>
                 {/* ★追加: ファイル選択とライブラリボタンの横並び */}
                 <div style={{display:'flex', gap:8}}>
                   <input key={editingLp.customFavicon || 'fav'} type="file" className={styles.input} accept="image/*" onChange={e => handleLpOverrideUpload(e, 'customFavicon')} style={{flex:1}} />
                   <button onClick={() => openLibrary(url => setEditingLp(prev => prev ? {...prev, customFavicon: url} : null))} className={`${styles.btnSmall} ${styles.btnSecondary}`}>ライブラリ</button>
                 </div>
                 <p className={styles.textSmall}>推奨: .png, .ico (正方形)</p>
                 {editingLp.customFavicon && <img src={editingLp.customFavicon} alt="icon" style={{width:32, height:32, marginTop:4}} />}
              </div>
              <div className={styles.row}>
                 <label className={styles.label}>OGP Image (上書き)</label>
                 {/* ★追加: ファイル選択とライブラリボタンの横並び */}
                 <div style={{display:'flex', gap:8}}>
                   <input key={editingLp.customOgpImage || 'ogp'} type="file" className={styles.input} accept="image/*" onChange={e => handleLpOverrideUpload(e, 'customOgpImage')} style={{flex:1}} />
                   <button onClick={() => openLibrary(url => setEditingLp(prev => prev ? {...prev, customOgpImage: url} : null))} className={`${styles.btnSmall} ${styles.btnSecondary}`}>ライブラリ</button>
                 </div>
                 {editingLp.customOgpImage && <img src={editingLp.customOgpImage} alt="ogp" style={{width:100, marginTop:4}} />}
              </div>
            </div>

            <button onClick={handleSaveLp} className={`${styles.btn} ${styles.btnSaveSettings}`}>
              設定を保存
            </button>

            <button onClick={handleDeleteLp} className={`${styles.btn} ${styles.btnDeleteLp}`}>
              このLPを削除する
            </button>
          </div>

          <div className={styles.rightPane}>
             <h3 className={styles.sectionTitle}>LP構成 / 画像・リンク設定</h3>
             
             {editingLp.images.map((img, idx) => (
               <div key={idx} className={styles.imageItem}>
                 <div className={styles.imageHeader}>
                    <span className={styles.imageIndex}>IMG #{idx + 1}</span>
                    <div className={styles.flexGap}>
                      <span className={styles.subLabel}>順番変更</span>
                      <button onClick={() => moveImage(idx, -1)} disabled={idx === 0} className={`${styles.btnSmall} ${styles.btnSecondary}`}>↑</button>
                      <button onClick={() => moveImage(idx, 1)} disabled={idx === editingLp.images.length - 1} className={`${styles.btnSmall} ${styles.btnSecondary}`}>↓</button>
                      <div style={{width:'1px', height:'16px', background:'#ddd', margin:'0 8px'}}></div>
                      <label className={`${styles.btnSecondary} ${styles.btnSmall}`} style={{cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center'}}>
                        画像入れ替え
                        <input type="file" accept="image/*" style={{display:'none'}} onChange={(e) => handleImageReplace(e, idx)} />
                      </label>
                      {/* ★追加: 画像入れ替え用ライブラリボタン */}
                      <button onClick={() => openLibrary(url => { const newImgs = [...editingLp.images]; newImgs[idx] = {...newImgs[idx], src: url}; setEditingLp({...editingLp, images: newImgs}); })} className={`${styles.btnSecondary} ${styles.btnSmall}`}>ライブラリ</button>
                      <button onClick={() => deleteImage(idx)} className={`${styles.btnDanger} ${styles.btnSmall}`}>削除</button>
                    </div>
                 </div>

                 <div className={styles.imageEditorSplit}>
                    <div className={styles.imagePreviewArea}>
                       <div className={styles.previewContainer} style={{ width: '100%' }}>
                          <img src={img.src} alt="preview" style={{width:'100%', display:'block'}} />
                          {img.links?.map((link, lIdx) => (
                            <div key={lIdx} className={styles.linkOverlay}
                              style={{ left: `${link.left}%`, top: `${link.top}%`, width: `${link.width}%`, height: `${link.height}%` }}
                              title={link.href}>
                              {lIdx + 1}
                            </div>
                          ))}
                       </div>
                    </div>

                    <div className={styles.linkInputArea}>
                       <div style={{marginBottom:'24px', paddingBottom:'16px', borderBottom:'1px dashed #eee'}}>
                          <label className={styles.label}>ID設定 (任意)</label>
                          <p className={styles.subLabel} style={{margin:'0 0 8px 0'}}>画像全体を囲むタグにIDを付与します</p>
                          <input type="text" className={styles.input} placeholder="例: section-1" 
                            value={img.customId ?? ''} onChange={e => updateImageId(idx, e.target.value)} />
                       </div>

                       <div style={{display:'flex', justifyContent:'space-between', marginBottom:'12px'}}>
                          <label className={styles.label}>リンク設定 ({img.links?.length || 0})</label>
                          <button onClick={() => addLink(idx)} className={`${styles.btnSecondary} ${styles.btnSmall}`}>+ 追加</button>
                       </div>
                       
                       {img.links?.length === 0 && <p className={styles.subLabel}>リンクが設定されていません</p>}

                       {img.links?.map((link, lIdx) => (
                         <div key={lIdx} className={styles.linkRow}>
                            <div className={styles.linkRowHeader}>
                               <span>LINK #{lIdx + 1}</span>
                               <button onClick={() => removeLink(idx, lIdx)} className="text-red-500" style={{fontSize:10}}>削除</button>
                            </div>
                            <div className={styles.row} style={{marginBottom:'8px'}}>
                               <input type="text" className={styles.input} placeholder="URL" value={link.href ?? ''} 
                                 onChange={e => updateLink(idx, lIdx, 'href', e.target.value)} />
                            </div>
                            <div className={styles.linkRowGrid}>
                               <div><label className={styles.subLabel}>Top %</label><input type="number" className={styles.input} value={link.top ?? 0} onChange={e => updateLink(idx, lIdx, 'top', Number(e.target.value))} /></div>
                               <div><label className={styles.subLabel}>Left %</label><input type="number" className={styles.input} value={link.left ?? 0} onChange={e => updateLink(idx, lIdx, 'left', Number(e.target.value))} /></div>
                               <div><label className={styles.subLabel}>W %</label><input type="number" className={styles.input} value={link.width ?? 0} onChange={e => updateLink(idx, lIdx, 'width', Number(e.target.value))} /></div>
                               <div><label className={styles.subLabel}>H %</label><input type="number" className={styles.input} value={link.height ?? 0} onChange={e => updateLink(idx, lIdx, 'height', Number(e.target.value))} /></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
             ))}

             <div className={styles.uploadArea} style={{ position: 'relative', display:'flex', gap:10, alignItems:'center', justifyContent:'center', minHeight:100 }}>
                {/* ★追加: ドラッグ&ドロップエリアとライブラリボタンの共存 */}
                <div style={{position:'absolute', inset:0, zIndex:0}}>
                    <input key={editingLp.images.length} type="file" accept="image/*" onChange={handleImageUpload} style={{opacity:0, width:'100%', height:'100%', cursor:'pointer'}} />
                </div>
                <span className={styles.uploadText} style={{pointerEvents:'none'}}>+ 新規アップロード</span>
                <div style={{zIndex:1, pointerEvents:'auto'}}>
                   <button onClick={(e) => { e.stopPropagation(); openLibrary(url => setEditingLp(prev => prev ? {...prev, images: [...prev.images, {src: url, alt: 'LP Image'}]} : null)); }} className={styles.btnSecondary} style={{padding:'8px 16px', background:'white'}}>
                      ライブラリから追加
                   </button>
                </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // --- ダッシュボード ---
  return (
    <div className={styles.container}>
      {loadingOverlay}
      {libraryModal}
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>画像LP爆速アップローダーPRO</h1>
      </div>

      <div className={styles.splitLayout}>
        <div className={styles.leftPane}>
           <div className={styles.panel}>
              <h3 className={styles.sectionTitle}>デフォルト設定</h3>
              <p className={styles.subLabel} style={{marginBottom:'16px'}}>各LPのデフォルト値として使用されます。</p>

              <div className={styles.row}>
                <label className={styles.label}>GTM ID</label>
                <input type="text" className={styles.input} placeholder="GTM-XXXXX"
                  value={globalSettings.defaultGtm ?? ''} onChange={e => setGlobalSettings({...globalSettings, defaultGtm: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>Meta Pixel ID</label>
                <input type="text" className={styles.input} placeholder="Pixel ID"
                  value={globalSettings.defaultPixel ?? ''} onChange={e => setGlobalSettings({...globalSettings, defaultPixel: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>Head内コード追加</label>
                <textarea className={styles.textarea} placeholder="<script>...</script>"
                  value={globalSettings.defaultHeadCode ?? ''} onChange={e => setGlobalSettings({...globalSettings, defaultHeadCode: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>サイト説明（Meta Description）</label>
                <textarea className={styles.textarea} style={{minHeight:'60px'}}
                  value={globalSettings.defaultMetaDescription ?? ''} onChange={e => setGlobalSettings({...globalSettings, defaultMetaDescription: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>ファビコン画像</label>
                {/* ★追加: ファイル選択とライブラリボタンの横並び */}
                <div style={{display:'flex', gap:8}}>
                  <input key={globalSettings.defaultFavicon || 'fav-g'} type="file" className={styles.input} accept="image/*" onChange={e => handleGlobalUpload(e, 'defaultFavicon')} style={{flex:1}} />
                  <button onClick={() => openLibrary(url => setGlobalSettings(prev => ({...prev, defaultFavicon: url})))} className={`${styles.btnSmall} ${styles.btnSecondary}`}>ライブラリ</button>
                </div>
                <p className={styles.textSmall}>推奨: .png, .ico (正方形)</p>
                {globalSettings.defaultFavicon && <img src={globalSettings.defaultFavicon} alt="favicon" style={{width:32, height:32, marginTop:8}} />}
              </div>
              <div className={styles.row}>
                <label className={styles.label}>OGP画像</label>
                {/* ★追加: ファイル選択とライブラリボタンの横並び */}
                <div style={{display:'flex', gap:8}}>
                  <input key={globalSettings.defaultOgpImage || 'ogp-g'} type="file" className={styles.input} accept="image/*" onChange={e => handleGlobalUpload(e, 'defaultOgpImage')} style={{flex:1}} />
                  <button onClick={() => openLibrary(url => setGlobalSettings(prev => ({...prev, defaultOgpImage: url})))} className={`${styles.btnSmall} ${styles.btnSecondary}`}>ライブラリ</button>
                </div>
                {globalSettings.defaultOgpImage && <img src={globalSettings.defaultOgpImage} alt="ogp" style={{width:'100%', marginTop:8, borderRadius:4, border:'1px solid #eee'}} />}
              </div>

              <button onClick={handleSaveGlobal} disabled={loading} className={`${styles.btn} ${styles.btnSecondary}`} style={{width:'100%', marginTop:'8px', fontWeight:700}}>
                 設定を保存
              </button>
           </div>
        </div>

        <div className={styles.rightPane}>
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
              <h3 className={styles.sectionTitle} style={{margin:0, border:0}}>プロジェクト一覧</h3>
              <button onClick={handleCreate} className={`${styles.btn} ${styles.btnPrimary}`}>+ 新規LP作成</button>
           </div>

           <div className={styles.lpList}>
             {lps.map(lp => (
               <div key={lp.id} className={styles.lpCard}>
                 <div className={styles.lpCardHeader}>
                   <h2 className={styles.lpTitle}>{lp.title}</h2>
                   {lp.pageTitle && <p className={styles.lpPageTitle}>{lp.pageTitle}</p>}
                   <p className={styles.lpSlug}>/{lp.slug}</p>
                   <span className={`${styles.statusBadge} ${
                     lp.status === 'public' ? styles.statusPublic :
                     lp.status === 'private' ? styles.statusPrivate : styles.statusDraft
                   }`}>
                     {STATUS_LABELS[lp.status]}
                   </span>
                 </div>
                 
                 <div className={styles.lpDates}>
                    <span>作成:</span><span>{formatDate(lp.createdAt)}</span>
                    <span>更新:</span><span>{formatDate(lp.updatedAt)}</span>
                 </div>

                 <div className={styles.flexGap} style={{marginTop:'16px'}}>
                   <button onClick={() => handleEdit(lp)} className={`${styles.btn} ${styles.btnPrimary}`} style={{flex:1}}>編集</button>
                   <button onClick={() => handleDuplicate(lp.id)} className={`${styles.btn} ${styles.btnSecondary}`} style={{flex:1}}>複製</button>
                   <a href={`/${lp.slug}`} target="_blank" rel="noreferrer" className={`${styles.btn} ${styles.btnSecondary}`} style={{flex:1, textAlign:'center'}}>プレビュー</a>
                 </div>
               </div>
             ))}

             {lps.length === 0 && (
               <p style={{color:'#888', gridColumn:'1/-1', textAlign:'center', padding:'40px'}}>
                 プロジェクトがありません
               </p>
             )}
           </div>
        </div>
      </div>
    </div>
  );
}