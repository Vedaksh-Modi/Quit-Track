import React from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import {
  Flame,
  Zap,
  CheckCircle2,
  DollarSign,
  Heart,
  TrendingDown,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Plus,
  Target,
  Trophy,
  Smartphone,
  Download,
  Gift,
  QrCode,
  Award,
} from 'lucide-react';

export const HomeDashboard: React.FC<{
  onOpenQuickLog: () => void;
  onOpenAICoach: () => void;
  onOpenInstall: () => void;
  onOpenQRCode: () => void;
}> = ({ onOpenQuickLog, onOpenAICoach, onOpenInstall, onOpenQRCode }) => {
  const {
    profile,
    stats,
    setActiveTab,
    resistCravingQuick,
    completeChallenge,
    challenges,
    claimedDayRewards,
    rewardPoints,
    claimDayReward,
  } = useQuitTrack();

  // Compute eligible smoke-free day number
  const eligibleDayNumber = Math.max(1, stats.streakDays === 0 && stats.todaySmoked === 0 ? 1 : stats.streakDays);
  const isClaimedForEligibleDay = claimedDayRewards.some(r => r.dayNumber === eligibleDayNumber);
  const canClaimToday = stats.todaySmoked === 0 && !isClaimedForEligibleDay;
  const streakMultiplier = (1.0 + Math.min(1.0, Math.floor(stats.streakDays / 7) * 0.25)).toFixed(2);

  // Calculate circular progress for today's goal
  // If goal is quit, remaining cigarettes is target vs smoked
  const maxLimit = profile.dailyTarget || profile.baselinePerDay;
  const smokedRatio = maxLimit > 0 ? Math.min(1, stats.todaySmoked / maxLimit) : 0;
  const strokeDashoffset = 251.2 - 251.2 * (1 - smokedRatio);

  return (
    <div className="space-y-5 pb-24">
      {/* Top Greeting & Smoke-Free Streak Hero Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-teal-500/10 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Welcome back, {profile.name || 'Friend'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              {stats.streakDays > 0 ? `${stats.streakDays} Days Smoke-Free` : `${stats.streakHours}h ${stats.streakMinutes}m Clean`}
            </h1>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center text-amber-300">
            <Flame className="w-6 h-6 fill-current animate-pulse" />
          </div>
        </div>

        {/* Real-Time Live Streak Breakdown Clock */}
        <div className="grid grid-cols-4 gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center relative z-10 mb-4">
          <div>
            <div className="text-lg sm:text-xl font-mono font-bold text-white">{stats.streakDays}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Days</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-mono font-bold text-white">{stats.streakHours}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Hours</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-mono font-bold text-white">{stats.streakMinutes}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Mins</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-mono font-bold text-emerald-300">{stats.streakSeconds}</div>
            <div className="text-[10px] text-slate-300 uppercase tracking-wider">Secs</div>
          </div>
        </div>

        {/* Quick Motivation Kicker */}
        <div className="flex items-center justify-between text-xs text-emerald-100/90 relative z-10">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            {stats.todaySmoked === 0
              ? 'Zero cigarettes smoked today. Outstanding control!'
              : `${stats.todayAvoided} cigarettes spared from your lungs today.`}
          </span>
          <button
            onClick={() => setActiveTab('insights')}
            className="text-white hover:text-emerald-200 underline underline-offset-2 font-medium"
          >
            Insights
          </button>
        </div>
      </div>

      {/* Primary 3 Quick Action Buttons */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {/* I Smoked */}
        <button
          onClick={onOpenQuickLog}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center transition-all active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-1.5 group-hover:bg-rose-50 dark:group-hover:bg-rose-950/40 group-hover:text-rose-600 transition-colors">
            <Plus className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">I Smoked</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Log cigarette</span>
        </button>

        {/* I Have a Craving */}
        <button
          onClick={() => setActiveTab('craving')}
          className="p-3.5 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/10 flex flex-col items-center justify-center text-center transition-all active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-1.5 text-white">
            <Zap className="w-5 h-5 fill-current animate-bounce" />
          </div>
          <span className="text-xs font-bold">Have Craving</span>
          <span className="text-[10px] text-emerald-100 mt-0.5">5-min assist</span>
        </button>

        {/* I Resisted */}
        <button
          onClick={resistCravingQuick}
          className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-sm flex flex-col items-center justify-center text-center transition-all active:scale-95 group"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold text-slate-900 dark:text-white">I Resisted</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">+50 XP win</span>
        </button>
      </div>

      {/* Smoke-Free Day Reward & Daily Streak Bonus Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-emerald-500/10 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-emerald-950/30 border border-amber-200/80 dark:border-amber-800/50 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
              🎁
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Day {eligibleDayNumber} Smoke-Free Reward
                </span>
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-200">
                  {streakMultiplier}x Bonus
                </span>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                {rewardPoints.toLocaleString()} tokens earned so far
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('rewards')}
            className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5"
          >
            <span>Vault</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {isClaimedForEligibleDay ? (
          <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-emerald-100/60 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-200">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Day {eligibleDayNumber} Reward claimed! Next unlocks tomorrow.
            </span>
            <button
              onClick={() => setActiveTab('rewards')}
              className="font-bold underline text-[11px]"
            >
              Treats
            </button>
          </div>
        ) : canClaimToday ? (
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-300">
              Zero cigarettes today! Your Day {eligibleDayNumber} clean reward is ready.
            </span>
            <button
              onClick={() => claimDayReward(eligibleDayNumber)}
              className="py-2 px-3.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-sm transition-transform active:scale-95 shrink-0 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Claim Bonus</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Resetting for tomorrow's clean day bonus. Keep pushing forward!</span>
            <button
              onClick={() => setActiveTab('rewards')}
              className="text-emerald-600 dark:text-emerald-400 font-semibold underline text-[11px]"
            >
              View Tiers
            </button>
          </div>
        )}
      </div>

      {/* Quick Mobile Scan & Install Callout */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <QrCode className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-1.5">
              <span>Install QuitTrack on Mobile</span>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-emerald-950 text-emerald-300 font-mono">
                No Store Needed
              </span>
            </div>
            <span className="text-[10px] text-slate-300">
              Scan with camera to install on iPhone & Android
            </span>
          </div>
        </div>

        <button
          onClick={onOpenQRCode}
          className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-transform active:scale-95 flex items-center gap-1 shadow-sm"
        >
          <span>Scan QR</span>
        </button>
      </div>

      {/* Main Metrics 2x2 Grid with Circular Today Target Ring */}
      <div className="grid grid-cols-2 gap-3">
        {/* Today's Cigarettes & Limit Ring Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Today's Count
            </span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              Limit: {maxLimit}
            </span>
          </div>

          <div className="flex items-center gap-3 my-1">
            {/* SVG Circular Ring */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 90 90">
                <circle
                  cx="45"
                  cy="45"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-800"
                  fill="transparent"
                />
                <circle
                  cx="45"
                  cy="45"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray="226.2"
                  strokeDashoffset={226.2 - 226.2 * Math.min(1, stats.todaySmoked / (maxLimit || 1))}
                  strokeLinecap="round"
                  className={stats.todaySmoked > maxLimit ? 'text-rose-500' : 'text-emerald-500'}
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  {stats.todaySmoked}
                </span>
              </div>
            </div>

            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {stats.todayAvoided} Avoided
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                vs baseline {profile.baselinePerDay}/day
              </div>
            </div>
          </div>
        </div>

        {/* Money Saved Card */}
        <div
          onClick={() => setActiveTab('money')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Money Kept
            </span>
            <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs">
              💰
            </div>
          </div>

          <div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {profile.currency}{stats.moneySaved}
            </div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 flex items-center gap-1">
              <span>{profile.currency}{stats.baselineDailySpend}/day saved</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          </div>
        </div>

        {/* Total Avoided Since Starting */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Cigarettes Avoided
            </span>
            <TrendingDown className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
            {stats.totalAvoided}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Since {new Date(profile.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        </div>

        {/* Target Quit Date Progress */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Target Quit Date
            </span>
            <Target className="w-4 h-4 text-sky-600" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.quitDateDaysRemaining !== null
                ? stats.quitDateDaysRemaining === 0
                  ? 'Quit Day Today!'
                  : `${stats.quitDateDaysRemaining} Days Away`
                : 'Open Goal'}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {profile.targetQuitDate ? profile.targetQuitDate : 'Set date in Profile'}
            </div>
          </div>
        </div>
      </div>

      {/* Install on Mobile App Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 border border-emerald-500/30 text-white flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-lg">
            📱
          </div>
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Install QuitTrack on Mobile</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-normal">PWA</span>
            </h2>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Instant 1-tap tracking & offline home screen access.
            </p>
          </div>
        </div>
        <button
          onClick={onOpenInstall}
          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm active:scale-95 shrink-0 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      </div>

      {/* Current Health Milestone Card */}
      <div
        onClick={() => setActiveTab('insights')}
        className="p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 dark:from-sky-950/30 dark:to-teal-950/20 border border-sky-200 dark:border-sky-900/40 shadow-sm cursor-pointer hover:border-sky-300 transition-all"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300">
                Health Milestone ({stats.currentHealthMilestone.timeLabel})
              </span>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                {stats.currentHealthMilestone.title}
              </h2>
            </div>
          </div>
          <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-1">
            Timeline <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
          {stats.currentHealthMilestone.description}
        </p>

        {/* Milestone Progress Bar */}
        {stats.nextHealthMilestone && (
          <div>
            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
              <span>Next: {stats.nextHealthMilestone.title}</span>
              <span className="font-semibold text-sky-600 dark:text-sky-400">
                {stats.milestoneProgressPercent}%
              </span>
            </div>
            <div className="w-full bg-sky-200/60 dark:bg-sky-950 h-2 rounded-full overflow-hidden">
              <div
                className="bg-sky-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${stats.milestoneProgressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Savings Goal Quick Progress */}
      {profile.savingsGoal && (
        <div
          onClick={() => setActiveTab('money')}
          className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm cursor-pointer hover:border-amber-300 transition-colors"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🎯</span> Savings Goal: {profile.savingsGoal.name}
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {profile.currency}{stats.moneySaved} / {profile.currency}{profile.savingsGoal.targetAmount}
            </span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-1.5">
            <div
              className="bg-amber-500 h-2.5 rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, Math.round((stats.moneySaved / profile.savingsGoal.targetAmount) * 100))}%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>
              {Math.max(0, profile.savingsGoal.targetAmount - stats.moneySaved).toFixed(0)} {profile.currency} remaining
            </span>
            <span>
              ~{Math.max(1, Math.ceil((profile.savingsGoal.targetAmount - stats.moneySaved) / (stats.baselineDailySpend || 1)))} days at current pace
            </span>
          </div>
        </div>
      )}

      {/* Daily Challenges */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Today's Challenges
          </h2>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            Level {stats.level} ({stats.xpInLevel}/{stats.xpForNextLevel} XP)
          </span>
        </div>

        <div className="space-y-2">
          {challenges.slice(0, 3).map(ch => (
            <div
              key={ch.id}
              onClick={() => completeChallenge(ch.id)}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                ch.completed
                  ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40 text-slate-500 dark:text-slate-400'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    ch.completed
                      ? 'bg-emerald-600 text-white'
                      : 'border-2 border-slate-300 dark:border-slate-600 text-transparent'
                  }`}
                >
                  ✓
                </div>
                <div>
                  <div
                    className={`text-xs font-semibold ${
                      ch.completed
                        ? 'line-through text-slate-400 dark:text-slate-500'
                        : 'text-slate-900 dark:text-white'
                    }`}
                  >
                    {ch.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {ch.description}
                  </div>
                </div>
              </div>

              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 ml-2">
                +{ch.xp} XP
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
