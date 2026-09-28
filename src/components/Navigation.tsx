import React from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  Home,
  Flame,
  Zap,
  BarChart3,
  User,
  ShieldAlert,
  Bot,
  Users,
  Sun,
  Moon,
  PiggyBank,
  Smartphone,
  Trophy,
  QrCode,
} from 'lucide-react';

export const Navigation: React.FC<{
  onOpenAICoach: () => void;
  onOpenInstall: () => void;
  onOpenQRCode: () => void;
}> = ({ onOpenAICoach, onOpenInstall, onOpenQRCode }) => {
  const { activeTab, setActiveTab, setEmergencyActive, stats, profile, updateProfile, rewardPoints } = useQuitTrack();

  const toggleTheme = () => {
    updateProfile({
      theme: profile.theme === 'dark' ? 'light' : 'dark',
    });
  };

  return (
    <>
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
              🌿
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                QuitTrack
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* QR Scan to Install Button */}
            <button
              onClick={onOpenQRCode}
              aria-label="Scan QR to Install on Mobile"
              title="Scan QR to Install on Phone"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Scan QR</span>
            </button>

            {/* Install on Mobile Button */}
            <button
              onClick={onOpenInstall}
              aria-label="Install on Mobile"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Install</span>
            </button>

            {/* Smoke-Free Rewards Button */}
            <button
              onClick={() => setActiveTab('rewards')}
              aria-label="Open Smoke-Free Rewards"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'rewards'
                  ? 'bg-amber-100 dark:bg-amber-950/60 border-amber-400 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">Rewards</span>
            </button>

            {/* AI Coach Button */}
            <button
              onClick={onOpenAICoach}
              aria-label="Open AI Quit Coach"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold transition-all"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden xs:inline">Coach</span>
            </button>

            {/* Community Feed Button */}
            <button
              onClick={() => setActiveTab('community')}
              aria-label="Open Community Feed"
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-sky-50 dark:bg-sky-950/40 border-sky-300 dark:border-sky-800 text-sky-700 dark:text-sky-300'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Community</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark/Light Mode"
              className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {profile.theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Emergency SOS Button */}
            <button
              onClick={() => setEmergencyActive(true)}
              aria-label="Open Emergency Craving Screen"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 animate-pulse"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>
          </div>
        </div>
      </header>

      {/* Bottom Mobile-First Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'home'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Home</span>
          </button>

          {/* Track */}
          <button
            onClick={() => setActiveTab('track')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'track'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Flame className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Track</span>
          </button>

          {/* Craving (Center Prominent) */}
          <button
            onClick={() => setActiveTab('craving')}
            className="flex flex-col items-center justify-center flex-1 -mt-4 group"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-active:scale-95 ${
              activeTab === 'craving'
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950/60'
                : 'bg-emerald-700 hover:bg-emerald-600 text-white'
            }`}>
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <span className={`text-[10px] mt-1 font-semibold ${
              activeTab === 'craving'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-600 dark:text-slate-400'
            }`}>
              Craving
            </span>
          </button>

          {/* Insights */}
          <button
            onClick={() => setActiveTab('insights')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'insights'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Insights</span>
          </button>

          {/* Profile */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
              activeTab === 'profile'
                ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <User className="w-5 h-5 mb-0.5" />
            <span className="text-[10px]">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};
