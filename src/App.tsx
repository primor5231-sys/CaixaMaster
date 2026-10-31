import React, { useState, useEffect } from 'react';
import { UserProfile, Lesson, SubjectId } from './types';
import { loadUserProfile, saveUserProfile, addXP, loseHeart, refillHearts, claimDailyCheckInReward } from './services/storageService';
import { MODULE_PATHS } from './data/mockCurriculum';
import { Header } from './components/Header';
import { BottomNavigation, NavTab } from './components/BottomNavigation';
import { LearningPath } from './components/LearningPath';
import { LessonModal } from './components/LessonModal';
import { QuestionBank } from './components/QuestionBank';
import { SimuladoExam } from './components/SimuladoExam';
import { MnemonicFlashcards } from './components/MnemonicFlashcards';
import { AITutor } from './components/AITutor';
import { StudyMetrics } from './components/StudyMetrics';
import { Leaderboard } from './components/Leaderboard';
import { VideoCurator } from './components/VideoCurator';
import { ProfileModal } from './components/ProfileModal';
import { HeartsStoreModal } from './components/HeartsStoreModal';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { AchievementsDashboard } from './components/AchievementsDashboard';
import { getUnclaimedAchievementsCount } from './services/achievementService';
import { OfflineIndicator } from './components/OfflineIndicator';
import { playSound } from './services/soundEffects';
import confetti from 'canvas-confetti';
import { Sparkles, Gift } from 'lucide-react';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(() => loadUserProfile());
  const [currentTab, setCurrentTab] = useState<NavTab>('path');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [tutorInitialPrompt, setTutorInitialPrompt] = useState<string | undefined>(undefined);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHeartsStoreOpen, setIsHeartsStoreOpen] = useState(false);
  const [isChestModalOpen, setIsChestModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  // Sync profile changes to localStorage
  useEffect(() => {
    saveUserProfile(profile);
  }, [profile]);

  const isDark = profile.theme === 'dark';

  // Handler for updating partial profile
  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      saveUserProfile(next);
      return next;
    });
  };

  // Daily check-in streak bonus handler
  const handleClaimDailyCheckIn = () => {
    const result = claimDailyCheckInReward(profile);
    if (result.rewardCoins > 0) {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FFA41C', '#00A3E0', '#FFD700', '#10B981'],
      });
      setProfile(result.updatedProfile);
      playSound('levelup', profile.soundEnabled);
      setIsCheckInModalOpen(true);
    }
  };

  // Lesson completion handler
  const handleLessonComplete = (lessonId: string, earnedXP: number, earnedCoins: number) => {
    setProfile((prev) => {
      const completed = prev.completedLessonIds.includes(lessonId)
        ? prev.completedLessonIds
        : [...prev.completedLessonIds, lessonId];

      const updated = addXP(
        {
          ...prev,
          completedLessonIds: completed,
        },
        earnedXP,
        earnedCoins
      );
      return updated;
    });
  };

  // Answering question handler in QuestionBank
  const handleAnswerQuestion = (questionId: string, selectedIndex: number, isCorrect: boolean) => {
    setProfile((prev) => {
      const currentAnswers = { ...prev.answeredQuestionIds };
      currentAnswers[questionId] = {
        selectedIndex,
        isCorrect,
        timestamp: Date.now(),
      };

      if (isCorrect) {
        return addXP({ ...prev, answeredQuestionIds: currentAnswers }, 15, 5);
      } else {
        const afterHeart = loseHeart(prev);
        return {
          ...afterHeart,
          answeredQuestionIds: currentAnswers,
        };
      }
    });
  };

  // Direct ask AI Tutor from any question or lesson
  const handleAskAITutor = (prompt: string) => {
    setTutorInitialPrompt(prompt);
    setActiveLesson(null);
    setCurrentTab('tutor');
  };

  // Daily micro-task completion in StudyMetrics
  const handleCompleteTask = (taskId: string, earnedMinutes: number) => {
    setProfile((prev) => {
      const currentTasks = prev.completedTaskIds || [];
      const updatedTasks = currentTasks.includes(taskId)
        ? currentTasks.filter((id) => id !== taskId)
        : [...currentTasks, taskId];

      const updatedMinutes = currentTasks.includes(taskId)
        ? Math.max(0, prev.studiedMinutesToday - earnedMinutes)
        : prev.studiedMinutesToday + earnedMinutes;

      const updatedProfile = {
        ...prev,
        completedTaskIds: updatedTasks,
        studiedMinutesToday: updatedMinutes,
      };

      return addXP(updatedProfile, 25, 10);
    });
  };

  // Chest opener reward
  const handleOpenChest = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#FFA41C', '#00A3E0', '#FFD700', '#FFFFFF'],
    });
    setProfile((prev) => addXP(prev, 100, 50));
    setIsChestModalOpen(true);
  };

  // Start study task from daily planner in Metrics
  const handleStartStudyTask = (subjectId: SubjectId) => {
    setCurrentTab('questions');
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-[#F39200] selection:text-white ${
      isDark ? 'bg-[#001428] text-slate-100' : 'bg-[#F4F6F9] text-slate-900'
    }`}>
      {/* Top Header */}
      <Header
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHeartsStore={() => setIsHeartsStoreOpen(true)}
        onOpenCheckInModal={() => setIsCheckInModalOpen(true)}
        onOpenAchievements={() => setCurrentTab('achievements')}
      />

      {/* Main Content Area based on Tab */}
      <main className="flex-1 w-full">
        {currentTab === 'path' && (
          <LearningPath
            modules={MODULE_PATHS}
            profile={profile}
            onSelectLesson={(lesson) => setActiveLesson(lesson)}
            onOpenChest={handleOpenChest}
            onOpenCheckInModal={() => setIsCheckInModalOpen(true)}
            onClaimCheckIn={handleClaimDailyCheckIn}
            onOpenAchievements={() => setCurrentTab('achievements')}
          />
        )}

        {currentTab === 'questions' && (
          <QuestionBank
            profile={profile}
            onAnswerQuestion={handleAnswerQuestion}
            onAskAITutor={handleAskAITutor}
          />
        )}

        {currentTab === 'simulado' && (
          <SimuladoExam
            profile={profile}
            onFinishSimulado={(earnedXP, earnedCoins) => {
              setProfile((prev) => {
                const next = {
                  ...prev,
                  simuladosCompleted: (prev.simuladosCompleted || 0) + 1,
                };
                return addXP(next, earnedXP, earnedCoins);
              });
            }}
            onExit={() => setCurrentTab('path')}
          />
        )}

        {currentTab === 'achievements' && (
          <AchievementsDashboard
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'flashcards' && (
          <MnemonicFlashcards
            profile={profile}
            onRewardXP={(xp, coins) => {
              setProfile((prev) => addXP(prev, xp, coins));
            }}
          />
        )}

        {currentTab === 'tutor' && (
          <AITutor
            profile={profile}
            initialPrompt={tutorInitialPrompt}
          />
        )}

        {currentTab === 'metrics' && (
          <StudyMetrics
            profile={profile}
            onUpdateDailyGoal={(minutes) => handleUpdateProfile({ dailyGoalMinutes: minutes })}
            onStartStudyTask={handleStartStudyTask}
            onCompleteTask={handleCompleteTask}
          />
        )}

        {currentTab === 'ranking' && (
          <Leaderboard profile={profile} />
        )}
      </main>

      {/* Persistent Bottom Navigation */}
      <BottomNavigation
        currentTab={currentTab}
        onTabChange={(tab) => {
          setTutorInitialPrompt(undefined);
          setCurrentTab(tab);
        }}
        soundEnabled={profile.soundEnabled}
        unclaimedAchievementsCount={getUnclaimedAchievementsCount(profile)}
      />

      {/* Lesson Interactive Modal */}
      {activeLesson && (
        <LessonModal
          lesson={activeLesson}
          profile={profile}
          onClose={() => setActiveLesson(null)}
          onComplete={handleLessonComplete}
          onLoseHeart={() => setProfile((prev) => loseHeart(prev))}
          onAskTutor={handleAskAITutor}
        />
      )}

      {/* User Profile Modal */}
      {isProfileOpen && (
        <ProfileModal
          profile={profile}
          onClose={() => setIsProfileOpen(false)}
          onSave={handleUpdateProfile}
        />
      )}

      {/* Hearts and Streak Freeze Store Modal */}
      {isHeartsStoreOpen && (
        <HeartsStoreModal
          profile={profile}
          onClose={() => setIsHeartsStoreOpen(false)}
          onRefillHearts={() => {
            setProfile((prev) => {
              const updated = refillHearts({ ...prev, coins: prev.coins - 50 });
              return updated;
            });
            setIsHeartsStoreOpen(false);
          }}
          onBuyStreakFreeze={() => {
            setProfile((prev) => {
              const next = {
                ...prev,
                coins: prev.coins - 100,
                streakFreezeCount: prev.streakFreezeCount + 1,
              };
              saveUserProfile(next);
              return next;
            });
            setIsHeartsStoreOpen(false);
          }}
        />
      )}

      {/* Daily Check-In Streak Bonus Modal */}
      <DailyCheckInModal
        profile={profile}
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
        onClaim={handleClaimDailyCheckIn}
        onOpenHeartsStore={() => {
          setIsCheckInModalOpen(false);
          setIsHeartsStoreOpen(true);
        }}
      />

      {/* Mystery Chest Reward Modal */}
      {isChestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in zoom-in-95">
          <div className="w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#003366] to-[#001D3D] border-2 border-amber-400 p-6 text-center shadow-2xl text-white space-y-4 glow-orange">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-[#F39200] flex items-center justify-center text-4xl shadow-lg animate-bounce">
              🎁
            </div>
            <h3 className="text-xl font-black text-amber-300">
              Baú da Caixa Desbloqueado!
            </h3>
            <p className="text-xs text-slate-200">
              Você concluiu os desafios e ganhou recompensas exclusivas:
            </p>
            <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-sm font-bold">
                <span>XP de Conquista:</span>
                <span className="text-[#FFA41C]">+100 XP</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold">
                <span>Moedas Caixa:</span>
                <span className="text-amber-300">+50 🪙</span>
              </div>
            </div>
            <button
              onClick={() => {
                playSound('coin', profile.soundEnabled);
                setIsChestModalOpen(false);
              }}
              className="w-full py-3 rounded-2xl bg-[#F39200] text-slate-950 font-black text-sm shadow hover:bg-[#FFA41C] cursor-pointer"
            >
              Coletar Recompensas
            </button>
          </div>
        </div>
      )}

      {/* Offline Status Alert */}
      <OfflineIndicator />
    </div>
  );
}
