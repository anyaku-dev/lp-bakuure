import React from 'react';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getLps, getGlobalSettings, LpData, TrackingConfig } from './cms/actions';
import PasswordProtect from './[slug]/_components/PasswordProtect';
import { CountdownHeader, MenuHeader, FadeInImage, FixedFooterCta, PcBackground, SideImages } from './[slug]/_components/LpClient';
import { Metadata } from 'next';

async function getHomepageLp() {
  const [lps, globalSettings] = await Promise.all([getLps(), getGlobalSettings()]);
  
  if (!globalSettings.homepageLpId) {
    return { lp: null, globalSettings };
  }

  const lp = lps.find(item => item.id === globalSettings.homepageLpId);
  return { lp: lp || null, globalSettings };
}

export async function generateMetadata(): Promise<Metadata> {
  const { lp, globalSettings } = await getHomepageLp();

  if (!lp) {
    return { title: 'bakuure LP' };
  }

  const title = lp.pageTitle || lp.title;
  const description = lp.customMetaDescription || globalSettings.defaultMetaDescription || '';

  const rawFavicon = lp.customFavicon || globalSettings.defaultFavicon;
  let faviconUrl = '/favicon.ico';
  if (rawFavicon) {
    const separator = rawFavicon.includes('?') ? '&' : '?';
    faviconUrl = `${rawFavicon}${separator}v=${Date.now()}`;
  }

  const ogpImage = lp.customOgpImage || globalSettings.defaultOgpImage;

  return {
    title,
    description,
    icons: {
      icon: faviconUrl,
      shortcut: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title,
      description,
      images: ogpImage ? [ogpImage] : [],
    },
  };
}

export default async function HomePage() {
  const { lp, globalSettings } = await getHomepageLp();

  if (!lp) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center text-gray-400">
          <p>ルートドメインに表示するLPが設定されていません。</p>
          <p className="text-sm mt-2">CMSの全体設定から「ルートドメインLP」を設定してください。</p>
        </div>
      </main>
    );
  }

  const content = <LpContent lp={lp} globalSettings={globalSettings} />;

  if (lp.status === 'private' && lp.password) {
    return <PasswordProtect validPassword={lp.password}>{content}</PasswordProtect>;
  }

  return content;
}

function LpContent({ lp, globalSettings }: { lp: LpData; globalSettings: any }) {
  const tracking: TrackingConfig = lp.tracking.useDefault
    ? {
        gtm: globalSettings.defaultGtm,
        pixel: globalSettings.defaultPixel,
        meta: '',
        useDefault: true,
      }
    : lp.tracking;

  const headCode = lp.customHeadCode || globalSettings.defaultHeadCode || '';
  const bgImage = lp.pcBackgroundImage || globalSettings.pcBackgroundImage || '';
  const pcMaxWidth = globalSettings.pcMaxWidth || 480;

  return (
    <>
      {lp.customCss && (
        <style dangerouslySetInnerHTML={{ __html: lp.customCss }} />
      )}

      {headCode && (
        <div dangerouslySetInnerHTML={{ __html: headCode }} style={{ display: 'none' }} />
      )}

      {tracking.gtm && (
        <Script id="gtm-script" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${tracking.gtm}');`}
        </Script>
      )}
      {tracking.gtm && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${tracking.gtm}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}

      {tracking.pixel && (
        <Script id="fb-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${tracking.pixel}');
            fbq('track', 'PageView');
          `}
        </Script>
      )}

      <PcBackground src={bgImage} />
      <SideImages config={lp.sideImages} pcMaxWidth={pcMaxWidth} />

      <main className="min-h-screen bg-white">
        {lp.header?.type === 'timer' && (
          <>
            <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none">
              <div className="w-full md:max-w-[425px] pointer-events-auto shadow-lg">
                <CountdownHeader periodDays={lp.header.timerPeriodDays} />
              </div>
            </div>
            <div className="w-full md:max-w-[425px] mx-auto h-[53px]" />
          </>
        )}

        {lp.header?.type === 'menu' && (
          <>
            <div className="fixed top-0 left-0 w-full z-[999] flex justify-center pointer-events-none">
              <div className="w-full md:max-w-[425px] pointer-events-auto shadow-sm relative">
                <MenuHeader logoSrc={lp.header.logoSrc} items={lp.header.menuItems} />
              </div>
            </div>
            <div className="w-full md:max-w-[425px] mx-auto h-[60px]" />
          </>
        )}

        <div className="md:max-w-[425px] w-full mx-auto bg-white relative">
          {lp.images.map((img, index) => (
            <section key={index} className="w-full">
              <FadeInImage data={img} index={index} />
            </section>
          ))}
        </div>

        {lp.footerCta?.enabled && <FixedFooterCta config={lp.footerCta} />}
      </main>
    </>
  );
}
