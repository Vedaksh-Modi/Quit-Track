import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { usePWAInstall } from '../hooks/usePWAInstall';
import {
  Download,
  Smartphone,
  X,
  Check,
  Share,
  PlusSquare,
  QrCode,
  Copy,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const PWAInstallModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [activeTab, setActiveTab] = useState<'device' | 'qr'>('qr');
  const [installSuccess, setInstallSuccess] = useState(false);
  const [appUrl, setAppUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    // Fetch backend public URL or fallback to window.location
    fetch('/api/app-config')
      .then(res => res.json())
      .then(data => {
        let url = (data && data.appUrl) ? data.appUrl : window.location.href.split('?')[0].split('#')[0];
        if (url.endsWith('/')) url = url.slice(0, -1);
        setAppUrl(url);
        QRCode.toDataURL(url, {
          errorCorrectionLevel: 'H',
          width: 280,
          margin: 2,
          color: { dark: '#064e3b', light: '#ffffff' },
        }).then(setQrDataUrl);
      })
      .catch(() => {
        let fallback = window.location.href.split('?')[0].split('#')[0];
        if (fallback.endsWith('/')) fallback = fallback.slice(0, -1);
        setAppUrl(fallback);
        QRCode.toDataURL(fallback, {
          errorCorrectionLevel: 'H',
          width: 280,
          margin: 2,
          color: { dark: '#064e3b', light: '#ffffff' },
        }).then(setQrDataUrl);
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    const success = await install();
    if (success) {
      setInstallSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1800);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              🌿
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Install on Mobile</h2>
              <span className="text-[11px] text-slate-400">Standalone App & Instant Access</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('qr')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'qr'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>Scan QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab('device')}
            className={`py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'device'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>This Device</span>
          </button>
        </div>

        {/* Content Tab 1: QR Code Scanner for Any Phone */}
        {activeTab === 'qr' && (
          <div className="space-y-3.5 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Point your phone camera at this QR code to load QuitTrack instantly with zero app-store download:
            </p>

            <div className="bg-gradient-to-b from-emerald-50/50 to-teal-50/30 dark:from-slate-800/80 dark:to-slate-800/40 p-4 rounded-3xl border border-emerald-100 dark:border-slate-700/60 flex flex-col items-center justify-center relative">
              {qrDataUrl ? (
                <div className="relative p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200/80">
                  <img
                    src={qrDataUrl}
                    alt="Scan with phone"
                    className="w-48 h-48 block rounded-xl select-none"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 border border-white shadow-sm flex items-center justify-center text-white text-sm">
                      🌿
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                  Generating QR...
                </div>
              )}

              <div className="mt-2.5 flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Works on iOS Camera & Android Google Lens</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
              <span className="truncate flex-1 font-mono text-[10px] text-slate-500 dark:text-slate-400 text-left">
                {appUrl}
              </span>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-sm shrink-0 flex items-center gap-1 font-medium text-[10px]"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Content Tab 2: Install directly on current device */}
        {activeTab === 'device' && (
          <div>
            {isInstalled ? (
              <div className="text-center py-4 space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  QuitTrack is already installed on this device!
                </p>
                <p className="text-[11px] text-slate-400">
                  Launch it directly from your home screen or app drawer.
                </p>
              </div>
            ) : isInstallable ? (
              <div className="space-y-4 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Install QuitTrack on this device for instant 1-tap tracking, 100% offline access, and fast craving relief.
                </p>

                <button
                  onClick={handleInstallClick}
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>{installSuccess ? 'Installed! 🎉' : 'Install to Home Screen'}</span>
                </button>
              </div>
            ) : isIOS ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  To install on this iPhone or iPad:
                </p>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-5 h-5 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                      <Share className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Step 1</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Tap <strong>Share</strong> in Safari toolbar.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <PlusSquare className="w-3 h-3" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white block">Step 2</span>
                      <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                        Tap <strong>Add to Home Screen</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-center">
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  Open your browser menu (tap <strong>⋮</strong> in Chrome/Edge) and select <strong>"Add to Home screen"</strong>.
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs text-left">
                  ✓ Full screen app without browser address bar<br />
                  ✓ 100% offline data storage<br />
                  ✓ Instant 1-second craving assist
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
