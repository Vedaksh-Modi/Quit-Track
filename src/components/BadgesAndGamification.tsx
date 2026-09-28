import React from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  Trophy,
  Flame,
  Award,
  Sparkles,
  ShieldCheck,
  Zap,
  Crown,
  HeartPulse,
  Wind,
  Sunrise,
  CheckCircle2,
  Lock,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Sparkles: Sparkles,
  Flame: Flame,
  ShieldCheck: ShieldCheck,
  Zap: Zap,
  Crown: Crown,
  Award: Award,
  CheckCircle2: CheckCircle2,
  HeartPulse: HeartPulse,
  Wind: Wind,
  Sunrise: Sunrise,
  PiggyBank: Award,
};

export const BadgesAndGamification: React.FC = () => {
  const { badges, stats, challenges, completeChallenge, profile, triggerConfetti } = useQuitTrack();

  const unlockedCount = badges.filter(b => b.unlockedAt).length;

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Achievements & Badges
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Earn XP, level up, and unlock milestones along your quitting journey.
        </p>
      </div>

      {/* Level Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-amber-300 text-lg">
              ★
            </div>
            <div>
              <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
                Current Level
              </span>
              <h2 className="text-xl font-extrabold">Level {stats.level} Smoke-Free Explorer</h2>
            </div>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-md">
            {profile.xp || 0} Total XP
          </span>
        </div>

        {/* Level XP Progress Bar */}
        <div>
          <div className="flex justify-between text-xs text-emerald-100 mb-1 font-medium">
            <span>{stats.xpInLevel} XP in this level</span>
            <span>{stats.xpForNextLevel} XP needed for Level {stats.level + 1}</span>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-amber-300 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.round((stats.xpInLevel / stats.xpForNextLevel) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>Badges Unlocked ({unlockedCount} / {badges.length})</span>
          </h2>
          <span className="text-[11px] text-slate-400">
            +{badges.reduce((acc, b) => b.unlockedAt ? acc + b.xp : acc, 0)} XP Earned
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {badges.map(b => {
            const isUnlocked = Boolean(b.unlockedAt);
            const IconComponent = ICON_MAP[b.icon] || Trophy;

            return (
              <div
                key={b.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isUnlocked
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-800 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-850/60 border-slate-200 dark:border-slate-800 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {isUnlocked ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        +{b.xp} XP
                      </span>
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                    {b.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                    {b.description}
                  </p>
                </div>

                <div className="pt-2 text-[10px] text-slate-400 mt-1">
                  {isUnlocked && b.unlockedAt
                    ? `Unlocked ${new Date(b.unlockedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}`
                    : 'In progress...'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Active Daily Missions</span>
          <span className="text-xs font-normal text-slate-400">Tap to complete</span>
        </h2>

        <div className="space-y-2">
          {challenges.map(ch => (
            <div
              key={ch.id}
              onClick={() => completeChallenge(ch.id)}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                ch.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-500'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                    ch.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <div className={`text-xs font-semibold ${ch.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {ch.title}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {ch.description}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                +{ch.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
