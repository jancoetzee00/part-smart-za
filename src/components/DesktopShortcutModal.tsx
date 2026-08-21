import React, { useState, useEffect } from 'react';
import {
  Monitor,
  Download,
  Copy,
  Check,
  X,
  ExternalLink,
  Laptop,
  Smartphone,
  Sparkles,
  Share2,
  Bookmark,
  ShieldCheck,
  Compass,
  Layers,
  ArrowRight,
  Info,
  HelpCircle
} from 'lucide-react';

interface DesktopShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopShortcutModal: React.FC<DesktopShortcutModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [detectedOS, setDetectedOS] = useState<'windows' | 'mac' | 'linux' | 'android' | 'ios' | 'other'>('windows');
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'chrome' | 'edge' | 'safari' | 'firefox'>('chrome');

  // Detect OS and listen for PWA install prompt
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect user agent OS
    const ua = window.navigator.userAgent.toLowerCase();
    if (ua.includes('win')) {
      setDetectedOS('windows');
      setActiveGuideTab('chrome');
    } else if (ua.includes('mac') && !ua.includes('iphone') && !ua.includes('ipad')) {
      setDetectedOS('mac');
      setActiveGuideTab('safari');
    } else if (ua.includes('linux') && !ua.includes('android')) {
      setDetectedOS('linux');
      setActiveGuideTab('chrome');
    } else if (ua.includes('android')) {
      setDetectedOS('android');
      setActiveGuideTab('chrome');
    } else if (ua.includes('iphone') || ua.includes('ipad')) {
      setDetectedOS('ios');
      setActiveGuideTab('safari');
    }

    // Check if already running in standalone mode (PWA installed)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
    if (isStandalone) {
      setIsInstalled(true);
    }

    // Capture PWA install prompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const getTargetUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + window.location.pathname;
    }
    return 'https://partsmart.co.za';
  };

  const currentUrl = getTargetUrl();

  // 1. Download Windows .url Shortcut
  const handleDownloadWindowsShortcut = () => {
    const urlContent = `[InternetShortcut]\r\nURL=${currentUrl}\r\nIconIndex=0\r\nHotKey=0\r\n[{000214A0-0000-0000-C000-000000000046}]\r\nProp3=19,0\r\n`;
    const blob = new Blob([urlContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Part-Smart-ZA.url';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setDownloadSuccess('windows');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // 2. Download Mac .webloc Shortcut
  const handleDownloadMacShortcut = () => {
    const weblocContent = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">\n<plist version="1.0">\n<dict>\n\t<key>URL</key>\n\t<string>${currentUrl}</string>\n</dict>\n</plist>`;
    const blob = new Blob([weblocContent], { type: 'application/xml;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Part-Smart-ZA.webloc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setDownloadSuccess('mac');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // 3. Download Linux .desktop Launcher
  const handleDownloadLinuxShortcut = () => {
    const desktopContent = `[Desktop Entry]\nVersion=1.0\nType=Application\nName=Part-Smart ZA\nGenericName=Heavy Machinery & Truck Parts Marketplace\nComment=Search & advertise CAT, Scania, Mercedes and earthmoving spares in South Africa\nExec=xdg-open "${currentUrl}"\nIcon=applications-internet\nTerminal=false\nCategories=Network;WebBrowser;Commercial;\nStartupNotify=true\n`;
    const blob = new Blob([desktopContent], { type: 'application/x-desktop;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Part-Smart-ZA.desktop';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    setDownloadSuccess('linux');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // 4. Trigger Native PWA App Install
  const handlePwaInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }
    setInstallPrompt(null);
  };

  // 5. Copy Link to Clipboard
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="desktop-shortcut-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
    >
      <div
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8 relative text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Monitor className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white tracking-tight">
                  Desktop & Quick Access Link
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                  1-Click Access
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Place Part-Smart ZA directly onto your Desktop, Taskbar, or Dock for instant 1-click launching.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Native PWA Banner if supported */}
          {installPrompt && !isInstalled && (
            <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-600/20 border border-amber-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <h3 className="font-bold text-amber-300 text-sm">
                    Install Standalone Desktop App (Recommended)
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Launch Part-Smart ZA in its own clean window without browser tabs, address bar, or distractions.
                  </p>
                </div>
              </div>

              <button
                onClick={handlePwaInstall}
                className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Install App Now</span>
              </button>
            </div>
          )}

          {/* Quick Direct Download Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Download className="w-4 h-4 text-amber-400" />
                <span>1-Click Desktop Shortcut Downloaders</span>
              </h3>
              <span className="text-[11px] text-slate-400">
                Detected OS: <span className="text-amber-400 font-bold capitalize">{detectedOS}</span>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Windows Option */}
              <div
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  detectedOS === 'windows'
                    ? 'bg-slate-800/90 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-blue-400" />
                      Windows 10 / 11
                    </span>
                    {detectedOS === 'windows' && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black">
                        YOUR OS
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Downloads a ready-to-use <code className="text-amber-300">Part-Smart-ZA.url</code> desktop shortcut file.
                  </p>
                </div>

                <button
                  onClick={handleDownloadWindowsShortcut}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {downloadSuccess === 'windows' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download for Windows</span>
                    </>
                  )}
                </button>
              </div>

              {/* Mac Option */}
              <div
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  detectedOS === 'mac'
                    ? 'bg-slate-800/90 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-slate-300" />
                      Apple macOS
                    </span>
                    {detectedOS === 'mac' && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black">
                        YOUR OS
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Downloads a native <code className="text-amber-300">.webloc</code> link for your Finder Desktop & Dock.
                  </p>
                </div>

                <button
                  onClick={handleDownloadMacShortcut}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {downloadSuccess === 'mac' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download for Mac</span>
                    </>
                  )}
                </button>
              </div>

              {/* Linux Option */}
              <div
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 ${
                  detectedOS === 'linux'
                    ? 'bg-slate-800/90 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs flex items-center gap-1.5">
                      <Monitor className="w-4 h-4 text-orange-400" />
                      Linux Desktop
                    </span>
                    {detectedOS === 'linux' && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-black">
                        YOUR OS
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                    Downloads a standard <code className="text-amber-300">.desktop</code> app launcher for Ubuntu / Fedora.
                  </p>
                </div>

                <button
                  onClick={handleDownloadLinuxShortcut}
                  className="w-full py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  {downloadSuccess === 'linux' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Downloaded!</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Download for Linux</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Drag to Desktop or Bookmark Bar */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>Drag & Drop Instant Shortcut</span>
              </span>
              <span className="text-[10px] text-slate-500">Fastest method</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={currentUrl}
                title="Drag this button to your Desktop or Bookmarks Bar"
                draggable="true"
                onClick={(e) => e.preventDefault()}
                className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-grab active:cursor-grabbing shadow-md select-none"
              >
                <Monitor className="w-4 h-4" />
                <span>Drag Me To Desktop / Bookmarks</span>
              </a>

              <p className="text-[11px] text-slate-400 text-center sm:text-left leading-relaxed">
                Click and drag the yellow badge directly onto your computer desktop, folder, or browser bookmarks bar.
              </p>
            </div>
          </div>

          {/* Copy Direct Application Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Direct Web Application URL</span>
              <span className="text-[10px] text-slate-500">Share or bookmark</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-300 font-mono focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Browser Native "Add to Desktop / Install" Guides */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-indigo-400" />
              <span>Browser App Pinning & Taskbar Instructions</span>
            </h3>

            {/* Guide Tabs */}
            <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveGuideTab('chrome')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGuideTab === 'chrome'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Google Chrome
              </button>
              <button
                onClick={() => setActiveGuideTab('edge')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGuideTab === 'edge'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Microsoft Edge
              </button>
              <button
                onClick={() => setActiveGuideTab('safari')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGuideTab === 'safari'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Apple Safari (Mac / iOS)
              </button>
              <button
                onClick={() => setActiveGuideTab('firefox')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeGuideTab === 'firefox'
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                Mozilla Firefox
              </button>
            </div>

            {/* Tab Details */}
            <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs space-y-2 leading-relaxed">
              {activeGuideTab === 'chrome' && (
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Click the <strong className="text-white">three dots (⋮)</strong> in the top-right corner of Chrome.</li>
                  <li>Hover over <strong className="text-amber-400">"Cast, save, and share"</strong> or <strong className="text-amber-400">"Save and share"</strong>.</li>
                  <li>Select <strong className="text-emerald-400">"Install Part-Smart ZA"</strong> or <strong className="text-emerald-400">"Create shortcut..."</strong>.</li>
                  <li>Check <strong className="text-white">"Open as window"</strong> and click <strong className="text-amber-400">Create</strong> to place a standalone app shortcut right on your Windows/Mac Desktop!</li>
                </ol>
              )}

              {activeGuideTab === 'edge' && (
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Click the <strong className="text-white">three dots (...)</strong> in the top-right corner of Edge.</li>
                  <li>Select <strong className="text-amber-400">"Apps"</strong> from the dropdown menu.</li>
                  <li>Click <strong className="text-emerald-400">"Install Part-Smart ZA"</strong> or <strong className="text-emerald-400">"Install this site as an app"</strong>.</li>
                  <li>Choose whether to pin it to your <strong className="text-white">Taskbar</strong>, <strong className="text-white">Start Menu</strong>, or <strong className="text-white">Desktop</strong>.</li>
                </ol>
              )}

              {activeGuideTab === 'safari' && (
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li><strong className="text-white">On macOS Sonoma/Sequoia:</strong> Click <strong className="text-amber-400">File</strong> in the top menu bar &rarr; Select <strong className="text-emerald-400">"Add to Dock..."</strong>.</li>
                  <li><strong className="text-white">On iPhone / iPad:</strong> Tap the <strong className="text-amber-400">Share</strong> button (box with arrow pointing up) &rarr; Tap <strong className="text-emerald-400">"Add to Home Screen"</strong>.</li>
                  <li>Part-Smart ZA will launch with its custom icon directly from your Mac Dock or iPhone Home Screen.</li>
                </ol>
              )}

              {activeGuideTab === 'firefox' && (
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
                  <li>Resize your browser window so you can see your computer desktop.</li>
                  <li>Click and hold the <strong className="text-amber-400">padlock icon (🔒)</strong> to the left of the URL in the address bar.</li>
                  <li>Drag the icon directly onto your desktop and release the mouse button.</li>
                  <li>A desktop shortcut will instantly appear on your desktop.</li>
                </ol>
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Safe, virus-free standard OS web link files.</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
