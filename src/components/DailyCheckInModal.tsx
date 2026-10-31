import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  DAILY_CHECKIN_CYCLE, 
  hasUserCheckedInToday, 
  previewNextCheckIn, 
  getRewardForStreak 
} from '../services/storageService';
import { 
  X, Flame, Gift, Check, Lock, Sparkles, Shield, 
  Coins, Award, Clock, ArrowRight 
} from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface DailyCheckInModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
  onOpenHeartsStore?: () => void;
  isJustClaimed?: boolean;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  profile,
  isOpen,
  onClose,
  onClaim,
  onOpenHeartsStore,
  isJustClaimed = false,
}) => {
  const [timeLeft, setTimeLeft] = useState('');

  // Countdown to next midnight
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diffMs = tomorrow.getTime() - now.getTime();
      
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      setTimeLeft(
        `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const isCheckedInToday = hasUserCheckedInToday(profile);
  const preview = previewNextCheckIn(profile);
  const currentStreak = profile.checkInStreak ?? profile.streak ?? 1;
  const activeCycleDay = isCheckedInToday 
    ? ((currentStreak - 1) % 7) + 1 
    : preview.dayInCycle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-gradient-to-b from-[#00264d] to-[#00172e] border-2 border-[#005599] rounded-3xl p-5 sm:p-6 shadow-2xl text-white space-y-5 max-h-[92vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-500/20">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F39200] to-amber-500 flex items-center justify-center text-xl shadow-lg glow-orange">
              🔥
            </div>
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-1.5">
                Bônus de Check-in Diário
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase font-black">
                  Ofensiva CEF
                </span>
              </h2>
              <p className="text-xs text-sky-200">
                Logue todos os dias consecutivos para multiplicar suas Moedas Caixa!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Streak Spotlight Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#003870] via-[#00488f] to-[#003366] border border-sky-400/30 flex items-center justify-between shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#001b3a] border-2 border-orange-500/50 flex flex-col items-center justify-center shadow-inner">
                <Flame className="w-7 h-7 text-[#F39200] fill-[#F39200] animate-pulse" />
              </div>
              <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full bg-[#F39200] text-slate-950 text-[10px] font-black">
                {currentStreak}d
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">
                  Ofensiva: {currentStreak} {currentStreak === 1 ? 'Dia' : 'Dias'} Consecutivos
                </span>
              </div>
              <p className="text-xs text-sky-200 mt-0.5">
                {isCheckedInToday
                  ? '🎉 Você já garantiu sua recompensa de hoje! Continue amanhã.'
                  : preview.isConsecutive
                  ? `🔥 Entre hoje para avançar para o Dia ${preview.nextStreak}!`
                  : '⚠️ Sua ofensiva recomeçou. Faça o check-in diário para subir de nível!'}
              </p>
            </div>
          </div>

          <div className="text-right hidden xs:block">
            <div className="text-[10px] text-sky-300 font-bold uppercase tracking-wider">
              {isCheckedInToday ? 'Próximo Reset' : 'Status Hoje'}
            </div>
            <div className="text-xs font-black text-[#FFA41C]">
              {isCheckedInToday ? timeLeft : 'Disponível!'}
            </div>
          </div>
        </div>

        {/* 7-Day Progressive Streak Ladder */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-sky-200 px-1">
            <span>Ciclo Semanal de Recompensas</span>
            <span className="text-[11px] text-amber-300 font-mono">
              Dia {activeCycleDay} de 7
            </span>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {DAILY_CHECKIN_CYCLE.map((cycleItem) => {
              const isPast = cycleItem.day < activeCycleDay || (cycleItem.day === activeCycleDay && isCheckedInToday);
              const isToday = cycleItem.day === activeCycleDay && !isCheckedInToday;
              const isFuture = cycleItem.day > activeCycleDay;

              // Calculate reward coins with longevity multiplier for this user
              const previewReward = getRewardForStreak(
                (Math.floor(Math.max(0, currentStreak - 1) / 7) * 7) + cycleItem.day
              );

              return (
                <div
                  key={cycleItem.day}
                  className={`relative p-2.5 rounded-2xl flex flex-col items-center justify-between text-center transition-all ${
                    isToday
                      ? 'bg-gradient-to-b from-[#F39200]/25 to-amber-600/30 border-2 border-[#F39200] shadow-lg shadow-orange-500/20 scale-105 z-10 glow-orange'
                      : isPast
                      ? 'bg-emerald-950/20 border border-emerald-500/40 text-emerald-200'
                      : 'bg-[#001d3d]/80 border border-white/5 opacity-60'
                  }`}
                >
                  {/* Badge: Special Day 7 */}
                  {cycleItem.isSpecial && (
                    <span className="absolute -top-2 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-amber-400 to-[#F39200] text-slate-950 text-[8px] font-black uppercase">
                      Baú
                    </span>
                  )}

                  {/* Day Label */}
                  <span className={`text-[10px] font-bold ${isToday ? 'text-[#FFA41C]' : 'text-slate-300'}`}>
                    Dia {cycleItem.day}
                  </span>

                  {/* Icon */}
                  <div className="my-1.5 flex items-center justify-center">
                    {isPast ? (
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : isToday ? (
                      <div className="w-9 h-9 rounded-2xl bg-[#F39200] text-slate-950 flex items-center justify-center shadow-md animate-bounce">
                        {cycleItem.isSpecial ? '🏆' : '🪙'}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center text-slate-400">
                        {cycleItem.isSpecial ? '🎁' : <Lock className="w-3.5 h-3.5" />}
                      </div>
                    )}
                  </div>

                  {/* Coins reward amount */}
                  <div className="text-[11px] font-black text-amber-300 flex items-center gap-0.5">
                    <span>+{previewReward.coins}</span>
                    <span className="text-[9px]">🪙</span>
                  </div>

                  {/* Status tag */}
                  <span className={`text-[8px] font-bold mt-1 uppercase ${
                    isPast ? 'text-emerald-400' : isToday ? 'text-amber-300' : 'text-slate-400'
                  }`}>
                    {isPast ? 'Feito' : isToday ? 'Hoje!' : 'Trancado'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Streak Freeze & Multiplier info */}
        <div className="p-3.5 rounded-2xl bg-[#001b36] border border-sky-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <div>
              <span className="font-bold text-slate-200">
                Bloqueio de Ofensiva (Streak Freeze):
              </span>
              <p className="text-[11px] text-slate-400">
                {profile.streakFreezeCount > 0
                  ? `🛡️ ${profile.streakFreezeCount} ativo(s). Protege seu streak se você faltar 1 dia.`
                  : 'Nenhum ativo. Adquira na loja para nunca perder seu progresso.'}
              </p>
            </div>
          </div>

          {onOpenHeartsStore && (
            <button
              onClick={() => {
                playSound('click', profile.soundEnabled);
                onClose();
                onOpenHeartsStore();
              }}
              className="px-2.5 py-1 rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 text-[11px] font-bold whitespace-nowrap cursor-pointer"
            >
              Ver na Loja
            </button>
          )}
        </div>

        {/* Primary Action Button */}
        {!isCheckedInToday ? (
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                playSound('levelup', profile.soundEnabled);
                onClaim();
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#F39200] via-[#FFA41C] to-amber-500 text-slate-950 font-black text-base shadow-xl hover:brightness-110 active:translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer btn-duo-orange"
            >
              <Gift className="w-5 h-5 text-slate-950 animate-bounce" />
              <span>Resgatar Recompensa (+{preview.rewardCoins} 🪙 e +{preview.rewardXP} XP)</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              {preview.streakProtectedWithFreeze && (
                <span className="text-sky-300 font-bold block mb-0.5">
                  🛡️ Seu Bloqueio de Ofensiva salvou sua sequência de estudos!
                </span>
              )}
              O check-in diário é atualizado todo dia à meia-noite (00:00).
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Recompensa de Hoje Resgatada!</span>
            </div>
            <p className="text-xs text-slate-300">
              Excelente disciplina! Volte amanhã para desbloquear mais CaixaCoins e manter o ritmo do edital CEF.
            </p>
            <div className="text-xs font-mono text-amber-300 pt-1 flex items-center justify-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Próxima recompensa disponível em: <strong>{timeLeft}</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
