import React, { useState } from 'react';
import { UserProfile, Achievement, AchievementCategory } from '../types';
import { 
  getAchievementsWithProgress, 
  claimAchievementReward, 
  getUnclaimedAchievementsCount 
} from '../services/achievementService';
import { 
  Trophy, Award, Flame, CheckCircle2, Lock, Sparkles, 
  Gift, Filter, ChevronRight, X, Star, Zap, Info, ShieldCheck,
  TrendingUp, Compass, ArrowRight, Share2
} from 'lucide-react';
import { playSound } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface AchievementsDashboardProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigateToTab?: (tab: 'path' | 'questions' | 'simulado') => void;
}

export const AchievementsDashboard: React.FC<AchievementsDashboardProps> = ({
  profile,
  onUpdateProfile,
  onNavigateToTab,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [activeModalAchievement, setActiveModalAchievement] = useState<Achievement | null>(null);

  const achievements = getAchievementsWithProgress(profile);
  const unclaimedCount = getUnclaimedAchievementsCount(profile);
  const totalCount = achievements.length;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const completionPercent = Math.round((unlockedCount / totalCount) * 100);

  // Filtered list
  const filteredAchievements = achievements.filter((ach) => {
    if (selectedCategory !== 'all' && ach.category !== selectedCategory) {
      return false;
    }
    if (statusFilter === 'unlocked' && !ach.unlocked) return false;
    if (statusFilter === 'locked' && ach.unlocked) return false;
    return true;
  });

  // Calculate next closest achievement to complete
  const inProgressAchievements = achievements
    .filter((a) => !a.unlocked)
    .sort((a, b) => b.progressPercent - a.progressPercent);
  const nextTarget = inProgressAchievements[0];

  // Handler for claiming single achievement
  const handleClaim = (achId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    const { updatedProfile, achievement } = claimAchievementReward(profile, achId);
    if (achievement) {
      confetti({
        particleCount: 110,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#FFA41C', '#00A3E0', '#FFD700', '#10B981'],
      });
      playSound('levelup', profile.soundEnabled);
      onUpdateProfile(updatedProfile);

      // If active modal is open for this, update modal view
      if (activeModalAchievement?.id === achId) {
        setActiveModalAchievement({ ...achievement, claimed: true });
      }
    }
  };

  // Handler for Claiming All ready achievements
  const handleClaimAll = () => {
    const ready = achievements.filter((a) => a.unlocked && !a.claimed);
    if (ready.length === 0) return;

    let current = { ...profile };
    ready.forEach((ach) => {
      const res = claimAchievementReward(current, ach.id);
      current = res.updatedProfile;
    });

    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#FFA41C', '#00A3E0', '#FFD700', '#10B981', '#FFFFFF'],
    });
    playSound('levelup', profile.soundEnabled);
    onUpdateProfile(current);
  };

  const categories: { id: AchievementCategory; label: string; icon: string }[] = [
    { id: 'all', label: 'Todas', icon: '🏆' },
    { id: 'streak', label: 'Ofensiva & Foco', icon: '🔥' },
    { id: 'questions', label: 'Questões CEF', icon: '🎯' },
    { id: 'simulado', label: 'Simulados', icon: '⏱️' },
    { id: 'curriculum', label: 'Trilha & Aulas', icon: '📖' },
    { id: 'economy', label: 'Moedas & Check-in', icon: '🪙' },
  ];

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'master':
        return <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40">Mestre</span>;
      case 'diamond':
        return <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">Diamante</span>;
      case 'gold':
        return <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">Ouro</span>;
      case 'silver':
        return <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-400/20 text-slate-200 border border-slate-300/40">Prata</span>;
      default:
        return <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-700/20 text-amber-200 border border-amber-600/40">Bronze</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-28 pt-4 space-y-6 text-white safe-bottom">
      
      {/* Top Banner: Achievements Overview */}
      <div className="rounded-3xl bg-gradient-to-r from-[#003870] via-[#004d80] to-[#002447] border-2 border-amber-400/40 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#F39200]/15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Painel de Conquistas & Marcos CEF</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Galeria de Medalhas da Aprovação
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-xl mt-1 leading-relaxed">
              Alcance marcos históricos como <strong>10 dias de ofensiva</strong> e <strong>100 questões respondidas</strong> para acumular XP e CaixaCoins para a posse.
            </p>
          </div>

          {/* Quick Stats Pill Counters */}
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            {/* Unlocked Gauge */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md text-center min-w-[90px] sm:min-w-[110px]">
              <div className="text-xs text-sky-300 font-bold uppercase tracking-wider">
                Progresso
              </div>
              <div className="text-xl sm:text-2xl font-black text-[#FFA41C] mt-0.5">
                {unlockedCount}/{totalCount}
              </div>
              <span className="text-[10px] text-slate-300 font-semibold">
                {completionPercent}% Concluído
              </span>
            </div>

            {/* Total CaixaCoins */}
            <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 backdrop-blur-md text-center min-w-[90px] sm:min-w-[110px]">
              <div className="text-xs text-amber-300 font-bold uppercase tracking-wider">
                Saldo Moedas
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-300 mt-0.5 flex items-center justify-center gap-1">
                <span>🪙</span>
                <span>{profile.coins}</span>
              </div>
              <span className="text-[10px] text-slate-300 font-semibold">
                CaixaCoins
              </span>
            </div>

            {/* Unclaimed Alert CTA Button */}
            {unclaimedCount > 0 && (
              <button
                onClick={handleClaimAll}
                className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-gradient-to-r from-[#F39200] via-amber-400 to-[#FFA41C] text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 glow-orange animate-bounce"
              >
                <Gift className="w-4 h-4 text-slate-950" />
                <span>Resgatar Todas ({unclaimedCount})</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 w-full bg-[#00172E] h-3 rounded-full overflow-hidden border border-white/10 relative">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-[#F39200] to-emerald-400 rounded-full transition-all duration-700 shadow-sm"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Next Milestone Spotlight Banner */}
      {nextTarget && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#00284e] to-[#001d3d] border border-sky-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#003870] border-2 border-sky-400/50 flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
              {nextTarget.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-sky-300 px-2 py-0.5 rounded-full bg-sky-500/20 border border-sky-400/30">
                  Próximo Marco a Conquistar
                </span>
                {getTierBadge(nextTarget.tier)}
              </div>
              <h3 className="text-base font-black text-white mt-1">
                {nextTarget.title}
              </h3>
              <p className="text-xs text-sky-200 mt-0.5 max-w-xl">
                {nextTarget.description}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex flex-col sm:items-end gap-2">
            <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono font-bold">
              <span className="text-slate-300">Progresso:</span>
              <span className="text-[#FFA41C]">
                {nextTarget.currentValue} / {nextTarget.targetValue} ({nextTarget.progressPercent}%)
              </span>
            </div>

            <div className="w-full sm:w-48 bg-[#00172E] h-2 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-[#F39200] rounded-full transition-all duration-500"
                style={{ width: `${nextTarget.progressPercent}%` }}
              />
            </div>

            {onNavigateToTab && (
              <button
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  if (nextTarget.category === 'questions') onNavigateToTab('questions');
                  else if (nextTarget.category === 'simulado') onNavigateToTab('simulado');
                  else onNavigateToTab('path');
                }}
                className="text-xs font-bold text-[#FFA41C] hover:underline flex items-center gap-1 self-end mt-1 cursor-pointer"
              >
                <span>Avançar neste marco</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category and Status Filters */}
      <div className="space-y-3">
        {/* Category Pills (Horizontal Scroll on Mobile) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const countForCat = achievements.filter((a) => cat.id === 'all' || a.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  setSelectedCategory(cat.id);
                }}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition cursor-pointer shadow-sm ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#0066b2] to-[#004481] border-2 border-sky-400 text-white shadow-sky-500/20'
                    : 'bg-[#002244] border border-[#003870] text-slate-300 hover:text-white hover:border-slate-500'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-black/30 text-slate-400'
                }`}>
                  {countForCat}
                </span>
              </button>
            );
          })}
        </div>

        {/* Status Filter (Todas, Desbloqueadas, Em Progresso) */}
        <div className="flex items-center justify-between text-xs pt-1 px-1">
          <span className="text-slate-400 font-medium">
            Exibindo <strong>{filteredAchievements.length}</strong> de {totalCount} conquistas
          </span>

          <div className="flex items-center gap-1 bg-[#00172e] p-1 rounded-xl border border-white/5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                statusFilter === 'all' ? 'bg-[#004481] text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setStatusFilter('unlocked')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                statusFilter === 'unlocked' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Desbloqueadas ({unlockedCount})
            </button>
            <button
              onClick={() => setStatusFilter('locked')}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                statusFilter === 'locked' ? 'bg-sky-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Em Progresso ({totalCount - unlockedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Achievements Cards Grid (Fitted for Any Device: Mobile 1 col, Tablet 2 cols, Desktop 3/4 cols) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filteredAchievements.map((ach) => {
          const isReadyToClaim = ach.unlocked && !ach.claimed;
          const isClaimed = ach.unlocked && ach.claimed;
          const isLocked = !ach.unlocked;

          return (
            <div
              key={ach.id}
              onClick={() => {
                playSound('click', profile.soundEnabled);
                setActiveModalAchievement(ach);
              }}
              className={`relative rounded-3xl p-4 sm:p-5 border-2 transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-xl ${
                isReadyToClaim
                  ? 'bg-gradient-to-b from-[#003870] to-[#002244] border-[#F39200] glow-orange scale-[1.01]'
                  : isClaimed
                  ? 'bg-[#002244]/90 border-emerald-500/40 hover:border-emerald-400/60'
                  : 'bg-[#001d3d]/80 border-white/10 hover:border-sky-500/30 opacity-90'
              }`}
            >
              {/* Ready to claim pulsing badge */}
              {isReadyToClaim && (
                <div className="absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#F39200] to-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md animate-bounce flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-slate-950" />
                  <span>Resgatar!</span>
                </div>
              )}

              {/* Card Top: Icon, Tier, Category */}
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ach.badgeBg} border-2 ${ach.badgeBorder} flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 transition-transform relative`}>
                    <span>{ach.icon}</span>
                    {isClaimed && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    )}
                    {isLocked && (
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-black/60 text-slate-400 border border-white/20 flex items-center justify-center">
                        <Lock className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {getTierBadge(ach.tier)}
                    <span className="text-[10px] text-slate-400 font-bold uppercase">
                      {ach.category === 'streak' ? 'Ofensiva' : ach.category === 'questions' ? 'Questões' : ach.category === 'simulado' ? 'Simulado' : ach.category === 'curriculum' ? 'Trilha' : 'Caixa'}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className={`text-base font-black leading-snug ${isReadyToClaim ? 'text-amber-300' : 'text-white'}`}>
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {ach.description}
                </p>
              </div>

              {/* Card Bottom: Progress Bar & Rewards / Action */}
              <div className="pt-4 mt-3 border-t border-white/5 space-y-3">
                {/* Progress bar for locked */}
                {isLocked && (
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono font-bold">
                      <span className="text-slate-400">{ach.criteriaLabel}</span>
                      <span className="text-sky-300">
                        {ach.currentValue} / {ach.targetValue} ({ach.progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#00172e] h-2 rounded-full overflow-hidden border border-white/5">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-[#F39200] rounded-full transition-all duration-300"
                        style={{ width: `${ach.progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Claimed status */}
                {isClaimed && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Conquistada</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      +{ach.rewardXP} XP • +{ach.rewardCoins} 🪙
                    </span>
                  </div>
                )}

                {/* Ready to Claim Button */}
                {isReadyToClaim && (
                  <button
                    onClick={(e) => handleClaim(ach.id, e)}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#F39200] to-amber-500 hover:brightness-110 active:scale-95 text-slate-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer btn-duo-orange"
                  >
                    <Gift className="w-4 h-4 text-slate-950 animate-bounce" />
                    <span>Coletar (+{ach.rewardXP} XP • +{ach.rewardCoins} 🪙)</span>
                  </button>
                )}

                {/* Reward preview for locked */}
                {isLocked && (
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Recompensa:</span>
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <span>+{ach.rewardXP} XP</span>
                      <span>•</span>
                      <span>+{ach.rewardCoins} 🪙</span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Modal when tapping an achievement */}
      {activeModalAchievement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in zoom-in-95 duration-200">
          <div className="w-full max-w-md bg-gradient-to-b from-[#002b54] to-[#00172e] border-2 border-sky-400/50 rounded-3xl p-6 shadow-2xl text-white space-y-5 relative max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button
              onClick={() => setActiveModalAchievement(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Badge Spotlight */}
            <div className="text-center space-y-2 pt-2">
              <div className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${activeModalAchievement.badgeBg} border-4 ${activeModalAchievement.badgeBorder} flex items-center justify-center text-5xl shadow-2xl relative glow-orange`}>
                <span>{activeModalAchievement.icon}</span>
                {activeModalAchievement.claimed && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg border-2 border-[#002b54]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="flex items-center justify-center gap-2 mb-1">
                  {getTierBadge(activeModalAchievement.tier)}
                </div>
                <h2 className="text-xl font-black text-white">
                  {activeModalAchievement.title}
                </h2>
                <p className="text-xs text-sky-200 max-w-xs mx-auto mt-1">
                  {activeModalAchievement.description}
                </p>
              </div>
            </div>

            {/* Historical Lore / Motivational Context */}
            {activeModalAchievement.lore && (
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/10 text-xs text-slate-200 italic leading-relaxed">
                "{activeModalAchievement.lore}"
              </div>
            )}

            {/* Current Progress Gauge */}
            <div className="p-4 rounded-2xl bg-[#001d3d] border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Critério Exigido:</span>
                <span className="text-white">{activeModalAchievement.criteriaLabel}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-400">Progresso Atual:</span>
                <span className="text-[#FFA41C]">
                  {activeModalAchievement.currentValue} de {activeModalAchievement.targetValue} ({activeModalAchievement.progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-[#001222] h-2.5 rounded-full overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 to-[#F39200] rounded-full transition-all duration-500"
                  style={{ width: `${activeModalAchievement.progressPercent}%` }}
                />
              </div>
            </div>

            {/* Reward Box */}
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-between">
              <span className="text-xs font-bold text-amber-200">Recompensa da Conquista:</span>
              <div className="flex items-center gap-2 font-black text-sm text-[#FFA41C]">
                <span>+{activeModalAchievement.rewardXP} XP</span>
                <span>•</span>
                <span>+{activeModalAchievement.rewardCoins} 🪙</span>
              </div>
            </div>

            {/* Action Button */}
            {activeModalAchievement.unlocked && !activeModalAchievement.claimed ? (
              <button
                onClick={() => handleClaim(activeModalAchievement.id)}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F39200] to-amber-500 text-slate-950 font-black text-sm shadow-xl hover:brightness-110 active:scale-95 transition cursor-pointer btn-duo-orange flex items-center justify-center gap-2"
              >
                <Gift className="w-5 h-5 text-slate-950" />
                <span>Resgatar Recompensas Agora</span>
              </button>
            ) : activeModalAchievement.claimed ? (
              <div className="w-full py-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-center font-bold text-xs flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Conquista já Resgatada e Gravada no Perfil</span>
              </div>
            ) : (
              <button
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  setActiveModalAchievement(null);
                  if (onNavigateToTab) {
                    if (activeModalAchievement.category === 'questions') onNavigateToTab('questions');
                    else if (activeModalAchievement.category === 'simulado') onNavigateToTab('simulado');
                    else onNavigateToTab('path');
                  }
                }}
                className="w-full py-3 rounded-2xl bg-[#004481] hover:bg-[#005599] text-sky-200 font-bold text-xs shadow transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Treinar Agora para Conquistar</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
