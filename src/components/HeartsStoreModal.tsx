import React from 'react';
import { UserProfile } from '../types';
import { X, Heart, Shield, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface HeartsStoreModalProps {
  profile: UserProfile;
  onClose: () => void;
  onRefillHearts: () => void;
  onBuyStreakFreeze: () => void;
}

export const HeartsStoreModal: React.FC<HeartsStoreModalProps> = ({
  profile,
  onClose,
  onRefillHearts,
  onBuyStreakFreeze,
}) => {
  const canAffordRefill = profile.coins >= 50;
  const canAffordFreeze = profile.coins >= 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-sm bg-[#002244] border-2 border-[#004d80] rounded-3xl p-6 shadow-2xl text-white space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#003870]">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span>Loja CaixaMaster</span>
          </h2>
          <button
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status */}
        <div className="p-3.5 rounded-2xl bg-[#00172E] border border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <span className="text-xs font-bold text-slate-200">
              Vidas: {profile.hearts} / {profile.maxHearts}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <span>🪙 {profile.coins} Moedas</span>
          </div>
        </div>

        {/* Option 1: Full hearts recharge */}
        <div className="p-4 rounded-2xl bg-[#001b36] border border-[#003870] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
              ❤️
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Recarga Total de Vidas</h4>
              <p className="text-[11px] text-slate-400">Restaura 5 corações para os simulados</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (canAffordRefill) {
                playSound('levelup', profile.soundEnabled);
                onRefillHearts();
              }
            }}
            disabled={!canAffordRefill || profile.hearts >= profile.maxHearts}
            className={`px-3 py-2 rounded-xl text-xs font-black transition ${
              canAffordRefill && profile.hearts < profile.maxHearts
                ? 'bg-[#10B981] hover:bg-emerald-400 text-white cursor-pointer active:scale-95'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            {profile.hearts >= profile.maxHearts ? 'Cheio' : '50 🪙'}
          </button>
        </div>

        {/* Option 2: Streak Freeze */}
        <div className="p-4 rounded-2xl bg-[#001b36] border border-[#003870] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
              🛡️
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Bloqueio de Ofensiva</h4>
              <p className="text-[11px] text-slate-400">Protege seu streak se você faltar 1 dia</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (canAffordFreeze) {
                playSound('levelup', profile.soundEnabled);
                onBuyStreakFreeze();
              }
            }}
            disabled={!canAffordFreeze}
            className={`px-3 py-2 rounded-xl text-xs font-black transition ${
              canAffordFreeze
                ? 'bg-[#0066B2] hover:bg-sky-500 text-white cursor-pointer active:scale-95'
                : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }`}
          >
            100 🪙
          </button>
        </div>

        <div className="text-center text-[11px] text-slate-400 pt-1">
          Dica: Você ganha Moedas Caixa acertando questões e completando aulas na Trilha!
        </div>
      </div>
    </div>
  );
};
