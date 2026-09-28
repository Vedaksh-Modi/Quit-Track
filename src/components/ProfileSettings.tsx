import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  User,
  Settings,
  Bell,
  Lock,
  Download,
  Upload,
  Trash2,
  Crown,
  Sparkles,
  Phone,
  Moon,
  Volume2,
  ShieldCheck,
  Target,
  Check,
  Plus,
  QrCode,
  Smartphone,
} from 'lucide-react';

export const ProfileSettings: React.FC<{
  onOpenInstall?: () => void;
  onOpenQRCode?: () => void;
}> = ({ onOpenInstall, onOpenQRCode }) => {
  const {
    profile,
    updateProfile,
    exportDataJson,
    importDataJson,
    resetAllData,
    triggerConfetti,
  } = useQuitTrack();

  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'notifications' | 'privacy' | 'premium'>('profile');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Trusted contact local form
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  const handleExport = () => {
    const jsonStr = exportDataJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quittrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      const content = event.target?.result as string;
      if (content) {
        const success = importDataJson(content);
        if (success) {
          setImportStatus('Data successfully restored!');
        } else {
          setImportStatus('Invalid backup file. Please verify JSON format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const handleAddContact = () => {
    if (contactName.trim()) {
      const newContact = {
        id: 'c_' + Date.now(),
        name: contactName.trim(),
        relation: 'Support Contact',
        phone: contactPhone.trim(),
      };
      updateProfile({
        trustedContacts: [...(profile.trustedContacts || []), newContact],
      });
      setContactName('');
      setContactPhone('');
      triggerConfetti();
    }
  };

  const handleRemoveContact = (id: string) => {
    updateProfile({
      trustedContacts: (profile.trustedContacts || []).filter(c => c.id !== id),
    });
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Settings & Profile
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize your goals, notifications, and privacy preferences.
        </p>
      </div>

      {/* Mobile App & QR Scan Helper */}
      <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-950 dark:text-emerald-200">
              Install QuitTrack on Mobile
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-400">
              Scan QR code with your phone camera to install
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {onOpenQRCode && (
            <button
              onClick={onOpenQRCode}
              className="py-1.5 px-2.5 rounded-xl bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-xs font-semibold shadow-sm flex items-center gap-1"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>QR Code</span>
            </button>
          )}
          {onOpenInstall && (
            <button
              onClick={onOpenInstall}
              className="py-1.5 px-2.5 rounded-xl bg-emerald-600 text-white text-xs font-semibold shadow-sm flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install</span>
            </button>
          )}
        </div>
      </div>

      {/* Subtab Segmented Control */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        {(['profile', 'notifications', 'privacy', 'premium'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl capitalize transition-all ${
              activeSubTab === tab
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab 1: Profile & Smoking Baseline */}
      {activeSubTab === 'profile' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Smoking Baseline & Pricing
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Name / Nickname
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => updateProfile({ name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Daily Baseline (cigs/day)
                </label>
                <input
                  type="number"
                  min="1"
                  max="80"
                  value={profile.baselinePerDay}
                  onChange={e => updateProfile({ baselinePerDay: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Pack Price ({profile.currency})
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={profile.packPrice}
                  onChange={e => updateProfile({ packPrice: Math.max(1, Number(e.target.value)) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Cigarettes per Pack
                </label>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={profile.cigsPerPack}
                  onChange={e => updateProfile({ cigsPerPack: Math.max(5, Number(e.target.value)) })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Quit Date
                </label>
                <input
                  type="date"
                  value={profile.targetQuitDate}
                  onChange={e => updateProfile({ targetQuitDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Primary Goal
                </label>
                <select
                  value={profile.goal}
                  onChange={e => updateProfile({ goal: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                >
                  <option value="quit">Quit completely</option>
                  <option value="reduce">Reduce gradually</option>
                  <option value="track">Track habits first</option>
                </select>
              </div>
            </div>
          </div>

          {/* Trusted Support Contacts */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-600" />
                <span>Trusted Support Contacts</span>
              </h2>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Optional loved ones or friends you can reach out to in 1 tap during difficult cravings.
            </p>

            <div className="space-y-2">
              {(profile.trustedContacts || []).map(contact => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white block">{contact.name}</span>
                    <span className="text-slate-400">{contact.phone}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveContact(contact.id)}
                    className="text-rose-500 hover:text-rose-700 font-bold p-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Contact */}
            <div className="pt-2 flex gap-2">
              <input
                type="text"
                placeholder="Contact Name"
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              <input
                type="tel"
                placeholder="Phone (optional)"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddContact}
                className="px-3 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>
          </div>

          {/* App Preferences */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              App Preferences
            </h2>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Dark Mode</span>
                <input
                  type="checkbox"
                  checked={profile.theme === 'dark'}
                  onChange={e => updateProfile({ theme: e.target.checked ? 'dark' : 'light' })}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Sound Effects (Mindful Bells & Mini-Game)</span>
                <input
                  type="checkbox"
                  checked={profile.soundEnabled}
                  onChange={e => updateProfile({ soundEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-slate-700 dark:text-slate-300 font-medium">Milestone Celebrations & Confetti</span>
                <input
                  type="checkbox"
                  checked={profile.celebrationsEnabled}
                  onChange={e => updateProfile({ celebrationsEnabled: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 border-slate-300"
                />
              </label>

              {onOpenInstall && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={onOpenInstall}
                    className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center justify-between text-xs"
                  >
                    <span className="flex items-center gap-2">
                      <span>📱</span> Install QuitTrack on Mobile Home Screen
                    </span>
                    <span className="bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px]">
                      Install App
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Notifications */}
      {activeSubTab === 'notifications' && (
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Supportive Reminders & Notifications
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Guilt-free, uplifting nudges to anchor your daily focus. Zero shame or fear tactics.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Morning Motivation</span>
                <span className="text-slate-400">Gentle affirmation as you start your day</span>
              </div>
              <input
                type="checkbox"
                checked={profile.notifications?.morningMotivation}
                onChange={e =>
                  updateProfile({
                    notifications: { ...profile.notifications, morningMotivation: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Craving-Risk Alert</span>
                <span className="text-slate-400">Heads up 15 mins before peak craving times</span>
              </div>
              <input
                type="checkbox"
                checked={profile.notifications?.cravingRiskAlerts}
                onChange={e =>
                  updateProfile({
                    notifications: { ...profile.notifications, cravingRiskAlerts: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Savings Update</span>
                <span className="text-slate-400">Daily recap of money kept in your pocket</span>
              </div>
              <input
                type="checkbox"
                checked={profile.notifications?.savingsUpdate}
                onChange={e =>
                  updateProfile({
                    notifications: { ...profile.notifications, savingsUpdate: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Milestone Celebrations</span>
                <span className="text-slate-400">Alerts when health timelines and badges unlock</span>
              </div>
              <input
                type="checkbox"
                checked={profile.notifications?.milestoneCelebration}
                onChange={e =>
                  updateProfile({
                    notifications: { ...profile.notifications, milestoneCelebration: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 cursor-pointer">
              <div>
                <span className="font-semibold text-slate-900 dark:text-white block">Evening Reflection</span>
                <span className="text-slate-400">Quiet 30-second check-in before sleep</span>
              </div>
              <input
                type="checkbox"
                checked={profile.notifications?.eveningReflection}
                onChange={e =>
                  updateProfile({
                    notifications: { ...profile.notifications, eveningReflection: e.target.checked },
                  })
                }
                className="w-4 h-4 rounded text-emerald-600"
              />
            </label>
          </div>
        </div>
      )}

      {/* Tab 3: Privacy & Data Freedom */}
      {activeSubTab === 'privacy' && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Privacy Manifesto
              </h2>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Your smoking history and cravings are sensitive personal data. QuitTrack is designed with local-first storage. We never sell, rent, or monetize your health or behavioral logs.
            </p>

            <div className="space-y-2 pt-2 text-xs">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Guest Mode / Anonymous Account</span>
                  <span className="text-slate-400">Operate without email or phone number</span>
                </div>
                <span className="text-emerald-600 font-bold text-xs">Active</span>
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <span className="font-semibold text-slate-900 dark:text-white block">Local Storage Only</span>
                  <span className="text-slate-400">All data stored on this device</span>
                </div>
                <span className="text-emerald-600 font-bold text-xs">Active</span>
              </label>
            </div>
          </div>

          {/* Backup & Export */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Data Portability
            </h2>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Export My Data (JSON)</span>
              </button>

              <label className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Restore Backup</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs text-center font-medium">
                {importStatus}
              </div>
            )}
          </div>

          {/* Delete Account / Reset Data */}
          <div className="p-5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-3">
            <h2 className="text-sm font-bold text-rose-900 dark:text-rose-300 flex items-center gap-2">
              <Trash2 className="w-4 h-4" /> Danger Zone
            </h2>
            <p className="text-xs text-rose-800/80 dark:text-rose-300/80">
              Permanently erase all cigarette logs, craving records, and streak history from this device.
            </p>

            {!showDeleteConfirm ? (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition-colors"
              >
                Delete All Data
              </button>
            ) : (
              <div className="space-y-2">
                <span className="text-xs font-bold text-rose-900 dark:text-rose-200 block">
                  Are you absolutely sure? This cannot be undone.
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetAllData();
                      setShowDeleteConfirm(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-bold hover:bg-rose-600"
                  >
                    Yes, Erase Everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Premium Features Preview */}
      {activeSubTab === 'premium' && (
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 text-white space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Crown className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">QuitTrack Plus</h2>
                <span className="text-xs text-amber-300 font-medium">Optional Enhancements</span>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Free Core Forever
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            All essential quitting tools, tracking, craving timers, and emergency support are 100% free and never paywalled. QuitTrack Plus offers optional deep customization for superusers.
          </p>

          <div className="space-y-2.5 text-xs text-slate-200">
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-amber-400">✓</span>
              <span>Advanced Deep Trigger & Weather Correlation Analytics</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-amber-400">✓</span>
              <span>Unlimited Voice & Text AI Coaching Sessions</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-amber-400">✓</span>
              <span>Multi-Device Real-Time Cloud Synchronization</span>
            </div>
            <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-amber-400">✓</span>
              <span>Exclusive Soundscapes & Custom Wellness Themes</span>
            </div>
          </div>

          <button
            onClick={() => {
              updateProfile({ isPremium: true });
              triggerConfetti();
              alert('QuitTrack Plus features unlocked for this preview session!');
            }}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wide transition-all shadow-lg active:scale-95"
          >
            {profile.isPremium ? 'QuitTrack Plus Active 🎉' : 'Preview QuitTrack Plus (Free Preview)'}
          </button>
        </div>
      )}
    </div>
  );
};
