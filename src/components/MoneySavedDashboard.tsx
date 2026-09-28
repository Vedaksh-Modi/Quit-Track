import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  DollarSign,
  PiggyBank,
  TrendingUp,
  Target,
  Sparkles,
  ShoppingBag,
  Plane,
  Headphones,
  Laptop,
  Shield,
  Edit2,
  Check,
} from 'lucide-react';

const PRESET_GOALS = [
  { name: 'Bose Noise-Canceling Headphones', targetAmount: 300, icon: 'Headphones' },
  { name: 'Dream Weekend Getaway', targetAmount: 800, icon: 'Plane' },
  { name: 'High-End Gaming PC / Console', targetAmount: 1200, icon: 'Laptop' },
  { name: 'Emergency Peace-of-Mind Fund', targetAmount: 2000, icon: 'Shield' },
  { name: 'Annual Wardrobe Refresh', targetAmount: 500, icon: 'ShoppingBag' },
];

export const MoneySavedDashboard: React.FC = () => {
  const { profile, stats, updateProfile, triggerConfetti } = useQuitTrack();
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalName, setGoalName] = useState(profile.savingsGoal?.name || 'Dream Vacation');
  const [goalAmount, setGoalAmount] = useState(profile.savingsGoal?.targetAmount || 500);

  const pricePerCig = profile.packPrice / (profile.cigsPerPack || 20);
  const moneySaved = stats.moneySaved;

  const currentGoalAmount = profile.savingsGoal?.targetAmount || 500;
  const currentGoalName = profile.savingsGoal?.name || 'Dream Vacation';
  const progressPercent = Math.min(100, Math.round((moneySaved / currentGoalAmount) * 100));
  const remainingAmount = Math.max(0, currentGoalAmount - moneySaved);

  const daysToGoal = stats.baselineDailySpend > 0
    ? Math.max(1, Math.ceil(remainingAmount / stats.baselineDailySpend))
    : 30;

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      savingsGoal: {
        name: goalName,
        targetAmount: Math.max(10, Number(goalAmount)),
        icon: 'Target',
      },
    });
    setEditingGoal(false);
    triggerConfetti();
  };

  const handleSelectPreset = (preset: typeof PRESET_GOALS[0]) => {
    setGoalName(preset.name);
    setGoalAmount(preset.targetAmount);
  };

  return (
    <div className="space-y-5 pb-24">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Financial Freedom
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Turn burned smoke money into tangible life rewards.
        </p>
      </div>

      {/* Hero Money Kept Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-white shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
            Total Money Kept in Your Pocket
          </span>
          <PiggyBank className="w-6 h-6 text-amber-200" />
        </div>

        <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          {profile.currency}{moneySaved}
        </div>

        <p className="text-xs text-amber-100/90 mt-2">
          Accumulated from {stats.totalAvoided} cigarettes spared since starting QuitTrack.
        </p>
      </div>

      {/* Primary Savings Goal Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-sm">
              🎯
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Active Reward: {currentGoalName}
              </h2>
              <span className="text-[11px] text-slate-400">
                {profile.currency}{moneySaved} of {profile.currency}{currentGoalAmount}
              </span>
            </div>
          </div>

          <button
            onClick={() => setEditingGoal(!editingGoal)}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{editingGoal ? 'Close' : 'Customize'}</span>
          </button>
        </div>

        {/* Visual Progress Bar */}
        <div>
          <div className="flex justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-600 dark:text-slate-300">{progressPercent}% Funded</span>
            <span className="text-amber-600 dark:text-amber-400">
              {profile.currency}{remainingAmount.toFixed(0)} to go
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-3.5 rounded-full overflow-hidden p-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 to-amber-600 h-full rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-between">
            <span>At current pace:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              ~{daysToGoal} days until unlocked!
            </span>
          </div>
        </div>

        {/* Edit Goal Drawer */}
        {editingGoal && (
          <form
            onSubmit={handleSaveGoal}
            className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3 animate-in fade-in"
          >
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Set Your Target Reward
            </span>

            {/* Presets */}
            <div className="flex flex-wrap gap-1.5">
              {PRESET_GOALS.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-slate-200"
                >
                  {p.name} ({profile.currency}{p.targetAmount})
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Goal Name</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={e => setGoalName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-500 mb-1 block">Target Cost ({profile.currency})</label>
                <input
                  type="number"
                  min="10"
                  value={goalAmount}
                  onChange={e => setGoalAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm"
            >
              Save New Goal
            </button>
          </form>
        )}
      </div>

      {/* Spending Breakdown Table */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
          <span>Baseline Spending Projections</span>
          <span className="text-[11px] font-normal text-slate-400">Based on {profile.baselinePerDay} cigs/day</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Daily</span>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {profile.currency}{stats.baselineDailySpend}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Weekly</span>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {profile.currency}{stats.baselineWeeklySpend}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Monthly</span>
            <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {profile.currency}{stats.baselineMonthlySpend}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Yearly</span>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {profile.currency}{stats.baselineYearlySpend}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 pt-1">
          By staying smoke-free for 1 full year, you keep over{' '}
          <strong className="text-emerald-600 dark:text-emerald-400">
            {profile.currency}{stats.baselineYearlySpend.toLocaleString()}
          </strong>{' '}
          in your personal bank account.
        </p>
      </div>

      {/* Tangible Reward Equivalency Equivalents */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 dark:text-white">
          What Your Savings Actually Buy:
        </h2>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">☕</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Artisanal Specialty Coffee
              </span>
            </div>
            <span className="text-slate-500 font-bold">
              {Math.max(1, Math.floor(moneySaved / 5))} cups
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🎬</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Movie Tickets & Snacks
              </span>
            </div>
            <span className="text-slate-500 font-bold">
              {Math.max(1, Math.floor(moneySaved / 20))} cinema outings
            </span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">🍽️</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Celebratory Dinner for Two
              </span>
            </div>
            <span className="text-slate-500 font-bold">
              {Math.max(1, Math.floor(moneySaved / 80))} luxury dinners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
