import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import { X, Flame, Check } from 'lucide-react';

const COMMON_TRIGGERS = [
  'Stress',
  'After meals',
  'Work/study',
  'Social',
  'Alcohol',
  'Boredom',
  'Morning routine',
];

export const QuickLogModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { profile, logCigarette } = useQuitTrack();
  const [trigger, setTrigger] = useState(profile.triggers[0] || 'Stress');
  const [cravingIntensity, setCravingIntensity] = useState(7);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleQuickLog = () => {
    logCigarette({
      trigger,
      cravingIntensity,
      notes,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold text-sm">
              🚬
            </div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Record 1 Cigarette</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          It's okay—stay honest with yourself. Fast 1-tap record:
        </p>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            What was the trigger?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_TRIGGERS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTrigger(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  trigger === t
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Urge Intensity:
            </span>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {cravingIntensity}/10
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={cravingIntensity}
            onChange={e => setCravingIntensity(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>

        <div>
          <input
            type="text"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Quick note (optional)"
            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleQuickLog}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            Log & Continue
          </button>
        </div>
      </div>
    </div>
  );
};
