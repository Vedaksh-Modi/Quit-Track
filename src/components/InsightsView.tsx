import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import { HealthTimeline } from './HealthTimeline';
import { BadgesAndGamification } from './BadgesAndGamification';
import {
  BarChart3,
  TrendingDown,
  Clock,
  Zap,
  DollarSign,
  Heart,
  Award,
  Sparkles,
  PieChart,
  Percent,
} from 'lucide-react';

export const InsightsView: React.FC = () => {
  const { stats, profile, cigs, cravings } = useQuitTrack();
  const [subView, setSubView] = useState<'analytics' | 'health' | 'badges'>('analytics');

  // Calculate reduction percentage
  const baseline = profile.baselinePerDay || 15;
  const reductionPercent = Math.max(0, Math.min(100, Math.round(((baseline - stats.todaySmoked) / baseline) * 100)));

  // Calculate average time between cigarettes
  let avgHoursBetween = 'N/A';
  if (cigs.length >= 2) {
    let totalDiffMs = 0;
    let intervals = 0;
    for (let i = 0; i < Math.min(10, cigs.length - 1); i++) {
      const t1 = new Date(cigs[i].timestamp).getTime();
      const t2 = new Date(cigs[i + 1].timestamp).getTime();
      const diff = Math.abs(t1 - t2);
      if (diff > 0 && diff < 86400000 * 2) {
        totalDiffMs += diff;
        intervals++;
      }
    }
    if (intervals > 0) {
      const avgHours = totalDiffMs / intervals / 3600000;
      avgHoursBetween = `${avgHours.toFixed(1)} hrs`;
    }
  }

  // Trigger breakdown percentages
  const triggerMap: Record<string, number> = {};
  cigs.forEach(c => {
    if (c.trigger) triggerMap[c.trigger] = (triggerMap[c.trigger] || 0) + 1;
  });
  const totalCigsLogged = cigs.length || 1;
  const triggerStats = Object.entries(triggerMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <div className="space-y-5 pb-24">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Insights & Analytics
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Clear, evidence-grounded reflection of your personal data and health recovery.
        </p>
      </div>

      {/* Subtab Segmented Switcher */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
        <button
          onClick={() => setSubView('analytics')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subView === 'analytics'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Stats & Trends</span>
        </button>

        <button
          onClick={() => setSubView('health')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subView === 'health'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Health Milestones</span>
        </button>

        <button
          onClick={() => setSubView('badges')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            subView === 'badges'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
          }`}
        >
          <Award className="w-3.5 h-3.5" />
          <span>Badges & XP</span>
        </button>
      </div>

      {subView === 'health' && <HealthTimeline />}
      {subView === 'badges' && <BadgesAndGamification />}

      {subView === 'analytics' && (
        <div className="space-y-4">
          {/* Key Stat Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Reduction</span>
              <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                {reductionPercent}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">vs baseline</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Craving Resistance</span>
              <div className="text-xl font-bold text-sky-600 dark:text-sky-400 mt-1">
                {stats.cravingSuccessRate}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{stats.cravingsResistedCount} of {stats.cravingsTotalCount} cravings</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Time Between</span>
              <div className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                {avgHoursBetween}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">average interval</span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Smoke-Free Days</span>
              <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
                {stats.streakDays}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">continuous days</span>
            </div>
          </div>

          {/* Trigger Frequency Breakdown */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
              <span>Top Trigger Analysis</span>
              <span className="text-xs font-normal text-slate-400">Based on personal logs</span>
            </h2>

            <div className="space-y-2.5">
              {triggerStats.length > 0 ? (
                triggerStats.map(([trig, count]) => {
                  const pct = Math.round((count / totalCigsLogged) * 100);
                  return (
                    <div key={trig} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-slate-800 dark:text-slate-200">{trig}</span>
                        <span className="text-slate-500 font-bold">{count} logs ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-xs text-slate-400 text-center py-4">
                  Log triggers when recording cigarettes to reveal your pattern breakdown!
                </div>
              )}
            </div>
          </div>

          {/* Habit Time Heatmap / Hourly distribution */}
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Vulnerability Window
              </h2>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Peak: {stats.patterns.peakTime}
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Your logged data indicates that your strongest urges typically emerge around <strong className="text-slate-800 dark:text-slate-200">{stats.patterns.peakTime}</strong>, particularly when dealing with <strong className="text-slate-800 dark:text-slate-200">{stats.patterns.peakTrigger}</strong> in {stats.patterns.peakLocation}.
            </p>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Actionable Strategy:</strong> Schedule a 5-minute tea break or deep breathing 10 minutes prior to {stats.patterns.peakTime} to disarm the habitual cue before it triggers!
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
