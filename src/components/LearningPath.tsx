import React from 'react';
import { ModulePath, Lesson, UserProfile } from '../types';
import { Check, Lock, Star, Sparkles, BookOpen, Gift, Play, Flame, Calendar, Coins, ArrowRight, Shield } from 'lucide-react';
import { playSound } from '../services/soundEffects';
import { hasUserCheckedInToday, previewNextCheckIn, DAILY_CHECKIN_CYCLE, getRewardForStreak } from '../services/storageService';

interface LearningPathProps {
  modules: ModulePath[];
  profile: UserProfile;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenChest: () => void;
  onOpenCheckInModal: () => void;
  onClaimCheckIn: () => void;
  onOpenAchievements: () => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  modules,
  profile,
  onSelectLesson,
  onOpenChest,
  onOpenCheckInModal,
  onClaimCheckIn,
  onOpenAchievements,
}) => {
  const currentModule = modules[0]; // Active module
  const completedCount = profile.completedLessonIds.length;
  const totalLessons = currentModule.lessons.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  const isCheckedInToday = hasUserCheckedInToday(profile);
  const preview = previewNextCheckIn(profile);
  const currentStreak = profile.checkInStreak ?? profile.streak ?? 1;

  // Duolingo zig-zag horizontal offset pattern for the path
  const getOffsetClass = (index: number) => {
    const cycle = index % 4;
    if (cycle === 0) return 'translate-x-0';
    if (cycle === 1) return '-translate-x-12 sm:-translate-x-16';
    if (cycle === 2) return 'translate-x-0';
    return 'translate-x-12 sm:translate-x-16';
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-28 pt-4 space-y-4">
      {/* Daily Check-In Streak Bonus Card in Dashboard */}
      {!isCheckedInToday ? (
        <div className="rounded-3xl bg-gradient-to-br from-[#003366] via-[#00264d] to-[#00172e] p-5 border-2 border-amber-400/60 shadow-2xl relative overflow-hidden glow-orange animate-in fade-in">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-44 h-44 bg-[#F39200]/15 rounded-full blur-3xl -mr-14 -mt-14 pointer-events-none" />

          {/* Top Info Row */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F39200] to-amber-500 flex items-center justify-center text-xl shadow-md">
                🔥
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm sm:text-base font-black text-white">
                    Bônus Diário de Ofensiva
                  </h2>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 font-extrabold uppercase animate-pulse">
                    Disponível Hoje
                  </span>
                </div>
                <p className="text-xs text-sky-200">
                  {preview.isConsecutive
                    ? `Avance para o Dia ${preview.nextStreak} consecutivo e ganhe Moedas Caixa extras!`
                    : 'Faça login para manter sua sequência de concurseiro Caixa!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                playSound('click', profile.soundEnabled);
                onOpenCheckInModal();
              }}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:underline hidden sm:block whitespace-nowrap cursor-pointer"
            >
              Ver Ciclo →
            </button>
          </div>

          {/* 7-Day Cycle Mini Track */}
          <div className="grid grid-cols-7 gap-1.5 my-3 py-1">
            {DAILY_CHECKIN_CYCLE.map((cycleItem) => {
              const isPast = cycleItem.day < preview.dayInCycle;
              const isToday = cycleItem.day === preview.dayInCycle;
              const isFuture = cycleItem.day > preview.dayInCycle;

              return (
                <div
                  key={cycleItem.day}
                  onClick={() => {
                    playSound('click', profile.soundEnabled);
                    onOpenCheckInModal();
                  }}
                  className={`p-1.5 rounded-xl flex flex-col items-center justify-center text-center transition cursor-pointer ${
                    isToday
                      ? 'bg-gradient-to-b from-[#F39200]/30 to-amber-600/40 border-2 border-[#FFA41C] shadow-md scale-105 glow-orange'
                      : isPast
                      ? 'bg-emerald-950/30 border border-emerald-500/40 text-emerald-300'
                      : 'bg-black/20 border border-white/5 opacity-60'
                  }`}
                  title={`Dia ${cycleItem.day}: +${cycleItem.coins} Moedas Caixa`}
                >
                  <span className={`text-[9px] font-bold ${isToday ? 'text-[#FFA41C]' : 'text-slate-300'}`}>
                    D{cycleItem.day}
                  </span>
                  <div className="my-0.5 text-xs">
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                    ) : isToday ? (
                      <span>🪙</span>
                    ) : cycleItem.isSpecial ? (
                      <span>🏆</span>
                    ) : (
                      <Lock className="w-3 h-3 text-slate-400" />
                    )}
                  </div>
                  <span className="text-[9px] font-black text-amber-300">
                    +{cycleItem.coins}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Big Tactile 'Claim Reward' Button */}
          <button
            onClick={() => {
              playSound('levelup', profile.soundEnabled);
              onClaimCheckIn();
            }}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F39200] via-[#FFA41C] to-amber-500 text-slate-950 font-black text-sm sm:text-base shadow-xl hover:brightness-110 active:translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer btn-duo-orange"
          >
            <Gift className="w-5 h-5 text-slate-950 animate-bounce" />
            <span>Resgatar Recompensa (+{preview.rewardCoins} 🪙 e +{preview.rewardXP} XP)</span>
          </button>
        </div>
      ) : (
        /* Status Banner When Already Checked In Today */
        <div 
          onClick={() => {
            playSound('click', profile.soundEnabled);
            onOpenCheckInModal();
          }}
          className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-[#002b54] to-[#001f3f] p-3.5 border border-emerald-500/30 flex items-center justify-between shadow-md cursor-pointer hover:border-emerald-400/50 transition group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-white">
                  Ofensiva de {currentStreak} Dias Ativa! 🔥
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  Check-in Feito
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Recompensa diária coletada. Mantenha os estudos para garantir o edital!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-sky-300 group-hover:text-white transition">
            <span className="hidden sm:inline">Ver Ofensiva</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      )}

      {/* Daily Goal Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#003366] to-[#004d80] p-4 border border-sky-400/20 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F39200]/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
                Meta Diária: {profile.studiedMinutesToday} de {profile.dailyGoalMinutes} min
              </h2>
              <p className="text-xs text-sky-200">
                {profile.studiedMinutesToday >= profile.dailyGoalMinutes
                  ? '🎉 Parabéns! Meta de hoje batida. Continue para acumular mais XP!'
                  : `Faltam ${Math.max(0, profile.dailyGoalMinutes - profile.studiedMinutesToday)} minutos para garantir sua ofensiva de hoje!`}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-[#001f3f] h-2.5 rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-[#F39200] to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((profile.studiedMinutesToday / profile.dailyGoalMinutes) * 100))}%` }}
          />
        </div>
      </div>

      {/* Achievements Milestones Showcase Widget */}
      <div className="rounded-3xl bg-gradient-to-r from-[#00284e] via-[#003366] to-[#001e3b] p-4 sm:p-5 border border-sky-400/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
              🏆
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black text-white flex items-center gap-1.5">
                Marcos & Conquistas CEF
              </h3>
              <p className="text-[10px] sm:text-xs text-sky-200">
                Acompanhe seus marcos para a posse na Caixa
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onOpenAchievements();
            }}
            className="text-[11px] font-bold text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver Todas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Key Milestones Spotlight (10-day streak & 100 questions answered) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
          {/* Milestone 1: 10-Day Streak */}
          <div 
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onOpenAchievements();
            }}
            className="p-3 rounded-2xl bg-black/25 border border-white/5 hover:border-amber-400/30 transition cursor-pointer flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center text-lg flex-shrink-0">
              🔥
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="truncate text-white">Ofensiva de 10 Dias</span>
                <span className="text-[#FFA41C] font-mono">
                  {Math.min(10, currentStreak)}/10d
                </span>
              </div>
              <div className="w-full bg-[#00172e] h-1.5 rounded-full overflow-hidden mt-1.5 border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round((currentStreak / 10) * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Milestone 2: 100 Questions Answered */}
          {(() => {
            const answeredCount = Object.keys(profile.answeredQuestionIds || {}).length;
            const qPercent = Math.min(100, Math.round((answeredCount / 100) * 100));

            return (
              <div 
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  onOpenAchievements();
                }}
                className="p-3 rounded-2xl bg-black/25 border border-white/5 hover:border-sky-400/30 transition cursor-pointer flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center text-lg flex-shrink-0">
                  💯
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="truncate text-white">100 Questões Respondidas</span>
                    <span className="text-sky-300 font-mono">
                      {answeredCount}/100
                    </span>
                  </div>
                  <div className="w-full bg-[#00172e] h-1.5 rounded-full overflow-hidden mt-1.5 border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-400 to-[#F39200] rounded-full transition-all duration-500"
                      style={{ width: `${qPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Module Header Card (Duolingo Banner) */}
      <div className="rounded-3xl bg-[#002b54] border-2 border-[#005299] p-5 shadow-xl mb-10 text-white relative">
        <div className="flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004481] border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Edital CEF • Módulo 1</span>
            </div>
            <h1 className="text-xl font-black text-white leading-tight">
              {currentModule.title}
            </h1>
            <p className="text-xs text-sky-100 mt-1 max-w-sm">
              {currentModule.description}
            </p>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-xs font-bold text-sky-300">Progresso</span>
            <span className="text-2xl font-black text-[#F39200]">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* The Duolingo Serpentine Lesson Nodes */}
      <div className="flex flex-col items-center gap-8 py-4 relative">
        {/* Curving dashed connecting line */}
        <div className="absolute top-10 bottom-24 w-1 border-r-4 border-dashed border-[#003870] -z-0" />

        {currentModule.lessons.map((lesson, index) => {
          const isCompleted = profile.completedLessonIds.includes(lesson.id);
          const isCurrent = !isCompleted && (index === 0 || profile.completedLessonIds.includes(currentModule.lessons[index - 1]?.id));
          const isLocked = !isCompleted && !isCurrent;
          const offsetClass = getOffsetClass(index);

          return (
            <div
              key={lesson.id}
              className={`relative flex flex-col items-center transition-all duration-300 z-10 ${offsetClass}`}
            >
              {/* Floating Start speech bubble for the current active node */}
              {isCurrent && (
                <div className="absolute -top-10 bg-[#F39200] text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg border-2 border-white animate-bounce flex items-center gap-1 whitespace-nowrap">
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>COMEÇAR</span>
                </div>
              )}

              {/* Node Circular Button */}
              <button
                onClick={() => {
                  if (isLocked) {
                    playSound('wrong', profile.soundEnabled);
                  } else {
                    playSound('click', profile.soundEnabled);
                    onSelectLesson(lesson);
                  }
                }}
                disabled={isLocked}
                className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xl ${
                  isCompleted
                    ? 'bg-[#10B981] border-4 border-[#059669] text-white shadow-emerald-500/20 active:translate-y-1'
                    : isCurrent
                    ? 'bg-[#F39200] border-4 border-[#FFA41C] text-slate-950 shadow-orange-500/40 glow-orange scale-110 active:translate-y-1 ring-4 ring-orange-400/30 animate-pulse'
                    : 'bg-[#002244] border-4 border-[#003366] text-slate-500 cursor-not-allowed opacity-80'
                }`}
                title={lesson.title}
              >
                {isCompleted ? (
                  <Check className="w-9 h-9 stroke-[3]" />
                ) : isCurrent ? (
                  <span className="text-3xl">{lesson.icon}</span>
                ) : (
                  <Lock className="w-7 h-7" />
                )}

                {/* Subtitle badge or XP tag */}
                <div className="absolute -bottom-2 bg-[#001D3D] text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-400/30 text-sky-200 shadow whitespace-nowrap">
                  +{lesson.xpReward} XP
                </div>
              </button>

              {/* Lesson Title below node */}
              <div className="text-center mt-3 max-w-[150px]">
                <p className={`text-xs font-bold leading-snug ${isCurrent ? 'text-white' : isCompleted ? 'text-emerald-300' : 'text-slate-500'}`}>
                  {lesson.title}
                </p>
              </div>
            </div>
          );
        })}

        {/* Milestone Mystery Chest at the end of the module */}
        <div className="mt-6 flex flex-col items-center z-10">
          <button
            onClick={() => {
              playSound('coin', profile.soundEnabled);
              onOpenChest();
            }}
            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 to-[#F39200] border-4 border-amber-300 flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition cursor-pointer glow-orange"
            title="Baú de Recompensas CaixaMaster"
          >
            <Gift className="w-10 h-10 text-slate-950 animate-bounce" />
          </button>
          <span className="text-xs font-black text-amber-300 mt-2">
            Baú da Aprovação CEF
          </span>
          <span className="text-[11px] text-slate-400">
            Ganhe Moedas e Congelamento de Ofensiva
          </span>
        </div>
      </div>
    </div>
  );
};
