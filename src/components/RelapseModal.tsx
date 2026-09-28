import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  HeartHandshake,
  X,
  Sparkles,
  ArrowRight,
  TrendingDown,
  ShieldAlert,
  CheckCircle2,
} from 'lucide-react';

const COMMON_SLIP_TRIGGERS = [
  'Sudden high stress / emotional surge',
  'Social pressure / friends smoking',
  'Alcohol or party atmosphere',
  'Habit loop after meal or coffee',
  'Intense boredom / loneliness',
  'Arguments or workplace frustration',
];

export const RelapseModal: React.FC = () => {
  const {
    relapseModalActive,
    setRelapseModalActive,
    recoverFromSlip,
    stats,
    profile,
  } = useQuitTrack();

  const [trigger, setTrigger] = useState(COMMON_SLIP_TRIGGERS[0]);
  const [reflection, setReflection] = useState('');
  const [futureStrategy, setFutureStrategy] = useState(
    'Step away immediately and drink ice water for 5 minutes'
  );

  if (!relapseModalActive) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recoverFromSlip({
      trigger,
      reflection,
      futureStrategy,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-200">
        {/* Supportive Compassionate Header */}
        <div className="p-6 bg-gradient-to-br from-emerald-700 to-teal-800 text-white relative">
          <button
            onClick={() => setRelapseModalActive(false)}
            aria-label="Close"
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-3">
            <HeartHandshake className="w-7 h-7 text-emerald-200" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold">
            It's completely okay.
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 leading-relaxed">
            One cigarette does not erase your hard work. Quitting is a skill built through practice, not an all-or-nothing test.
          </p>
        </div>

        {/* Previous Progress Reassurance */}
        <div className="p-4 bg-slate-50 dark:bg-slate-850 border-b border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Cigarettes Spared</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
              {stats.totalAvoided} cigs
            </span>
          </div>
          <div className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-slate-400 block text-[10px]">Money Still Kept</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">
              {profile.currency}{stats.moneySaved}
            </span>
          </div>
        </div>

        {/* Reflection Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              1. What prompted the slip?
            </label>
            <select
              value={trigger}
              onChange={e => setTrigger(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            >
              {COMMON_SLIP_TRIGGERS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              2. Brief reflection (What was happening right before?)
            </label>
            <textarea
              rows={2}
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              placeholder="e.g. I was stressed about an email and didn't use the 5-minute timer..."
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              3. Strategy for the next craving:
            </label>
            <input
              type="text"
              value={futureStrategy}
              onChange={e => setFutureStrategy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Bounce Back & Start New Streak</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
