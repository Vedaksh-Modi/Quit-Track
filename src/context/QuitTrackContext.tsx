import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserProfile,
  CigaretteLog,
  CravingLog,
  RelapseRecord,
  CommunityPost,
  Badge,
  DailyChallenge,
  ClaimedDayReward,
  SelfRewardItem,
  DailyPledge,
} from '../types';
import {
  DEFAULT_USER_PROFILE,
  SEED_CIGARETTE_LOGS,
  SEED_CRAVING_LOGS,
  SEED_COMMUNITY_POSTS,
  DAILY_CHALLENGES,
} from '../data/defaultProfile';
import { INITIAL_BADGES } from '../data/initialBadges';
import { SMOKE_FREE_DAY_TIERS, DEFAULT_SELF_REWARDS } from '../data/rewardsData';
import { calculateAllStats, CalculatedStats } from '../utils/calculations';
import { playSuccessChime, playPopSound } from '../utils/audio';

const STORAGE_KEY_PREFIX = 'quittrack_v1_';

interface QuitTrackContextType {
  profile: UserProfile;
  cigs: CigaretteLog[];
  cravings: CravingLog[];
  badges: Badge[];
  challenges: DailyChallenge[];
  communityPosts: CommunityPost[];
  relapses: RelapseRecord[];
  stats: CalculatedStats;
  claimedDayRewards: ClaimedDayReward[];
  selfRewards: SelfRewardItem[];
  dailyPledges: DailyPledge[];
  rewardPoints: number;
  isTodayPledgeSigned: boolean;
  todayDateKey: string;
  emergencyActive: boolean;
  setEmergencyActive: (active: boolean) => void;
  relapseModalActive: boolean;
  setRelapseModalActive: (active: boolean) => void;
  quickLogModalActive: boolean;
  setQuickLogModalActive: (active: boolean) => void;
  activeTab: 'home' | 'track' | 'craving' | 'insights' | 'profile' | 'community' | 'coach' | 'money' | 'rewards';
  setActiveTab: (tab: 'home' | 'track' | 'craving' | 'insights' | 'profile' | 'community' | 'coach' | 'money' | 'rewards') => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  logCigarette: (entry?: Partial<Omit<CigaretteLog, 'id' | 'timestamp'>>) => void;
  logCraving: (entry: Omit<CravingLog, 'id' | 'timestamp'>) => void;
  resistCravingQuick: () => void;
  recoverFromSlip: (record: { trigger: string; reflection: string; futureStrategy: string }) => void;
  completeChallenge: (id: string) => void;
  claimDayReward: (dayNumber: number) => boolean;
  redeemSelfReward: (rewardId: string, note?: string) => void;
  addSelfReward: (reward: Omit<SelfRewardItem, 'id' | 'isRedeemed'>) => void;
  deleteSelfReward: (rewardId: string) => void;
  signDailyPledge: () => void;
  addCommunityPost: (post: { category: CommunityPost['category']; content: string }) => void;
  toggleCheerPost: (postId: string) => void;
  reportPost: (postId: string) => void;
  triggerConfetti: () => void;
  exportDataJson: () => string;
  importDataJson: (jsonString: string) => boolean;
  resetAllData: () => void;
}

const QuitTrackContext = createContext<QuitTrackContextType | undefined>(undefined);

export const QuitTrackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states from localStorage with safe defaults
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If it was the old seeded demo profile ("Alex"), reset to clean default
        if (parsed.name === 'Alex' && parsed.xp === 750) {
          return DEFAULT_USER_PROFILE;
        }
        return parsed;
      }
      return DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  const [cigs, setCigs] = useState<CigaretteLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'cigs');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If contains old fake seed IDs, return empty clean array
        if (Array.isArray(parsed) && parsed.some(c => c.id && c.id.startsWith('c_seed_'))) {
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [cravings, setCravings] = useState<CravingLog[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'cravings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(c => c.id && c.id.startsWith('cr_seed_'))) {
          return [];
        }
        return parsed;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'badges');
      return saved ? JSON.parse(saved) : INITIAL_BADGES;
    } catch {
      return INITIAL_BADGES;
    }
  });

  const [challenges, setChallenges] = useState<DailyChallenge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'challenges');
      return saved ? JSON.parse(saved) : DAILY_CHALLENGES;
    } catch {
      return DAILY_CHALLENGES;
    }
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'posts');
      return saved ? JSON.parse(saved) : SEED_COMMUNITY_POSTS;
    } catch {
      return SEED_COMMUNITY_POSTS;
    }
  });

  const [relapses, setRelapses] = useState<RelapseRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'relapses');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [claimedDayRewards, setClaimedDayRewards] = useState<ClaimedDayReward[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'claimed_rewards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selfRewards, setSelfRewards] = useState<SelfRewardItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'self_rewards');
      return saved ? JSON.parse(saved) : DEFAULT_SELF_REWARDS;
    } catch {
      return DEFAULT_SELF_REWARDS;
    }
  });

  const [dailyPledges, setDailyPledges] = useState<DailyPledge[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'daily_pledges');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'home' | 'track' | 'craving' | 'insights' | 'profile' | 'community' | 'coach' | 'money' | 'rewards'>('home');
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [relapseModalActive, setRelapseModalActive] = useState<boolean>(false);
  const [quickLogModalActive, setQuickLogModalActive] = useState<boolean>(false);
  const [currentTimeMs, setCurrentTimeMs] = useState<number>(Date.now());

  // Real-time ticking timer for streaks
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimeMs(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'cigs', JSON.stringify(cigs));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [cigs]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'cravings', JSON.stringify(cravings));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [cravings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'badges', JSON.stringify(badges));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [badges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'challenges', JSON.stringify(challenges));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [challenges]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'posts', JSON.stringify(communityPosts));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [communityPosts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'relapses', JSON.stringify(relapses));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [relapses]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'claimed_rewards', JSON.stringify(claimedDayRewards));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [claimedDayRewards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'self_rewards', JSON.stringify(selfRewards));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [selfRewards]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + 'daily_pledges', JSON.stringify(dailyPledges));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [dailyPledges]);

  // Dark mode effect on document body / html
  useEffect(() => {
    if (profile.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [profile.theme]);

  // Calculate stats
  const stats = useMemo(() => {
    return calculateAllStats(profile, cigs, cravings, currentTimeMs);
  }, [profile, cigs, cravings, currentTimeMs]);

  // Trigger celebration confetti
  const triggerConfetti = () => {
    if (!profile.celebrationsEnabled) return;
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#38BDF8', '#F59E0B', '#34D399'],
      });
      if (profile.soundEnabled) {
        playSuccessChime();
      }
    } catch (e) {
      // Ignore
    }
  };

  // Check and unlock badges based on progress
  useEffect(() => {
    let unlockedAny = false;
    const nowIso = new Date().toISOString();

    setBadges(prevBadges => {
      return prevBadges.map(b => {
        if (b.unlockedAt) return b;
        let shouldUnlock = false;

        if (b.id === 'first_day' && stats.streakDays >= 1) shouldUnlock = true;
        if (b.id === 'streak_3_days' && stats.streakDays >= 3) shouldUnlock = true;
        if (b.id === 'streak_1_week' && stats.streakDays >= 7) shouldUnlock = true;
        if (b.id === 'streak_2_weeks' && stats.streakDays >= 14) shouldUnlock = true;
        if (b.id === 'streak_1_month' && stats.streakDays >= 30) shouldUnlock = true;
        if (b.id === 'cigs_50_avoided' && stats.totalAvoided >= 50) shouldUnlock = true;
        if (b.id === 'cigs_100_avoided' && stats.totalAvoided >= 100) shouldUnlock = true;
        if (b.id === 'money_saved_first_tier' && stats.moneySaved >= 50) shouldUnlock = true;
        if (b.id === 'craving_survivor_5' && stats.cravingsResistedCount >= 5) shouldUnlock = true;

        if (shouldUnlock) {
          unlockedAny = true;
          return { ...b, unlockedAt: nowIso };
        }
        return b;
      });
    });

    if (unlockedAny) {
      triggerConfetti();
    }
  }, [stats.streakDays, stats.totalAvoided, stats.moneySaved, stats.cravingsResistedCount]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  // Log a cigarette
  const logCigarette = (entry?: Partial<Omit<CigaretteLog, 'id' | 'timestamp'>>) => {
    const nowIso = new Date().toISOString();
    const newLog: CigaretteLog = {
      id: 'c_' + Date.now(),
      timestamp: nowIso,
      trigger: entry?.trigger || profile.triggers[0] || 'Routine',
      mood: entry?.mood || 'Neutral',
      location: entry?.location || 'Home',
      cravingIntensity: entry?.cravingIntensity || 6,
      notes: entry?.notes || '',
    };

    setCigs(prev => [newLog, ...prev]);

    // If user has a streak longer than 12 hours, prompt Relapse Mode gently
    if (stats.streakTotalMinutes > 720) {
      setRelapseModalActive(true);
    }

    // Reset last smoke date to now
    setProfile(prev => ({
      ...prev,
      lastSmokeDate: nowIso,
    }));

    if (profile.soundEnabled) {
      playPopSound();
    }
  };

  // Log craving with feedback
  const logCraving = (entry: Omit<CravingLog, 'id' | 'timestamp'>) => {
    const newLog: CravingLog = {
      ...entry,
      id: 'cr_' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setCravings(prev => [newLog, ...prev]);

    const earnedXp = entry.passed === 'yes' ? 60 : 30;
    setProfile(prev => ({
      ...prev,
      xp: (prev.xp || 0) + earnedXp,
    }));

    if (entry.passed === 'yes') {
      triggerConfetti();
    }
  };

  // Quick 1-tap "I resisted"
  const resistCravingQuick = () => {
    const newLog: CravingLog = {
      id: 'cr_' + Date.now(),
      timestamp: new Date().toISOString(),
      intensity: 7,
      activityUsed: 'Quick Resistance',
      passed: 'yes',
      durationSeconds: 300,
    };
    setCravings(prev => [newLog, ...prev]);
    setProfile(prev => ({
      ...prev,
      xp: (prev.xp || 0) + 50,
    }));
    triggerConfetti();
  };

  // Recover from slip (Relapse Mode)
  const recoverFromSlip = (record: { trigger: string; reflection: string; futureStrategy: string }) => {
    const newRelapse: RelapseRecord = {
      id: 'relapse_' + Date.now(),
      timestamp: new Date().toISOString(),
      trigger: record.trigger,
      reflection: record.reflection,
      futureStrategy: record.futureStrategy,
      previousStreakDays: stats.streakDays,
    };
    setRelapses(prev => [newRelapse, ...prev]);

    // Give comeback badge if not yet unlocked
    setBadges(prev => prev.map(b => b.id === 'comeback_hero' ? { ...b, unlockedAt: new Date().toISOString() } : b));

    // Award encouragement XP
    setProfile(prev => ({
      ...prev,
      xp: (prev.xp || 0) + 100,
      lastSmokeDate: new Date().toISOString(),
    }));

    setRelapseModalActive(false);
    triggerConfetti();
  };

  const completeChallenge = (id: string) => {
    setChallenges(prev =>
      prev.map(c => {
        if (c.id === id && !c.completed) {
          setProfile(p => ({ ...p, xp: (p.xp || 0) + c.xp }));
          triggerConfetti();
          return { ...c, completed: true };
        }
        return c;
      })
    );
  };

  const addCommunityPost = (post: { category: CommunityPost['category']; content: string }) => {
    const streakLabel = stats.streakDays >= 1
      ? `${stats.streakDays} Days Smoke-Free`
      : `${stats.todayAvoided} Cigs Avoided Today`;

    const newPost: CommunityPost = {
      id: 'p_' + Date.now(),
      authorName: profile.name ? `${profile.name}_${Math.floor(Math.random() * 900 + 100)}` : `Breathe_${Math.floor(Math.random() * 900 + 100)}`,
      authorStreak: streakLabel,
      category: post.category,
      content: post.content,
      timestamp: 'Just now',
      cheers: 1,
      userCheered: true,
      reported: false,
    };

    setCommunityPosts(prev => [newPost, ...prev]);
    setProfile(p => ({ ...p, xp: (p.xp || 0) + 40 }));
    triggerConfetti();
  };

  const toggleCheerPost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const nextCheered = !p.userCheered;
          if (profile.soundEnabled) playPopSound();
          return {
            ...p,
            userCheered: nextCheered,
            cheers: nextCheered ? p.cheers + 1 : Math.max(0, p.cheers - 1),
          };
        }
        return p;
      })
    );
  };

  const reportPost = (postId: string) => {
    setCommunityPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, reported: true } : p))
    );
  };

  const todayDateKey = new Date().toISOString().split('T')[0];
  const isTodayPledgeSigned = dailyPledges.some(p => p.dateKey === todayDateKey);

  const rewardPoints = useMemo(() => {
    const pointsFromClaimed = claimedDayRewards.reduce((sum, r) => sum + r.pointsAwarded, 0);
    const pointsFromPledges = dailyPledges.length * 30;
    const pointsFromCravingsResisted = (stats.cravingsResistedCount || 0) * 50;
    return pointsFromClaimed + pointsFromPledges + pointsFromCravingsResisted;
  }, [claimedDayRewards, dailyPledges, stats.cravingsResistedCount]);

  const claimDayReward = (dayNumber: number): boolean => {
    const alreadyClaimed = claimedDayRewards.some(r => r.dayNumber === dayNumber);
    if (alreadyClaimed) return false;

    // Consecutive streak bonus multiplier: 1.0 up to 2.0x!
    const multiplier = 1.0 + Math.min(1.0, Math.floor(stats.streakDays / 7) * 0.25);
    const tier = SMOKE_FREE_DAY_TIERS.find(t => t.dayNumber === dayNumber);
    const basePoints = tier ? tier.points : Math.max(100, dayNumber * 100);
    const pointsAwarded = Math.round(basePoints * multiplier);

    const newClaim: ClaimedDayReward = {
      dayNumber,
      claimedAt: new Date().toISOString(),
      pointsAwarded,
      dateKey: todayDateKey,
    };

    setClaimedDayRewards(prev => [...prev, newClaim]);
    setProfile(p => ({ ...p, xp: (p.xp || 0) + pointsAwarded }));
    triggerConfetti();
    return true;
  };

  const redeemSelfReward = (rewardId: string, note?: string) => {
    setSelfRewards(prev =>
      prev.map(r =>
        r.id === rewardId
          ? { ...r, isRedeemed: true, redeemedAt: new Date().toISOString(), note }
          : r
      )
    );
    triggerConfetti();
  };

  const addSelfReward = (reward: Omit<SelfRewardItem, 'id' | 'isRedeemed'>) => {
    const newItem: SelfRewardItem = {
      ...reward,
      id: 'rew_' + Date.now(),
      isRedeemed: false,
    };
    setSelfRewards(prev => [newItem, ...prev]);
    if (profile.soundEnabled) playPopSound();
  };

  const deleteSelfReward = (rewardId: string) => {
    setSelfRewards(prev => prev.filter(r => r.id !== rewardId));
  };

  const signDailyPledge = () => {
    if (isTodayPledgeSigned) return;
    const newPledge: DailyPledge = {
      dateKey: todayDateKey,
      signedAt: new Date().toISOString(),
      affirmation: 'I commit to staying smoke-free today, honoring my body and future.',
    };
    setDailyPledges(prev => [newPledge, ...prev]);
    setProfile(p => ({ ...p, xp: (p.xp || 0) + 30 }));
    triggerConfetti();
  };

  const exportDataJson = () => {
    const exportBundle = {
      app: 'QuitTrack',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      profile,
      cigs,
      cravings,
      relapses,
      badges,
      challenges,
      claimedDayRewards,
      selfRewards,
      dailyPledges,
    };
    return JSON.stringify(exportBundle, null, 2);
  };

  const importDataJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.profile) setProfile(data.profile);
      if (Array.isArray(data.cigs)) setCigs(data.cigs);
      if (Array.isArray(data.cravings)) setCravings(data.cravings);
      if (Array.isArray(data.relapses)) setRelapses(data.relapses);
      if (Array.isArray(data.badges)) setBadges(data.badges);
      if (Array.isArray(data.challenges)) setChallenges(data.challenges);
      if (Array.isArray(data.claimedDayRewards)) setClaimedDayRewards(data.claimedDayRewards);
      if (Array.isArray(data.selfRewards)) setSelfRewards(data.selfRewards);
      if (Array.isArray(data.dailyPledges)) setDailyPledges(data.dailyPledges);
      triggerConfetti();
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  };

  const resetAllData = () => {
    setProfile({
      ...DEFAULT_USER_PROFILE,
      startDate: new Date().toISOString(),
      lastSmokeDate: new Date().toISOString(),
      xp: 0,
      onboardingCompleted: false,
    });
    setCigs([]);
    setCravings([]);
    setRelapses([]);
    setBadges(INITIAL_BADGES);
    setChallenges(DAILY_CHALLENGES);
    setClaimedDayRewards([]);
    setSelfRewards(DEFAULT_SELF_REWARDS);
    setDailyPledges([]);
    try {
      localStorage.clear();
    } catch {}
  };

  return (
    <QuitTrackContext.Provider
      value={{
        profile,
        cigs,
        cravings,
        badges,
        challenges,
        communityPosts,
        relapses,
        stats,
        claimedDayRewards,
        selfRewards,
        dailyPledges,
        rewardPoints,
        isTodayPledgeSigned,
        todayDateKey,
        emergencyActive,
        setEmergencyActive,
        relapseModalActive,
        setRelapseModalActive,
        quickLogModalActive,
        setQuickLogModalActive,
        activeTab,
        setActiveTab,
        updateProfile,
        logCigarette,
        logCraving,
        resistCravingQuick,
        recoverFromSlip,
        completeChallenge,
        claimDayReward,
        redeemSelfReward,
        addSelfReward,
        deleteSelfReward,
        signDailyPledge,
        addCommunityPost,
        toggleCheerPost,
        reportPost,
        triggerConfetti,
        exportDataJson,
        importDataJson,
        resetAllData,
      }}
    >
      {children}
    </QuitTrackContext.Provider>
  );
};

export const useQuitTrack = () => {
  const context = useContext(QuitTrackContext);
  if (!context) {
    throw new Error('useQuitTrack must be used within a QuitTrackProvider');
  }
  return context;
};
