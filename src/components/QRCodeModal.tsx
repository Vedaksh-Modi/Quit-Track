import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  X,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Share2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const QRCodeModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [appUrl, setAppUrl] = useState<string>('');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Fetch or resolve the accurate public App URL
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setLoading(true);
    setErrorMsg(null);

    const resolveUrl = async () => {
      try {
        // Try fetching backend public URL first
        const res = await fetch('/api/app-config');
        if (res.ok) {
          const data = await res.json();
          if (data.appUrl && typeof data.appUrl === 'string' && data.appUrl.startsWith('http')) {
            if (isMounted) {
              setAppUrl(data.appUrl);
              return data.appUrl;
            }
          }
        }
      } catch {
        // Fallback to window.location
      }

      // Fallback to current browser location
      let fallback = window.location.href.split('?')[0].split('#')[0];
      if (fallback.endsWith('/')) {
        fallback = fallback.slice(0, -1);
      }
      if (isMounted) {
        setAppUrl(fallback);
      }
      return fallback;
    };

    resolveUrl().then(targetUrl => {
      if (!isMounted || !targetUrl) return;
      generateQr(targetUrl);
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const generateQr = async (url: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);
      // High error correction level ('H') ensures error-free scanning even in varying lighting or camera angles
      const dataUrl = await QRCode.toDataURL(url, {
        errorCorrectionLevel: 'H',
        width: 320,
        margin: 2,
        color: {
          dark: '#064e3b', // Deep emerald dark module
          light: '#ffffff', // Crisp white background
        },
      });
      setQrDataUrl(dataUrl);
      setLoading(false);
    } catch (err: any) {
      console.error('Failed to generate QR code', err);
      setErrorMsg('Could not render QR code. Please copy link instead.');
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(appUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = appUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Scan to Install</h2>
              <span className="text-[11px] text-slate-400">Open QuitTrack on any mobile phone</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* QR Code Graphic Box */}
        <div className="bg-gradient-to-b from-emerald-50/50 to-teal-50/20 dark:from-slate-800/60 dark:to-slate-800/30 p-4 rounded-3xl border border-emerald-100 dark:border-slate-700/60 flex flex-col items-center justify-center relative">
          {loading ? (
            <div className="w-56 h-56 flex flex-col items-center justify-center gap-2 text-slate-400">
              <RefreshCw className="w-7 h-7 animate-spin text-emerald-600" />
              <span className="text-xs">Generating QR Code...</span>
            </div>
          ) : errorMsg ? (
            <div className="w-56 h-56 flex flex-col items-center justify-center text-center p-4 text-rose-500 text-xs">
              <span>{errorMsg}</span>
            </div>
          ) : (
            <div className="relative group">
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200/80">
                <img
                  src={qrDataUrl}
                  alt="Scan to open QuitTrack"
                  className="w-52 h-52 sm:w-56 sm:h-56 block rounded-xl select-none"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-emerald-600 border-2 border-white shadow-md flex items-center justify-center text-white text-base font-bold">
                  🌿
                </div>
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Zero-Install Hassle • Scans on iOS & Android</span>
          </div>
        </div>

        {/* How to Scan Instructions */}
        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              1
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-snug">
              Open your phone's <strong>Camera app</strong> (iPhone) or <strong>Google Lens</strong> (Android).
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              2
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-snug">
              Point it at the QR code and tap the pop-up link to load QuitTrack.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
            <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
              3
            </span>
            <p className="text-slate-600 dark:text-slate-300 leading-snug">
              Tap <strong>"Install App"</strong> or Safari's <strong>"Add to Home Screen"</strong> for full-screen mode!
            </p>
          </div>
        </div>

        {/* URL Box & One-Tap Actions */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300">
            <span className="truncate flex-1 font-mono text-[11px] select-all">
              {appUrl || 'Loading URL...'}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 shadow-sm shrink-0 flex items-center gap-1 font-medium transition-colors"
              title="Copy URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="text-[11px]">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={appUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Link</span>
            </a>
            <button
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
