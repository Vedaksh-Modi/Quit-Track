import { UserProfile, CigaretteLog, CravingLog, CommunityPost, DailyChallenge } from '../types';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: '',
  ageConfirmed: false,
  baselinePerDay: 10,
  packPrice: 10,
  cigsPerPack: 20,
  currency: '$',
  yearsSmoking: 3,
  typicalTimes: ['Morning routine', 'After meals', 'Evening'],
  triggers: ['Stress', 'After meals', 'Work/study'],
  goal: 'quit',
  targetQuitDate: '',
  dailyTarget: 0,
  startDate: new Date().toISOString(),
  lastSmokeDate: new Date().toISOString(),
  reasonsToQuit: [
    'Clean lungs and easier breathing',
    'Protect my family and health',
    'Save my hard-earned money',
    'Reclaim my freedom from nicotine',
  ],
  trustedContacts: [],
  savingsGoal: {
    name: 'My Personal Reward',
    targetAmount: 250,
    icon: 'Target',
  },
  notifications: {
    morningMotivation: true,
    cravingRiskAlerts: true,
    dailyProgressReminder: true,
    savingsUpdate: true,
    milestoneCelebration: true,
    eveningReflection: true,
  },
  privacySettings: {
    guestMode: true,
    anonymousAccount: true,
    localOnly: true,
    analyticsSharing: false,
  },
  onboardingCompleted: false, // Fresh clean onboarding for real user
  isPremium: false,
  soundEnabled: true,
  celebrationsEnabled: true,
  theme: 'light',
  xp: 0,
};

// Start with completely pristine, empty user logs (no fake logs)
export const SEED_CIGARETTE_LOGS: CigaretteLog[] = [];

export const SEED_CRAVING_LOGS: CravingLog[] = [];

// Helpful, community moderation tips from anonymous quitters without fake phone numbers
export const SEED_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'p1',
    authorName: 'CleanLungs',
    authorStreak: 'Smoke-Free',
    category: 'strategy',
    content: "Tip that helped me get through day 1: keeping cold ice water and cinnamon sticks at my desk. Breaking the hand-to-mouth habit without inhaling smoke makes a huge difference.",
    timestamp: 'Today',
    cheers: 12,
    userCheered: false,
    reported: false,
  },
  {
    id: 'p2',
    authorName: 'BreatheDeep',
    authorStreak: 'Smoke-Free',
    category: 'milestone',
    content: "Cravings truly only last 3 to 5 minutes. The 5-minute timer in the Craving Coach is the best trick. Delaying the decision gets you through the urge every time!",
    timestamp: 'Yesterday',
    cheers: 18,
    userCheered: false,
    reported: false,
  },
  {
    id: 'p3',
    authorName: 'MindfulStep',
    authorStreak: 'Reducing daily',
    category: 'question',
    content: "How does everyone handle morning routine triggers? Brushing teeth immediately after waking up helped me a lot!",
    timestamp: '2 days ago',
    cheers: 9,
    userCheered: false,
    reported: false,
  },
];

export const DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'ch_1',
    title: 'Morning Delay',
    description: 'Wait at least 30 minutes after waking up before giving in to any cigarette or urge.',
    xp: 50,
    completed: false,
    category: 'routine',
  },
  {
    id: 'ch_2',
    title: 'Hydration Anchor',
    description: 'Drink a full tall glass of ice water whenever an urge strikes.',
    xp: 50,
    completed: false,
    category: 'craving',
  },
  {
    id: 'ch_3',
    title: 'Zen Breath Protocol',
    description: 'Complete one 4-4-4-4 breathing session in the Craving Coach.',
    xp: 75,
    completed: false,
    category: 'mindset',
  },
  {
    id: 'ch_4',
    title: 'Trigger Detective',
    description: 'Note what feeling or environment triggered you when you feel a craving.',
    xp: 50,
    completed: false,
    category: 'routine',
  },
];
