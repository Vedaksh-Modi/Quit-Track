import React, { useState } from 'react';
import { useQuitTrack } from '../context/QuitTrackContext';
import { SMOKE_FREE_DAY_TIERS, DAILY_AFFIRMATIONS } from '../data/rewardsData';
import { SmokeFreeDayTier, SelfRewardItem } from '../types';
import {
  Trophy,
  Award,
  Sparkles,
  Gift,
  CheckCircle2,
  Lock,
  Plus,
  Flame,
  DollarSign,
  HeartHandshake,
  Share2,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  Smile,
} from 'lucide-react';

export const RewardsDashboard: React.FC<{
  onOpenInstall: () => void;
}> = ({ onOpenInstall }) => {
  const {
    profile,
    stats,
    claimedDayRewards,
    selfRewards,
    dailyPledges,
    rewardPoints,
    isTodayPledgeSigned,
    claimDayReward,
    redeemSelfReward,
    addSelfReward,
    deleteSelfReward,
    signDailyPledge,
    triggerConfetti,
  } = useQuitTrack();

  const [selectedTier, setSelectedTier] = useState<SmokeFreeDayTier | null>(null);
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCost, setNewCost] = useState('20');
  const [newDays, setNewDays] = useState('3');
  const [newCategory, setNewCategory] = useState<'treat' | 'experience' | 'wellness' | 'hobby'>('treat');
  const [newIcon, setNewIcon] = useState('🎁');
  const [redeemNoteModal, setRedeemNoteModal] = useState<SelfRewardItem | null>(null);
  const [redeemNote, setRedeemNote] = useState('');
  const [certCopied, setCertCopied] = useState(false);

  // Compute current eligible day number
  // If user has streakDays >= 1, they are on day (streakDays) or day (streakDays + 1)
  const currentStreakDays = stats.streakDays;
  const eligibleDayNumber = Math.max(1, currentStreakDays === 0 && stats.todaySmoked === 0 ? 1 : currentStreakDays);
  
  // Can claim today's reward if today 0 cigs smoked and not claimed for this day number yet
  const isClaimedForEligibleDay = claimedDayRewards.some(r => r.dayNumber === eligibleDayNumber);
  const canClaimToday = stats.todaySmoked === 0 && !isClaimedForEligibleDay;

  // Multiplier
  const streakMultiplier = (1.0 + Math.min(1.0, Math.floor(stats.streakDays / 7) * 0.25)).toFixed(2);

  // Affirmation based on day of month
  const affirmation = DAILY_AFFIRMATIONS[new Date().getDate() % DAILY_AFFIRMATIONS.length];

  const handleAddRewardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addSelfReward({
      title: newTitle.trim(),
      cost: Math.max(1, parseFloat(newCost) || 10),
      requiredDays: Math.max(1, parseInt(newDays, 10) || 1),
      icon: newIcon || '🎁',
      category: newCategory,
    });
    setNewTitle('');
    setShowAddRewardModal(false);
  };

  const handleConfirmRedeem = () => {
    if (!redeemNoteModal) return;
    redeemSelfReward(redeemNoteModal.id, redeemNote.trim() || undefined);
    setRedeemNoteModal(null);
    setRedeemNote('');
  };

  const handleShareCertificate = async () => {
    const text = `🏆 Proud moment! I am ${stats.streakDays} days smoke-free with QuitTrack, saved ${profile.currency}${stats.moneySaved.toFixed(0)}, and spared my lungs from ${stats.totalAvoided} cigarettes! 🌿`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Smoke-Free Milestone',
          text,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(text);
        setCertCopied(true);
        setTimeout(() => setCertCopied(false), 2000);
      }
    } catch {
      // Ignore
    }
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-300">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-br from-amber-600 via-orange-600 to-emerald-800 rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-36 h-36 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4 relative z-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Smoke-Free Reward Vault
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-0.5">
              Celebrate Every Day
            </h1>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center text-amber-200 shadow-inner">
            <Trophy className="w-7 h-7" />
          </div>
        </div>

        {/* 3 Metrics in Hero */}
        <div className="grid grid-cols-3 gap-2 bg-black/20 backdrop-blur-md rounded-2xl p-3 border border-white/10 text-center relative z-10 mb-4">
          <div>
            <div className="text-lg sm:text-xl font-mono font-bold text-amber-300">
              {rewardPoints.toLocaleString()}
            </div>
            <div className="text-[10px] text-amber-100 uppercase tracking-wider">Reward Tokens</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-mono font-bold text-white">
              {stats.streakDays}d
            </div>
            <div className="text-[10px] text-slate-200 uppercase tracking-wider">Clean Streak</div>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-mono font-bold text-emerald-300">
              {streakMultiplier}x
            </div>
            <div className="text-[10px] text-emerald-100 uppercase tracking-wider">Bonus Multi</div>
          </div>
        </div>

        <p className="text-xs text-amber-100/90 relative z-10 leading-relaxed">
          Every smoke-free 24 hours heals vital organs and saves hard-earned cash. Claim your daily bonuses and reward yourself with guilt-free treats!
        </p>
      </div>

      {/* Today's Smoke-Free Day Reward Claim Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-lg">
              🎁
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                Day {eligibleDayNumber} Smoke-Free Reward
              </h2>
              <span className="text-[11px] text-slate-400">
                Daily streak bonus & health perk
              </span>
            </div>
          </div>

          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
            +{Math.round((SMOKE_FREE_DAY_TIERS.find(t => t.dayNumber === eligibleDayNumber)?.points || 150) * parseFloat(streakMultiplier))} pts
          </span>
        </div>

        {isClaimedForEligibleDay ? (
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                  Claimed for Day {eligibleDayNumber}!
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400">
                  Your streak multiplier is active. Next reward unlocks tomorrow at dawn.
                </div>
              </div>
            </div>
          </div>
        ) : canClaimToday ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              You have smoked <strong>zero cigarettes today</strong>! Claim your Day {eligibleDayNumber} reward bonus and treat yourself to something nice.
            </p>
            <button
              onClick={() => claimDayReward(eligibleDayNumber)}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Claim Today's Smoke-Free Reward</span>
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
            <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <span>Resetting for tomorrow's clean day</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
              A cigarette was logged today, but that does not erase your resilience. Stay clean for the rest of today to unlock tomorrow's bonus!
            </p>
          </div>
        )}
      </div>

      {/* Daily Smoke-Free Pledge ("Morning Commitment") */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-teal-50 to-emerald-50/50 dark:from-slate-900 dark:to-emerald-950/20 border border-teal-200/80 dark:border-teal-900/40 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 dark:text-teal-300">
              Daily Smoke-Free Pledge
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-400">
            {isTodayPledgeSigned ? 'Signed Today ✓' : '+30 XP'}
          </span>
        </div>

        <blockquote className="italic text-xs text-slate-700 dark:text-slate-300 border-l-2 border-teal-500 pl-3 leading-relaxed">
          "{affirmation}"
        </blockquote>

        {isTodayPledgeSigned ? (
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-800 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-950/60 p-2.5 rounded-xl">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Pledge active: You committed to protecting your lungs today!</span>
          </div>
        ) : (
          <button
            onClick={signDailyPledge}
            className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <span>Sign Today's Smoke-Free Pledge</span>
          </button>
        )}
      </div>

      {/* Smoke-Free Days Milestone Road */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            Smoke-Free Milestone Tiers
          </h2>
          <span className="text-[11px] text-slate-400">
            {claimedDayRewards.length} tiers unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SMOKE_FREE_DAY_TIERS.map(tier => {
            const isClaimed = claimedDayRewards.some(r => r.dayNumber === tier.dayNumber);
            const isUnlocked = stats.streakDays >= tier.dayNumber;

            return (
              <div
                key={tier.dayNumber}
                onClick={() => setSelectedTier(tier)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                  isClaimed
                    ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 shadow-sm'
                    : isUnlocked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 animate-pulse'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                      {tier.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span>{tier.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {tier.subtitle}
                      </div>
                    </div>
                  </div>

                  {isClaimed ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Claimed
                    </span>
                  ) : isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200">
                      Ready!
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Day {tier.dayNumber}
                    </span>
                  )}
                </div>

                <div className="mt-3 text-[11px] text-slate-600 dark:text-slate-300 line-clamp-1">
                  💡 {tier.suggestedCelebration}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Self-Reward Wishlist & Real-Life Treats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-emerald-500" />
              Self-Reward Vault (Saved Money Treats)
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Spend the {profile.currency}{stats.moneySaved.toFixed(0)} you saved on things that spark joy!
            </p>
          </div>
          <button
            onClick={() => setShowAddRewardModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Treat</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {selfRewards.map(reward => {
            const isAffordable = stats.moneySaved >= reward.cost && stats.streakDays >= reward.requiredDays;
            const progress = Math.min(100, Math.round((stats.moneySaved / reward.cost) * 100));

            return (
              <div
                key={reward.id}
                className={`p-4 rounded-2xl border transition-all ${
                  reward.isRedeemed
                    ? 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-75'
                    : isAffordable
                    ? 'bg-white dark:bg-slate-900 border-emerald-300 dark:border-emerald-700/60 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xl shrink-0">
                      {reward.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <span className={reward.isRedeemed ? 'line-through text-slate-400' : ''}>
                          {reward.title}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {profile.currency}{reward.cost} • Requires {reward.requiredDays} smoke-free {reward.requiredDays === 1 ? 'day' : 'days'}
                      </div>
                    </div>
                  </div>

                  <div>
                    {reward.isRedeemed ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <Check className="w-3 h-3" /> Enjoyed
                      </span>
                    ) : isAffordable ? (
                      <button
                        onClick={() => setRedeemNoteModal(reward)}
                        className="py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
                      >
                        Claim Treat!
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-slate-400">
                        {progress}% Saved
                      </span>
                    )}
                  </div>
                </div>

                {!reward.isRedeemed && (
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {reward.note && (
                  <div className="mt-2 text-[11px] text-emerald-700 dark:text-emerald-400 italic">
                    Note: "{reward.note}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shareable Smoke-Free Day Certificate Card */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Smoke-Free Certificate
            </span>
          </div>
          <span className="text-[10px] text-slate-400">Official Milestone</span>
        </div>

        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
          <div className="text-amber-300 text-xl font-bold">
            {stats.streakDays > 0 ? `${stats.streakDays} Days Clean` : 'Day 1 Commitment'}
          </div>
          <p className="text-xs text-slate-200">
            Awarded to <strong>{profile.name || 'Friend'}</strong> for choosing healthy lungs and freedom.
          </p>
          <div className="pt-2 flex justify-center gap-4 text-[11px] text-emerald-300 font-mono">
            <span>{stats.totalAvoided} Cigs Spared</span>
            <span>•</span>
            <span>{profile.currency}{stats.moneySaved.toFixed(0)} Saved</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareCertificate}
            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{certCopied ? 'Milestone Copied! 🎉' : 'Share Milestone'}</span>
          </button>
        </div>
      </div>

      {/* Modal: Tier Details */}
      {selectedTier && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedTier.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {selectedTier.title}
                  </h3>
                  <span className="text-[11px] text-slate-400">{selectedTier.subtitle}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedTier(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800/40">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 block mb-0.5">
                  🩺 Health Recovery Perk:
                </span>
                <p className="text-emerald-800 dark:text-emerald-300 leading-relaxed">
                  {selectedTier.healthPerk}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-800/40">
                <span className="font-bold text-amber-900 dark:text-amber-200 block mb-0.5">
                  🎉 Suggested Self-Reward Treat:
                </span>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                  {selectedTier.suggestedCelebration}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTier(null)}
              className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Modal: Add Custom Self-Reward */}
      {showAddRewardModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Wishlist Self-Reward
              </h3>
              <button
                onClick={() => setShowAddRewardModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRewardSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Treat Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. New Shoes, Gaming Headset, Spa Day"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Cost ({profile.currency})
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCost}
                    onChange={e => setNewCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                    Days Required
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newDays}
                    onChange={e => setNewDays(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-300 font-medium mb-1">
                  Choose Icon
                </label>
                <div className="flex gap-2 text-xl">
                  {['🎁', '☕', '🍿', '🎧', '🍽️', '✈️', '🎮', '👟'].map(emoji => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setNewIcon(emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                        newIcon === emoji
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950 scale-110'
                          : 'border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Save Reward
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRewardModal(false)}
                  className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Mark Self Reward as Enjoyed */}
      {redeemNoteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-5 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Claim Your Reward! 🎉
              </h3>
              <button
                onClick={() => setRedeemNoteModal(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center space-y-2 py-2">
              <span className="text-4xl">{redeemNoteModal.icon}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {redeemNoteModal.title}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                You earned this treat with {profile.currency}{redeemNoteModal.cost} saved from not smoking cigarettes!
              </p>
            </div>

            <div>
              <label className="block text-xs text-slate-600 dark:text-slate-300 font-medium mb-1">
                Celebration Reflection Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Tasted so amazing with my family!"
                value={redeemNote}
                onChange={e => setRedeemNote(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleConfirmRedeem}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
              >
                Confirm Enjoyed!
              </button>
              <button
                onClick={() => setRedeemNoteModal(null)}
                className="py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
