import { UserProfile, DailyCheckInReward, DailyCheckInResult } from '../types';

const STORAGE_KEY = 'caixamaster_profile_v1';

export function getLocalTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getLocalYesterdayString(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 7-day progressive reward cycle for consecutive daily check-ins
export const DAILY_CHECKIN_CYCLE: DailyCheckInReward[] = [
  { day: 1, coins: 25, xp: 15, title: 'Início da Jornada CEF' },
  { day: 2, coins: 40, xp: 20, title: 'Ofensiva Ativa' },
  { day: 3, coins: 60, xp: 25, title: 'Foco no Edital' },
  { day: 4, coins: 85, xp: 35, title: 'Ritmo Concurseiro' },
  { day: 5, coins: 115, xp: 45, title: 'Super Mestre Caixa' },
  { day: 6, coins: 150, xp: 60, title: 'Reta Final Semanal' },
  { day: 7, coins: 220, xp: 100, title: 'Baú Lendário da Caixa 🏆', isSpecial: true },
];

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Concurseiro Caixa',
  avatar: '👨‍💼',
  targetRole: 'Técnico Bancário Novo - Geral',
  targetPolo: 'São Paulo - Polo Capital / Matriz',
  theme: 'dark',
  dailyGoalMinutes: 60,
  studiedMinutesToday: 35,
  xp: 320,
  level: 3,
  hearts: 5,
  maxHearts: 5,
  coins: 140,
  streak: 5,
  checkInStreak: 5,
  lastStudiedDate: getLocalTodayString(),
  lastCheckInDate: getLocalYesterdayString(), // yesterday, so user can claim today's bonus!
  claimedCheckInDays: [
    new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
  ],
  streakFreezeCount: 1,
  answeredQuestionIds: {
    'q_banc_1': { selectedIndex: 0, isCorrect: true, timestamp: Date.now() - 86400000 },
    'q_port_1': { selectedIndex: 1, isCorrect: true, timestamp: Date.now() - 43200000 },
    'q_mat_1': { selectedIndex: 2, isCorrect: false, timestamp: Date.now() - 20000000 },
  },
  completedLessonIds: ['mod1_lesson1', 'mod1_lesson2'],
  completedTaskIds: ['task_1'],
  unlockedModuleIndex: 0,
  unlockedNodeIndex: 2,
  soundEnabled: true,
  studyDays: [
    new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0],
  ],
  claimedAchievementIds: ['streak_1', 'q_1'],
  simuladosCompleted: 1,
  tutorQuestionsAsked: 1,
};

export function loadUserProfile(): UserProfile {
  if (typeof window === 'undefined') return DEFAULT_PROFILE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULT_PROFILE, ...parsed };

    // Ensure array properties exist
    if (!Array.isArray(merged.studyDays)) {
      merged.studyDays = DEFAULT_PROFILE.studyDays;
    }
    if (!Array.isArray(merged.completedLessonIds)) {
      merged.completedLessonIds = [];
    }
    if (!Array.isArray(merged.completedTaskIds)) {
      merged.completedTaskIds = [];
    }
    if (!Array.isArray(merged.claimedCheckInDays)) {
      merged.claimedCheckInDays = [];
    }
    if (!Array.isArray(merged.claimedAchievementIds)) {
      merged.claimedAchievementIds = ['streak_1', 'q_1'];
    }
    if (typeof merged.checkInStreak !== 'number') {
      merged.checkInStreak = merged.streak || 1;
    }
    if (typeof merged.simuladosCompleted !== 'number') {
      merged.simuladosCompleted = 1;
    }

    return merged;
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
    return DEFAULT_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

/**
 * Checks if the user has already claimed their daily check-in bonus today.
 */
export function hasUserCheckedInToday(profile: UserProfile): boolean {
  const todayStr = getLocalTodayString();
  return profile.lastCheckInDate === todayStr;
}

/**
 * Calculates what the streak reward will be for a given streak number.
 * Cycles every 7 days, granting an extra bonus for prolonged streaks (week 2+).
 */
export function getRewardForStreak(streak: number): {
  dayInCycle: number;
  reward: DailyCheckInReward;
  coins: number;
  xp: number;
  streakBonus: number;
} {
  const safeStreak = Math.max(1, streak);
  const dayInCycle = ((safeStreak - 1) % 7) + 1;
  const baseReward = DAILY_CHECKIN_CYCLE[dayInCycle - 1];

  // Extra bonus coins for maintaining streaks beyond 1 week (e.g. +20 per completed week, up to +150)
  const completedWeeks = Math.floor((safeStreak - 1) / 7);
  const streakBonus = Math.min(150, completedWeeks * 25);

  const totalCoins = baseReward.coins + streakBonus;
  const totalXP = baseReward.xp + Math.floor(streakBonus / 2);

  return {
    dayInCycle,
    reward: baseReward,
    coins: totalCoins,
    xp: totalXP,
    streakBonus,
  };
}

/**
 * Previews what streak the user will achieve if they check in today,
 * whether it's consecutive or if a streak freeze was needed.
 */
export function previewNextCheckIn(profile: UserProfile): {
  nextStreak: number;
  isConsecutive: boolean;
  streakProtectedWithFreeze: boolean;
  dayInCycle: number;
  rewardCoins: number;
  rewardXP: number;
  streakBonus: number;
} {
  const todayStr = getLocalTodayString();
  const yesterdayStr = getLocalYesterdayString();
  const currentStreak = profile.checkInStreak ?? profile.streak ?? 1;

  // If already checked in today, preview current
  if (profile.lastCheckInDate === todayStr) {
    const calc = getRewardForStreak(currentStreak);
    return {
      nextStreak: currentStreak,
      isConsecutive: true,
      streakProtectedWithFreeze: false,
      dayInCycle: calc.dayInCycle,
      rewardCoins: calc.coins,
      rewardXP: calc.xp,
      streakBonus: calc.streakBonus,
    };
  }

  let nextStreak = 1;
  let isConsecutive = false;
  let streakProtectedWithFreeze = false;

  if (profile.lastCheckInDate === yesterdayStr) {
    // Exact consecutive day
    nextStreak = currentStreak + 1;
    isConsecutive = true;
  } else if (!profile.lastCheckInDate) {
    // First time claiming, adopt current profile streak or start at 1
    nextStreak = currentStreak > 0 ? currentStreak : 1;
    isConsecutive = true;
  } else {
    // Missed one or more days! Check for Streak Freeze
    if (profile.streakFreezeCount > 0) {
      nextStreak = currentStreak + 1;
      isConsecutive = true;
      streakProtectedWithFreeze = true;
    } else {
      nextStreak = 1;
      isConsecutive = false;
    }
  }

  const calc = getRewardForStreak(nextStreak);

  return {
    nextStreak,
    isConsecutive,
    streakProtectedWithFreeze,
    dayInCycle: calc.dayInCycle,
    rewardCoins: calc.coins,
    rewardXP: calc.xp,
    streakBonus: calc.streakBonus,
  };
}

/**
 * Claims the daily check-in bonus, updating profile coins, XP, streak,
 * and saving the record to localStorage.
 */
export function claimDailyCheckInReward(profile: UserProfile): DailyCheckInResult {
  const todayStr = getLocalTodayString();

  // If already claimed today, return current state without granting duplicate
  if (profile.lastCheckInDate === todayStr) {
    const calc = getRewardForStreak(profile.checkInStreak || profile.streak || 1);
    return {
      updatedProfile: profile,
      rewardCoins: 0,
      rewardXP: 0,
      newStreak: profile.checkInStreak || profile.streak || 1,
      streakProtectedWithFreeze: false,
      dayInCycle: calc.dayInCycle,
    };
  }

  const preview = previewNextCheckIn(profile);
  const newCoins = profile.coins + preview.rewardCoins;
  const newXP = profile.xp + preview.rewardXP;
  const newLevel = Math.floor(newXP / 200) + 1;
  const newStreak = preview.nextStreak;

  const newClaimedDays = [...(profile.claimedCheckInDays || [])];
  if (!newClaimedDays.includes(todayStr)) {
    newClaimedDays.push(todayStr);
  }

  const newStudyDays = [...(profile.studyDays || [])];
  if (!newStudyDays.includes(todayStr)) {
    newStudyDays.push(todayStr);
  }

  const newStreakFreezeCount = preview.streakProtectedWithFreeze
    ? Math.max(0, profile.streakFreezeCount - 1)
    : profile.streakFreezeCount;

  const updatedProfile: UserProfile = {
    ...profile,
    coins: newCoins,
    xp: newXP,
    level: newLevel,
    streak: newStreak,
    checkInStreak: newStreak,
    lastCheckInDate: todayStr,
    lastStudiedDate: todayStr,
    claimedCheckInDays: newClaimedDays,
    studyDays: newStudyDays,
    streakFreezeCount: newStreakFreezeCount,
  };

  saveUserProfile(updatedProfile);

  return {
    updatedProfile,
    rewardCoins: preview.rewardCoins,
    rewardXP: preview.rewardXP,
    newStreak,
    streakProtectedWithFreeze: preview.streakProtectedWithFreeze,
    dayInCycle: preview.dayInCycle,
  };
}

export function addXP(profile: UserProfile, xpToAdd: number, coinsToAdd: number = 0): UserProfile {
  const newXP = profile.xp + xpToAdd;
  const newCoins = profile.coins + coinsToAdd;
  const newLevel = Math.floor(newXP / 200) + 1;
  const todayStr = getLocalTodayString();

  const newStudyDays = Array.isArray(profile.studyDays) ? [...profile.studyDays] : [];
  if (!newStudyDays.includes(todayStr)) {
    newStudyDays.push(todayStr);
  }

  const updated: UserProfile = {
    ...profile,
    xp: newXP,
    coins: newCoins,
    level: newLevel,
    lastStudiedDate: todayStr,
    studyDays: newStudyDays,
    studiedMinutesToday: profile.studiedMinutesToday + 5,
  };

  saveUserProfile(updated);
  return updated;
}

export function loseHeart(profile: UserProfile): UserProfile {
  const newHearts = Math.max(0, profile.hearts - 1);
  const updated = { ...profile, hearts: newHearts };
  saveUserProfile(updated);
  return updated;
}

export function refillHearts(profile: UserProfile): UserProfile {
  const updated = { ...profile, hearts: profile.maxHearts };
  saveUserProfile(updated);
  return updated;
}
