import React, { useState, useMemo } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import { CigaretteLog } from '../types';
import {
  Plus,
  Flame,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  TrendingDown,
  Trash2,
  ChevronDown,
  Smile,
  MapPin,
  HelpCircle,
} from 'lucide-react';

const COMMON_TRIGGERS = [
  'Stress',
  'After meals',
  'Work/study',
  'Social situations',
  'Alcohol',
  'Boredom',
  'Morning routine',
  'Driving / Commute',
  'Other',
];

const MOODS = ['Neutral', 'Stressed', 'Anxious', 'Relaxed', 'Bored', 'Happy', 'Frustrated'];

const LOCATIONS = ['Home', 'Work', 'Car / Transit', 'Social / Bar', 'Outdoors', 'Other'];

export const CigaretteTracker: React.FC = () => {
  const { cigs, profile, stats, logCigarette, quickLogModalActive, setQuickLogModalActive } = useQuitTrack();
  const [viewFilter, setViewFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [showLogForm, setShowLogForm] = useState(false);

  // Form states
  const [trigger, setTrigger] = useState(profile.triggers[0] || 'Routine');
  const [mood, setMood] = useState('Neutral');
  const [location, setLocation] = useState('Home');
  const [cravingIntensity, setCravingIntensity] = useState(6);
  const [notes, setNotes] = useState('');
  const [customTime, setCustomTime] = useState(new Date().toISOString().substring(0, 16));

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    logCigarette({
      trigger,
      mood,
      location,
      cravingIntensity,
      notes,
    });
    setNotes('');
    setShowLogForm(false);
  };

  // Group logs for charts
  const chartData = useMemo(() => {
    const days: { label: string; count: number; dateStr: string }[] = [];
    const count = viewFilter === 'daily' ? 7 : viewFilter === 'weekly' ? 4 : 6;

    for (let i = count - 1; i >= 0; i--) {
      const d = new Date();
      if (viewFilter === 'daily') {
        d.setDate(d.getDate() - i);
        const dateKey = d.toISOString().split('T')[0];
        const dayLogs = cigs.filter(c => c.timestamp.startsWith(dateKey));
        days.push({
          label: d.toLocaleDateString(undefined, { weekday: 'short' }),
          dateStr: dateKey,
          count: dayLogs.length,
        });
      } else if (viewFilter === 'weekly') {
        const startDay = new Date(d.getTime() - (i * 7 + 6) * 86400000);
        const endDay = new Date(d.getTime() - i * 7 * 86400000);
        const weekLogs = cigs.filter(c => {
          const t = new Date(c.timestamp).getTime();
          return t >= startDay.getTime() && t <= endDay.getTime();
        });
        days.push({
          label: `W-${count - i}`,
          dateStr: `${startDay.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}`,
          count: weekLogs.length,
        });
      } else {
        d.setMonth(d.getMonth() - i);
        const monthKey = d.toISOString().substring(0, 7);
        const monthLogs = cigs.filter(c => c.timestamp.startsWith(monthKey));
        days.push({
          label: d.toLocaleDateString(undefined, { month: 'short' }),
          dateStr: monthKey,
          count: monthLogs.length,
        });
      }
    }
    return days;
  }, [cigs, viewFilter]);

  const maxChartCount = Math.max(10, ...chartData.map(d => d.count), profile.dailyTarget || 10);

  return (
    <div className="space-y-5 pb-24">
      {/* Header and Fast Add Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Cigarette Tracker
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Log mindfully without judgment. Honest tracking unveils your patterns.
          </p>
        </div>

        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>{showLogForm ? 'Close Form' : 'Log Cigarette'}</span>
        </button>
      </div>

      {/* Manual Full Log Form Drawer / Card */}
      {showLogForm && (
        <form
          onSubmit={handleSaveLog}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-emerald-600" /> Record Entry Details
            </span>
            <span className="text-[11px] text-slate-400">Optional context</span>
          </div>

          {/* Trigger */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Reason / Trigger:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TRIGGERS.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTrigger(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                    trigger === t
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Mood & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mood:
              </label>
              <select
                value={mood}
                onChange={e => setMood(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                {MOODS.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Location:
              </label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
              >
                {LOCATIONS.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Craving Intensity Slider */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Craving Intensity:
              </label>
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

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reflective Note:
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Felt bored while waiting for the train"
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
          >
            Save Entry
          </button>
        </form>
      )}

      {/* Pattern Discovery Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-amber-950 dark:text-amber-200">
        <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider mb-2 text-amber-800 dark:text-amber-300">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Observed Personal Patterns</span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400">⏰ Peak Time:</span>
            <span>You usually smoke around {stats.patterns.peakTime}.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400">⚡ Top Trigger:</span>
            <span>You smoke most frequently when triggered by <strong className="underline">{stats.patterns.peakTrigger}</strong>.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-amber-600 dark:text-amber-400">📍 Context:</span>
            <span>Most frequent environment: {stats.patterns.peakLocation} while feeling {stats.patterns.peakMood}.</span>
          </div>
        </div>
        <p className="text-[10px] text-amber-800/70 dark:text-amber-300/60 mt-2.5 pt-2 border-t border-amber-200/60 dark:border-amber-900/30">
          *Note: These observations represent patterns in your own logged tracking data and are not medical diagnoses.
        </p>
      </div>

      {/* Chart Section */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">
            Consumption Trends
          </h2>
          {/* Segmented filter buttons */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            {(['daily', 'weekly', 'monthly'] as const).map(f => (
              <button
                key={f}
                onClick={() => setViewFilter(f)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                  viewFilter === f
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1">
          {chartData.map((d, idx) => {
            const heightPercent = Math.max(8, Math.round((d.count / maxChartCount) * 100));
            const isToday = idx === chartData.length - 1 && viewFilter === 'daily';
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  {d.count}
                </span>
                <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-t-lg relative flex items-end justify-center h-28 overflow-hidden">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-emerald-600'
                        : d.count > (profile.dailyTarget || 10)
                        ? 'bg-slate-400 dark:bg-slate-600'
                        : 'bg-teal-500 dark:bg-teal-600'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-slate-400">
                  {d.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" /> Current day
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-teal-500 inline-block" /> Under target
          </span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Baseline: {profile.baselinePerDay}/day
          </span>
        </div>
      </div>

      {/* Recent Log History */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Recent History</span>
          <span className="text-xs font-normal text-slate-400">{cigs.length} total logged</span>
        </h2>

        {cigs.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center text-slate-400 text-xs">
            No cigarettes logged yet. Way to stay clean!
          </div>
        ) : (
          <div className="space-y-2">
            {cigs.slice(0, 10).map(c => {
              const date = new Date(c.timestamp);
              const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              const formattedDate = date.toLocaleDateString([], { month: 'short', day: 'numeric' });
              return (
                <div
                  key={c.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center text-sm font-bold">
                      🚬
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <span>{c.trigger || 'Routine'}</span>
                        <span className="text-[10px] font-normal text-slate-400">· {c.mood}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span>{formattedDate}, {formattedTime}</span>
                        <span>·</span>
                        <span>{c.location}</span>
                        {c.notes && (
                          <>
                            <span>·</span>
                            <span className="italic truncate max-w-[120px]">{c.notes}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Intensity {c.cravingIntensity}/10
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
