'use client';

import React, { useState, useEffect } from 'react';
import { 
  getLps, saveLp, uploadImage, generateRandomPassword, deleteLp,
  getGlobalSettings, saveGlobalSettings,
  LpData, GlobalSettings
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

// --- 初期値 ---
const EMPTY_LP: LpData = {
  id: '',
  slug: 'new-page',
  title: '新規LPプロジェクト',
  pageTitle: '',
  status: 'draft',
  images: [],
  timer: { enabled: true, periodDays: 3 },
  tracking: { 
    gtm: '', pixel: '', meta: '', useDefault: true 
  },
  createdAt: '',
  updatedAt: '',
};

export default function CmsPage() {
  const [lps, setLps] = useState<LpData[]>([]);
  const [editingLp, setEditingLp] = useState<LpData | null>(null);
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings>({
    defaultGtm: '', defaultPixel: '', defaultHeadCode: '', 
    defaultMetaDescription: '', defaultFavicon: '', defaultOgpImage: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [lpsData, settingsData] = await Promise.all([getLps(), getGlobalSettings()]);
    setLps(lpsData);
    setGlobalSettings(settingsData);
  };

  const handleCreate = async () => {
    const newPass = await generateRandomPassword();
    setEditingLp({ 
      ...EMPTY_LP, 
      id: crypto.randomUUID(),
      password: newPass,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  };

  const handleEdit = (lp: LpData) => {
    setEditingLp(JSON.parse(JSON.stringify(lp)));
  };

  // --- 保存処理 ---
  const handleSaveLp = async () => {
    if (!editingLp) return;
    setLoading(true);
    try {
      await saveLp(editingLp);
      await loadData();
      alert('LP設定を保存しました');
      // エディタを閉じずにそのまま
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
      setEditingLp(null); // 画面を閉じる
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

  // --- LP削除処理 ---
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

  // --- アップロード処理 ---
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
      setGlobalSettings({ ...globalSettings, [key]: src });
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

  // --- リンク・画像操作 ---
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

  // ==========================================
  // VIEW: エディタ画面
  // ==========================================
  if (editingLp) {
    return (
      <div className={styles.container}>
        <div className={styles.editorHeader}>
          <h2 className={styles.pageTitle} style={{margin:0}}>
            編集: {editingLp.title}
          </h2>
          <div className={styles.flexGap}>
             {/* 修正: styles.btn を追加 */}
             <button onClick={() => setEditingLp(null)} className={`${styles.btn} ${styles.btnSecondary}`}>キャンセル</button>
             {/* 修正: styles.btn を追加 */}
             <button onClick={handleSaveAndClose} disabled={loading} className={`${styles.btn} ${styles.btnPrimary}`}>保存</button>
          </div>
        </div>

        <div className={styles.splitLayout}>
          {/* --- 左ペイン --- */}
          <div className={styles.leftPane}>
            <div className={styles.panel}>
              <h3 className={styles.sectionTitle}>基本設定</h3>
              <div className={styles.row}>
                <label className={styles.label}>管理用タイトル</label>
                <input type="text" className={styles.input} value={editingLp.title} 
                  onChange={e => setEditingLp({...editingLp, title: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>公開ページのタイトル</label>
                <input type="text" className={styles.input} value={editingLp.pageTitle || ''} placeholder="ブラウザタブに表示される名前"
                  onChange={e => setEditingLp({...editingLp, pageTitle: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>URLスラッグ</label>
                <input type="text" className={styles.input} value={editingLp.slug} 
                  onChange={e => setEditingLp({...editingLp, slug: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>ステータス</label>
                <select className={styles.select} value={editingLp.status} 
                  onChange={e => setEditingLp({...editingLp, status: e.target.value as any})}>
                  <option value="draft">{STATUS_LABELS.draft}</option>
                  <option value="private">{STATUS_LABELS.private}</option>
                  <option value="public">{STATUS_LABELS.public}</option>
                </select>
              </div>
              <div className={styles.row}>
                <label className={styles.checkboxGroup}>
                  <input type="checkbox" checked={editingLp.timer.enabled} 
                    onChange={e => setEditingLp({...editingLp, timer: {...editingLp.timer, enabled: e.target.checked}})} />
                  タイマーを表示
                </label>
                {editingLp.timer.enabled && (
                  <div className={styles.mt2}>
                    <input type="number" className={styles.input} style={{width:'80px'}} 
                      value={editingLp.timer.periodDays} 
                      onChange={e => setEditingLp({...editingLp, timer: {...editingLp.timer, periodDays: Number(e.target.value)}})} />
                    <span className={styles.subLabel}>日周期</span>
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
                    <input type="text" className={styles.input} value={editingLp.tracking.gtm || ''} 
                      onChange={e => setEditingLp({...editingLp, tracking: {...editingLp.tracking, gtm: e.target.value}})} />
                  </div>
                  <div className={styles.row}>
                    <label className={styles.label}>Meta Pixel ID</label>
                    <input type="text" className={styles.input} value={editingLp.tracking.meta || ''} 
                      onChange={e => setEditingLp({...editingLp, tracking: {...editingLp.tracking, meta: e.target.value}})} />
                  </div>
                </>
              )}

              <div className={styles.row}>
                 <label className={styles.label}>Head内コード (追加)</label>
                 <textarea className={styles.textarea} value={editingLp.customHeadCode || ''}
                   onChange={e => setEditingLp({...editingLp, customHeadCode: e.target.value})} />
              </div>
              <div className={styles.row}>
                 <label className={styles.label}>Meta Description</label>
                 <textarea className={styles.textarea} style={{minHeight:'60px'}} value={editingLp.customMetaDescription || ''}
                   onChange={e => setEditingLp({...editingLp, customMetaDescription: e.target.value})} />
              </div>
              <div className={styles.row}>
                 <label className={styles.label}>Favicon (上書き)</label>
                 <input type="file" className={styles.input} accept="image/*" onChange={e => handleLpOverrideUpload(e, 'customFavicon')} />
                 <p className={styles.textSmall}>推奨: .png, .ico (正方形)</p>
                 {editingLp.customFavicon && <img src={editingLp.customFavicon} alt="icon" style={{width:32, height:32, marginTop:4}} />}
              </div>
              <div className={styles.row}>
                 <label className={styles.label}>OGP Image (上書き)</label>
                 <input type="file" className={styles.input} accept="image/*" onChange={e => handleLpOverrideUpload(e, 'customOgpImage')} />
                 {editingLp.customOgpImage && <img src={editingLp.customOgpImage} alt="ogp" style={{width:100, marginTop:4}} />}
              </div>
            </div>

            {/* 修正: styles.btn を追加 */}
            <button onClick={handleSaveLp} className={`${styles.btn} ${styles.btnSaveSettings}`}>
              設定を保存
            </button>
            {/* 修正: styles.btn を追加 */}
            <button onClick={handleDeleteLp} className={`${styles.btn} ${styles.btnDeleteLp}`}>
              このLPを削除する
            </button>
          </div>

          {/* --- 右ペイン --- */}
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
                      
                      <button onClick={() => deleteImage(idx)} className={`${styles.btnDanger} ${styles.btnSmall}`}>削除</button>
                    </div>
                 </div>

                 <div className={styles.imageEditorSplit}>
                    {/* 左: 画像プレビュー (MAX 30% width) */}
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

                    {/* 右: リンク設定 (Sticky) */}
                    <div className={styles.linkInputArea}>
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
                               <input type="text" className={styles.input} placeholder="URL" value={link.href} 
                                 onChange={e => updateLink(idx, lIdx, 'href', e.target.value)} />
                            </div>
                            <div className={styles.linkRowGrid}>
                               <div><label className={styles.subLabel}>Top %</label><input type="number" className={styles.input} value={link.top} onChange={e => updateLink(idx, lIdx, 'top', Number(e.target.value))} /></div>
                               <div><label className={styles.subLabel}>Left %</label><input type="number" className={styles.input} value={link.left} onChange={e => updateLink(idx, lIdx, 'left', Number(e.target.value))} /></div>
                               <div><label className={styles.subLabel}>W %</label><input type="number" className={styles.input} value={link.width} onChange={e => updateLink(idx, lIdx, 'width', Number(e.target.value))} /></div>
                               <div><label className={styles.subLabel}>H %</label><input type="number" className={styles.input} value={link.height} onChange={e => updateLink(idx, lIdx, 'height', Number(e.target.value))} /></div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>
               </div>
             ))}

             <div className={styles.uploadArea} style={{ position: 'relative' }}>
                <input type="file" accept="image/*" onChange={handleImageUpload} 
                   style={{opacity:0, position:'absolute', inset:0, width:'100%', height:'100%', cursor:'pointer'}} />
                <span className={styles.uploadText}>+ 画像を追加 (ドラッグ&ドロップ可)</span>
             </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: ダッシュボード
  // ==========================================
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>画像LPバクソクアップローダーPRO</h1>
      </div>

      <div className={styles.splitLayout}>
        {/* --- 左ペイン --- */}
        <div className={styles.leftPane}>
           <div className={styles.panel}>
              <h3 className={styles.sectionTitle}>デフォルト設定</h3>
              <p className={styles.subLabel} style={{marginBottom:'16px'}}>各LPのデフォルト値として使用されます。</p>

              <div className={styles.row}>
                <label className={styles.label}>GTM ID</label>
                <input type="text" className={styles.input} placeholder="GTM-XXXXX"
                  value={globalSettings.defaultGtm} onChange={e => setGlobalSettings({...globalSettings, defaultGtm: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>Meta Pixel ID</label>
                <input type="text" className={styles.input} placeholder="Pixel ID"
                  value={globalSettings.defaultPixel} onChange={e => setGlobalSettings({...globalSettings, defaultPixel: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>Head内コード追加</label>
                <textarea className={styles.textarea} placeholder="<script>...</script>"
                  value={globalSettings.defaultHeadCode} onChange={e => setGlobalSettings({...globalSettings, defaultHeadCode: e.target.value})} />
              </div>
              <div className={styles.row}>
                <label className={styles.label}>サイト説明（Meta Description）</label>
                <textarea className={styles.textarea} style={{minHeight:'60px'}}
                  value={globalSettings.defaultMetaDescription} onChange={e => setGlobalSettings({...globalSettings, defaultMetaDescription: e.target.value})} />
              </div>
              
              <div className={styles.row}>
                <label className={styles.label}>ファビコン画像</label>
                <input type="file" className={styles.input} accept="image/*" onChange={e => handleGlobalUpload(e, 'defaultFavicon')} />
                <p className={styles.textSmall}>推奨: .png, .ico (正方形)</p>
                {globalSettings.defaultFavicon && <img src={globalSettings.defaultFavicon} alt="favicon" style={{width:32, height:32, marginTop:8}} />}
              </div>

              <div className={styles.row}>
                <label className={styles.label}>OGP画像</label>
                <input type="file" className={styles.input} accept="image/*" onChange={e => handleGlobalUpload(e, 'defaultOgpImage')} />
                {globalSettings.defaultOgpImage && <img src={globalSettings.defaultOgpImage} alt="ogp" style={{width:'100%', marginTop:8, borderRadius:4, border:'1px solid #eee'}} />}
              </div>

              {/* 修正: styles.btn を追加 */}
              <button onClick={handleSaveGlobal} disabled={loading} className={`${styles.btn} ${styles.btnSecondary}`} style={{width:'100%', marginTop:'8px', fontWeight:700}}>
                 設定を保存
              </button>
           </div>
        </div>

        {/* --- 右ペイン --- */}
        <div className={styles.rightPane}>
           <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px'}}>
              <h3 className={styles.sectionTitle} style={{margin:0, border:0}}>プロジェクト一覧</h3>
              {/* 修正: styles.btn を追加 */}
              <button onClick={handleCreate} className={`${styles.btn} ${styles.btnPrimary}`}>+ 新規LP作成</button>
           </div>

           <div className={styles.lpList}>
             {lps.map(lp => (
               <div key={lp.id} className={styles.lpCard}>
                 <div className={styles.lpCardHeader}>
                   <h2 className={styles.lpTitle}>{lp.title}</h2>
                   {lp.pageTitle && <p className={styles.lpPageTitle}>{lp.pageTitle}</p>}
                   <p className={styles.lpSlug}>/{lp.slug}</p>
                   {/* 修正: statusBadge クラスを正しく適用 */}
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
                   {/* 修正: styles.btn を追加 */}
                   <button onClick={() => handleEdit(lp)} className={`${styles.btn} ${styles.btnPrimary}`} style={{flex:1}}>編集</button>
                   {/* 修正: styles.btn を追加 */}
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