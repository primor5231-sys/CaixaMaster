export type SubjectId = 
  | 'bancarios'
  | 'portugues'
  | 'matematica'
  | 'estatistica'
  | 'direito_adm'
  | 'legislacao'
  | 'ti'
  | 'atendimento';

export interface Subject {
  id: SubjectId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  description: string;
  totalQuestions: number;
}

export interface Question {
  id: string;
  subjectId: SubjectId;
  topic: string;
  banca: 'Cesgranrio' | 'Cebraspe' | 'FGV' | 'FCC' | 'Caixa Inédita';
  year: number;
  statement: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  mnemonic?: string;
  legalBase?: string;
}

export interface LessonSlide {
  title: string;
  content: string;
  highlightBox?: string;
  mnemonic?: string;
}

export interface Lesson {
  id: string;
  subjectId: SubjectId;
  moduleIndex: number;
  nodeIndex: number;
  title: string;
  subtitle: string;
  icon: string;
  xpReward: number;
  coinsReward: number;
  slides: LessonSlide[];
  quizQuestions: Question[];
}

export interface ModulePath {
  id: string;
  subjectId: SubjectId;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface VideoLesson {
  id: string;
  subjectId: SubjectId;
  title: string;
  instructor: string;
  channel: string;
  duration: string;
  youtubeId: string;
  topic: string;
}

export interface DailyMicroTask {
  id: string;
  subjectId: SubjectId;
  subject: string;
  task: string;
  minutes: number;
  completed: boolean;
}

export interface Flashcard {
  id: string;
  subjectId: SubjectId;
  title: string;
  concept: string;
  mnemonic: string;
  details: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  targetRole: 'Técnico Bancário Novo - Geral' | 'Técnico Bancário Novo - TI';
  targetPolo: string;
  theme: 'dark' | 'light';
  dailyGoalMinutes: number; // e.g. 60 min
  studiedMinutesToday: number;
  xp: number;
  level: number;
  hearts: number;
  maxHearts: number;
  coins: number;
  streak: number;
  lastStudiedDate: string; // YYYY-MM-DD
  streakFreezeCount: number;
  answeredQuestionIds: Record<string, { selectedIndex: number; isCorrect: boolean; timestamp: number }>;
  completedLessonIds: string[];
  completedTaskIds: string[];
  unlockedModuleIndex: number;
  unlockedNodeIndex: number;
  soundEnabled: boolean;
  studyDays: string[]; // List of YYYY-MM-DD
  lastCheckInDate?: string; // YYYY-MM-DD of last claimed daily check-in
  checkInStreak?: number; // Consecutive check-in streak count
  claimedCheckInDays?: string[]; // History of claimed check-in dates
  claimedAchievementIds?: string[]; // Unlocked and claimed achievement IDs
  simuladosCompleted?: number; // Total full simulados completed
  tutorQuestionsAsked?: number; // Total queries sent to AI Tutor
}

export type AchievementCategory = 'all' | 'streak' | 'questions' | 'simulado' | 'curriculum' | 'economy';
export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'master';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;
  badgeBg: string;
  badgeBorder: string;
  targetValue: number;
  currentValue: number;
  progressPercent: number;
  rewardXP: number;
  rewardCoins: number;
  unlocked: boolean;
  claimed: boolean;
  criteriaLabel: string;
  lore?: string;
  unlockedAt?: string;
}

export interface DailyCheckInReward {
  day: number;
  coins: number;
  xp: number;
  title: string;
  isSpecial?: boolean;
}

export interface DailyCheckInResult {
  updatedProfile: UserProfile;
  rewardCoins: number;
  rewardXP: number;
  newStreak: number;
  streakProtectedWithFreeze: boolean;
  dayInCycle: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  targetRole: string;
  xp: number;
  streak: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: number;
  isFallback?: boolean;
}

export interface SimuladoConfig {
  title: string;
  timeLimitMinutes: number;
  questionCount: number;
  subjects: SubjectId[];
}
