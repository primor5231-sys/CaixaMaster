import React from 'react';
import { UserProfile } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { 
  Flame, Heart, Volume2, VolumeX, Sparkles, Plus, Award, 
  Sun, Moon, Target, Check, Clock, Zap, Gift, Trophy 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { playSound } from '../services/soundEffects';
import { hasUserCheckedInToday } from '../services/storageService';

interface HeaderProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenProfile: () => void;
  onOpenHeartsStore: () => void;
  onOpenCheckInModal: () => void;
  onOpenAchievements?: () => void;
}

interface AnimatedCircularProgressProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  color: string;
  trackColor?: string;
  glowColor?: string;
  icon: React.ReactNode;
}

const AnimatedCircularProgress: React.FC<AnimatedCircularProgressProps> = ({
  percentage,
  size = 36,
  strokeWidth = 3.5,
  color,
  trackColor = 'rgba(255, 255, 255, 0.1)',
  glowColor,
  icon,
}) => {
  const clamped = Math.min(100, Math.max(0, percentage));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        className="transform -rotate-90 overflow-visible"
      >
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Animated Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          style={{
            filter: glowColor ? `drop-shadow(0 0 3px ${glowColor})` : undefined,
          }}
        />
      </svg>
      {/* Centered content/icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        {icon}
      </div>
    </div>
  );
};

export const Header: React.FC<HeaderProps> = ({
  profile,
  onUpdateProfile,
  onOpenProfile,
  onOpenHeartsStore,
  onOpenCheckInModal,
  onOpenAchievements,
}) => {
  const toggleSound = () => {
    const next = !profile.soundEnabled;
    onUpdateProfile({ soundEnabled: next });
    if (next) playSound('click', true);
  };

  // XP calculations (200 XP per level)
  const xpProgress = profile.xp % 200;
  const xpPercent = Math.min(100, Math.round((xpProgress / 200) * 100));

  // Daily goal calculation
  const goalPercent = Math.min(100, Math.round((profile.studiedMinutesToday / Math.max(1, profile.dailyGoalMinutes)) * 100));
  const isGoalCompleted = profile.studiedMinutesToday >= profile.dailyGoalMinutes;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#001D3D]/95 backdrop-blur-md border-b border-[#003870] safe-top px-3 sm:px-4 py-2">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Caixa Brand Identity */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={onOpenProfile}>
            <div className="relative w-9 h-9 rounded-xl bg-[#004481] border border-sky-400/30 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform overflow-hidden">
              {/* Stylized CEF X ribbons */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-1.5 bg-[#00A3E0] rotate-45 transform origin-center rounded-full" />
                <div className="w-6 h-1.5 bg-[#F39200] -rotate-45 transform origin-center rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-0.5">
                  CAIXA<span className="text-[#F39200]">MASTER</span>
                </span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#004481] text-sky-300 border border-sky-500/20 uppercase tracking-widest hidden sm:inline-block">
                  PWA
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block truncate max-w-[170px]">
                {profile.targetRole.includes('TI') ? 'Técnico TI' : 'Técnico Bancário'}
              </p>
            </div>
          </div>
        </div>

        {/* Gamification Stats Bar (Duolingo Style with Animated Circular Rings) */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          
          {/* Animated Circular Progress: Daily Goal Completion */}
          <div 
            className={`flex items-center gap-2 px-2.5 py-1 rounded-2xl border transition-all cursor-pointer ${
              isGoalCompleted 
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/20' 
                : 'bg-[#00284e]/90 border-sky-500/20 text-slate-200'
            }`}
            onClick={onOpenProfile}
            title={`Meta Diária: ${profile.studiedMinutesToday} de ${profile.dailyGoalMinutes} min (${goalPercent}%)`}
          >
            <AnimatedCircularProgress
              percentage={goalPercent}
              size={32}
              strokeWidth={3}
              color={isGoalCompleted ? '#10B981' : '#F39200'}
              glowColor={isGoalCompleted ? 'rgba(16, 185, 129, 0.4)' : 'rgba(243, 146, 0, 0.3)'}
              trackColor={isGoalCompleted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.15)'}
              icon={
                isGoalCompleted ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
                ) : (
                  <Target className="w-3.5 h-3.5 text-[#FFA41C]" />
                )
              }
            />
            <div className="hidden xs:block text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-[11px] font-extrabold text-white">
                  {profile.studiedMinutesToday}
                  <span className="text-slate-400 font-normal">/{profile.dailyGoalMinutes}m</span>
                </span>
              </div>
              <span className={`text-[9px] font-bold block mt-0.5 ${isGoalCompleted ? 'text-emerald-400' : 'text-slate-400'}`}>
                {isGoalCompleted ? 'Meta Batida!' : `${goalPercent}% da Meta`}
              </span>
            </div>
          </div>

          {/* Animated Circular Progress: Daily XP & Level Progression */}
          <div 
            className="flex items-center gap-2 px-2.5 py-1 rounded-2xl bg-[#00284e]/90 border border-sky-500/20 text-slate-200 hover:border-sky-400/40 transition-all cursor-pointer"
            onClick={onOpenProfile}
            title={`Nível ${profile.level}: ${xpProgress}/200 XP para o Nível ${profile.level + 1} (${xpPercent}%)`}
          >
            <AnimatedCircularProgress
              percentage={xpPercent}
              size={32}
              strokeWidth={3}
              color="#00A3E0"
              glowColor="rgba(0, 163, 224, 0.4)"
              trackColor="rgba(255, 255, 255, 0.15)"
              icon={<Award className="w-3.5 h-3.5 text-sky-300" />}
            />
            <div className="hidden sm:block text-left">
              <div className="flex items-center gap-1 leading-none">
                <span className="text-[11px] font-extrabold text-sky-300">
                  Nv. {profile.level}
                </span>
                <span className="text-[10px] text-[#FFA41C] font-bold">
                  ({profile.xp} XP)
                </span>
              </div>
              <span className="text-[9px] text-slate-400 font-semibold block mt-0.5">
                {xpProgress}/200 XP ({xpPercent}%)
              </span>
            </div>
          </div>

          {/* Streaks / Ofensiva - Clickable with Daily Check-In Indicator */}
          <button 
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onOpenCheckInModal();
            }}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-2xl border text-xs font-bold shadow-sm transition cursor-pointer relative ${
              !hasUserCheckedInToday(profile)
                ? 'bg-gradient-to-r from-orange-500/25 to-amber-500/30 border-orange-400 text-orange-300 ring-2 ring-orange-500/30 animate-pulse'
                : 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20'
            }`}
            title={`${profile.checkInStreak || profile.streak} dias consecutivos! ${!hasUserCheckedInToday(profile) ? 'Bônus diário pronto para resgatar!' : 'Check-in de hoje resgatado.'}`}
          >
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-pulse" />
            <span>{profile.checkInStreak || profile.streak}</span>
            {!hasUserCheckedInToday(profile) && (
              <span className="w-2 h-2 rounded-full bg-[#F39200] animate-ping" />
            )}
          </button>

          {/* Vidas / Hearts */}
          <button
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onOpenHeartsStore();
            }}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold hover:bg-rose-500/20 transition cursor-pointer"
            title="Vidas para simulados. Clique para recarregar."
          >
            <Heart className={`w-4 h-4 text-rose-500 ${profile.hearts > 0 ? 'fill-rose-500' : ''}`} />
            <span>{profile.hearts}</span>
            {profile.hearts < profile.maxHearts && (
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-black ml-0.5">
                +
              </span>
            )}
          </button>

          {/* Moedas Caixa / Coins */}
          <div 
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-bold"
            title="CaixaCoins ganhas ao acertar questões e completar módulos"
          >
            <span className="text-xs">🪙</span>
            <span>{profile.coins}</span>
          </div>

          {/* Conquistas & Medalhas Trophy Button */}
          {onOpenAchievements && (
            <button
              onClick={() => {
                playSound('click', profile.soundEnabled);
                onOpenAchievements();
              }}
              className="p-1.5 sm:p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/20 transition cursor-pointer flex items-center justify-center shadow-sm"
              title="Galeria de Conquistas & Medalhas da Aprovação"
            >
              <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title={profile.soundEnabled ? 'Silenciar Efeitos Sonoros' : 'Ativar Efeitos Sonoros'}
          >
            {profile.soundEnabled ? <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-400" /> : <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500" />}
          </button>

          {/* Theme Toggle (Modo Leitura Claro #F4F6F9 vs Modo Neofuturista Escuro) */}
          <button
            onClick={() => {
              const next = profile.theme === 'dark' ? 'light' : 'dark';
              onUpdateProfile({ theme: next });
              playSound('click', profile.soundEnabled);
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition cursor-pointer"
            title={profile.theme === 'dark' ? 'Ativar Modo Leitura Confortável (Claro #F4F6F9)' : 'Ativar Modo Neofuturista (Escuro)'}
          >
            {profile.theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FFA41C]" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300" />}
          </button>

          {/* PWA Install */}
          <PWAInstallButton />

          {/* Profile Avatar Button */}
          <button
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onOpenProfile();
            }}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00A3E0] to-[#004481] p-0.5 shadow-md hover:ring-2 hover:ring-[#F39200] transition cursor-pointer flex items-center justify-center text-sm"
            title="Editar Perfil do Concurseiro"
          >
            <span>{profile.avatar}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
