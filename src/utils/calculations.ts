import { UserProfile, CigaretteLog, CravingLog, HealthMilestone } from '../types';
import { HEALTH_MILESTONES } from '../data/healthMilestones';

export interface CalculatedStats {
  todaySmoked: number;
  todayAvoided: number;
  totalAvoided: number;
  totalSmokedSinceStart: number;
  streakDays: number;
  streakHours: number;
  streakMinutes: number;
  streakSeconds: number;
  streakTotalMinutes: number;
  moneySaved: number;
  baselineDailySpend: number;
  baselineWeeklySpend: number;
  baselineMonthlySpend: number;
  baselineYearlySpend: number;
  currentDailySpend: number;
  cravingsResistedCount: number;
  cravingsTotalCount: number;
  cravingSuccessRate: number;
  currentHealthMilestone: HealthMilestone;
  nextHealthMilestone: HealthMilestone | null;
  milestoneProgressPercent: number;
  quitDateDaysRemaining: number | null;
  daysSinceStart: number;
  level: number;
  xpInLevel: number;
  xpForNextLevel: number;
  patterns: {
    peakTime: string;
    peakTrigger: string;
    peakMood: string;
    peakLocation: string;
  };
}

export function calculateAllStats(
  profile: UserProfile,
  cigs: CigaretteLog[],
  cravings: CravingLog[],
  nowMs: number = Date.now()
): CalculatedStats {
  const pricePerCig = profile.packPrice / (profile.cigsPerPack || 20);

  // Today bounds
  const startOfToday = new Date(nowMs);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfTodayMs = startOfToday.getTime();

  // Cigarettes smoked today
  const todayLogs = cigs.filter(c => new Date(c.timestamp).getTime() >= startOfTodayMs);
  const todaySmoked = todayLogs.length;

  // Today avoided vs baseline
  const todayAvoided = Math.max(0, profile.baselinePerDay - todaySmoked);

  // Start date
  const startMs = new Date(profile.startDate).getTime();
  const diffDays = Math.max(1, (nowMs - startMs) / (1000 * 60 * 60 * 24));
  const expectedCigsBaseline = Math.round(diffDays * profile.baselinePerDay);

  // Cigarettes smoked since starting QuitTrack
  const cigsSinceStart = cigs.filter(c => new Date(c.timestamp).getTime() >= startMs).length;
  const totalAvoided = Math.max(0, expectedCigsBaseline - cigsSinceStart);

  // Current streak: calculated from lastSmokeDate
  const lastSmokeMs = profile.lastSmokeDate ? new Date(profile.lastSmokeDate).getTime() : startMs;
  const streakDiffMs = Math.max(0, nowMs - lastSmokeMs);

  const streakTotalMinutes = Math.floor(streakDiffMs / (1000 * 60));
  const streakDays = Math.floor(streakDiffMs / (1000 * 60 * 60 * 24));
  const streakHours = Math.floor((streakDiffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const streakMinutes = Math.floor((streakDiffMs % (1000 * 60 * 60)) / (1000 * 60));
  const streakSeconds = Math.floor((streakDiffMs % (1000 * 60)) / 1000);

  // Money saved = total avoided * pricePerCig
  const moneySaved = Number((totalAvoided * pricePerCig).toFixed(2));

  // Spending baselines
  const baselineDailySpend = Number((profile.baselinePerDay * pricePerCig).toFixed(2));
  const baselineWeeklySpend = Number((baselineDailySpend * 7).toFixed(2));
  const baselineMonthlySpend = Number((baselineDailySpend * 30.42).toFixed(2));
  const baselineYearlySpend = Number((baselineDailySpend * 365).toFixed(2));

  const currentDailySpend = Number((todaySmoked * pricePerCig).toFixed(2));

  // Cravings stats
  const cravingsResisted = cravings.filter(cr => cr.passed === 'yes' || cr.passed === 'little');
  const cravingsResistedCount = cravingsResisted.length;
  const cravingsTotalCount = cravings.length;
  const cravingSuccessRate = cravingsTotalCount > 0
    ? Math.round((cravingsResistedCount / cravingsTotalCount) * 100)
    : 100;

  // Health Milestones
  let currentMilestone = HEALTH_MILESTONES[0];
  let nextMilestone: HealthMilestone | null = null;
  let milestoneProgressPercent = 0;

  for (let i = 0; i < HEALTH_MILESTONES.length; i++) {
    const m = HEALTH_MILESTONES[i];
    if (streakTotalMinutes >= m.durationMinutes) {
      currentMilestone = m;
      nextMilestone = HEALTH_MILESTONES[i + 1] || null;
    } else {
      if (!nextMilestone) {
        nextMilestone = m;
      }
      break;
    }
  }

  if (nextMilestone) {
    const prevDuration = currentMilestone === nextMilestone ? 0 : currentMilestone.durationMinutes;
    const range = nextMilestone.durationMinutes - prevDuration;
    const progress = streakTotalMinutes - prevDuration;
    milestoneProgressPercent = Math.min(100, Math.max(0, Math.round((progress / range) * 100)));
  } else {
    milestoneProgressPercent = 100;
  }

  // Quit date countdown
  let quitDateDaysRemaining: number | null = null;
  if (profile.targetQuitDate) {
    const targetMs = new Date(profile.targetQuitDate).getTime();
    quitDateDaysRemaining = Math.max(0, Math.ceil((targetMs - nowMs) / (1000 * 60 * 60 * 24)));
  }

  // XP & Levels: 500 XP per level
  const totalXp = profile.xp || 0;
  const level = Math.floor(totalXp / 500) + 1;
  const xpInLevel = totalXp % 500;
  const xpForNextLevel = 500;

  // Pattern detection from all logs
  const hourCounts: { [key: number]: number } = {};
  const triggerCounts: { [key: string]: number } = {};
  const moodCounts: { [key: string]: number } = {};
  const locCounts: { [key: string]: number } = {};

  cigs.forEach(c => {
    const d = new Date(c.timestamp);
    const hr = d.getHours();
    hourCounts[hr] = (hourCounts[hr] || 0) + 1;
    if (c.trigger) triggerCounts[c.trigger] = (triggerCounts[c.trigger] || 0) + 1;
    if (c.mood) moodCounts[c.mood] = (moodCounts[c.mood] || 0) + 1;
    if (c.location) locCounts[c.location] = (locCounts[c.location] || 0) + 1;
  });

  // Find max hour
  let peakHour = 10;
  let maxHrCount = 0;
  Object.entries(hourCounts).forEach(([hrStr, count]) => {
    if (count > maxHrCount) {
      maxHrCount = count;
      peakHour = Number(hrStr);
    }
  });

  // Find max trigger
  let peakTrigger = profile.triggers[0] || 'Stress';
  let maxTrigCount = 0;
  Object.entries(triggerCounts).forEach(([trig, count]) => {
    if (count > maxTrigCount) {
      maxTrigCount = count;
      peakTrigger = trig;
    }
  });

  // Find max mood
  let peakMood = 'Stressed';
  let maxMoodCount = 0;
  Object.entries(moodCounts).forEach(([m, count]) => {
    if (count > maxMoodCount) {
      maxMoodCount = count;
      peakMood = m;
    }
  });

  // Find max location
  let peakLoc = 'Work';
  let maxLocCount = 0;
  Object.entries(locCounts).forEach(([l, count]) => {
    if (count > maxLocCount) {
      maxLocCount = count;
      peakLoc = l;
    }
  });

  const formattedPeakTime = `${peakHour % 12 || 12}:${peakHour < 12 ? '30 AM' : '30 PM'}`;

  return {
    todaySmoked,
    todayAvoided,
    totalAvoided,
    totalSmokedSinceStart: cigsSinceStart,
    streakDays,
    streakHours,
    streakMinutes,
    streakSeconds,
    streakTotalMinutes,
    moneySaved,
    baselineDailySpend,
    baselineWeeklySpend,
    baselineMonthlySpend,
    baselineYearlySpend,
    currentDailySpend,
    cravingsResistedCount,
    cravingsTotalCount,
    cravingSuccessRate,
    currentHealthMilestone: currentMilestone,
    nextHealthMilestone: nextMilestone,
    milestoneProgressPercent,
    quitDateDaysRemaining,
    daysSinceStart: Math.floor(diffDays),
    level,
    xpInLevel,
    xpForNextLevel,
    patterns: {
      peakTime: formattedPeakTime,
      peakTrigger,
      peakMood,
      peakLocation: peakLoc,
    },
  };
}
