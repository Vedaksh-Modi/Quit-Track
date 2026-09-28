export type GoalType = 'quit' | 'reduce' | 'track';

export interface TrustedContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
}

export interface SavingsGoal {
  name: string;
  targetAmount: number;
  icon: string;
}

export interface NotificationSettings {
  morningMotivation: boolean;
  cravingRiskAlerts: boolean;
  dailyProgressReminder: boolean;
  savingsUpdate: boolean;
  milestoneCelebration: boolean;
  eveningReflection: boolean;
}

export interface PrivacySettings {
  guestMode: boolean;
  anonymousAccount: boolean;
  localOnly: boolean;
  analyticsSharing: boolean;
}

export interface UserProfile {
  name: string;
  ageConfirmed: boolean;
  baselinePerDay: number;
  packPrice: number;
  cigsPerPack: number;
  currency: string;
  yearsSmoking: number;
  typicalTimes: string[];
  triggers: string[];
  goal: GoalType;
  targetQuitDate: string; // ISO date YYYY-MM-DD
  dailyTarget: number;
  startDate: string; // ISO datetime
  lastSmokeDate: string; // ISO datetime for current smoke-free streak
  reasonsToQuit: string[];
  trustedContacts: TrustedContact[];
  savingsGoal: SavingsGoal;
  notifications: NotificationSettings;
  privacySettings: PrivacySettings;
  onboardingCompleted: boolean;
  isPremium: boolean;
  soundEnabled: boolean;
  celebrationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
  xp: number;
}

export interface CigaretteLog {
  id: string;
  timestamp: string; // ISO string
  trigger: string;
  mood: string;
  location: string;
  cravingIntensity: number; // 1-10
  notes: string;
}

export interface CravingLog {
  id: string;
  timestamp: string;
  intensity: number;
  activityUsed: string;
  passed: 'yes' | 'little' | 'no';
  durationSeconds: number;
}

export interface RelapseRecord {
  id: string;
  timestamp: string;
  trigger: string;
  reflection: string;
  futureStrategy: string;
  previousStreakDays: number;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorStreak: string;
  category: 'milestone' | 'craving' | 'strategy' | 'question';
  content: string;
  timestamp: string;
  cheers: number;
  userCheered: boolean;
  reported: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  category: 'streak' | 'reduction' | 'savings' | 'mindset';
  xp: number;
}

export interface HealthMilestone {
  id: string;
  title: string;
  durationMinutes: number; // minutes since last cigarette
  timeLabel: string;
  description: string;
  category: 'circulation' | 'lungs' | 'heart' | 'sensory' | 'long-term';
  source: string;
  sourceUrl: string;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  xp: number;
  completed: boolean;
  category: 'craving' | 'mindset' | 'routine';
}

export interface SmokeFreeDayTier {
  dayNumber: number;
  title: string;
  subtitle: string;
  points: number;
  icon: string;
  healthPerk: string;
  suggestedCelebration: string;
}

export interface ClaimedDayReward {
  dayNumber: number;
  claimedAt: string; // ISO string
  pointsAwarded: number;
  dateKey: string; // YYYY-MM-DD
}

export interface SelfRewardItem {
  id: string;
  title: string;
  cost: number;
  requiredDays: number;
  icon: string;
  category: 'treat' | 'experience' | 'wellness' | 'hobby';
  isRedeemed: boolean;
  redeemedAt?: string;
  note?: string;
}

export interface DailyPledge {
  dateKey: string; // YYYY-MM-DD
  signedAt: string;
  affirmation: string;
}
