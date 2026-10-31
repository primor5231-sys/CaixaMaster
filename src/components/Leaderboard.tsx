import React, { useState } from 'react';
import { UserProfile, LeaderboardUser } from '../types';
import { LEADERBOARD_USERS } from '../data/mockCurriculum';
import { Trophy, Flame, Shield, ArrowUp, Clock, Sparkles } from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface LeaderboardProps {
  profile: UserProfile;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ profile }) => {
  const [selectedLeague, setSelectedLeague] = useState<'ouro' | 'diamante'>('ouro');

  // Inject current user into leaderboard dynamically
  const users: LeaderboardUser[] = LEADERBOARD_USERS.map((u) => {
    if (u.isCurrentUser) {
      return {
        ...u,
        name: `${profile.name} (Você)`,
        avatar: profile.avatar,
        xp: profile.xp,
        streak: profile.streak,
        targetRole: profile.targetRole,
      };
    }
    return u;
  }).sort((a, b) => b.xp - a.xp);

  const top3 = users.slice(0, 3);
  const rest = users.slice(3);

  return (
    <div className="max-w-2xl mx-auto px-4 pb-28 pt-4 space-y-6 text-white">
      {/* League Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#003870] via-[#004d80] to-[#002b54] border-2 border-amber-400/30 shadow-2xl relative overflow-hidden text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Liga Ouro dos Bancários Caixa</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Ranking Semanal CEF
        </h1>
        <p className="text-xs text-sky-200 mt-1 max-w-md mx-auto">
          Os 5 primeiros colocados sobem para a prestigiada <strong>Liga Diamante CEF</strong> no domingo às 23:59!
        </p>

        <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-amber-300/90 font-mono bg-black/30 px-3 py-1 rounded-xl">
          <Clock className="w-3.5 h-3.5" />
          <span>Faltam 2 dias e 14 horas para o encerramento</span>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
        {/* 2nd place */}
        {top3[1] && (
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-1">{top3[1].avatar}</div>
            <div className="w-full bg-[#002244] border border-slate-400/30 rounded-2xl p-3 text-center shadow-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-slate-300 text-slate-900 font-black text-xs flex items-center justify-center shadow">
                2
              </span>
              <div className="text-xs font-bold text-white truncate max-w-[80px] sm:max-w-[120px] mx-auto mt-1">
                {top3[1].name}
              </div>
              <div className="text-xs font-black text-[#FFA41C] mt-0.5">{top3[1].xp} XP</div>
            </div>
          </div>
        )}

        {/* 1st place */}
        {top3[0] && (
          <div className="flex flex-col items-center">
            <div className="text-3xl mb-1 animate-bounce">👑 {top3[0].avatar}</div>
            <div className="w-full bg-gradient-to-b from-[#003366] to-[#002244] border-2 border-amber-400 rounded-3xl p-4 text-center shadow-2xl relative glow-orange">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow">
                1
              </span>
              <div className="text-xs sm:text-sm font-extrabold text-white truncate max-w-[90px] sm:max-w-[130px] mx-auto mt-1">
                {top3[0].name}
              </div>
              <div className="text-sm font-black text-amber-300 mt-1">{top3[0].xp} XP</div>
            </div>
          </div>
        )}

        {/* 3rd place */}
        {top3[2] && (
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-1">{top3[2].avatar}</div>
            <div className="w-full bg-[#002244] border border-amber-700/40 rounded-2xl p-3 text-center shadow-lg relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-amber-700 text-amber-100 font-black text-xs flex items-center justify-center shadow">
                3
              </span>
              <div className="text-xs font-bold text-white truncate max-w-[80px] sm:max-w-[120px] mx-auto mt-1">
                {top3[2].name}
              </div>
              <div className="text-xs font-black text-[#FFA41C] mt-0.5">{top3[2].xp} XP</div>
            </div>
          </div>
        )}
      </div>

      {/* Promotion Zone Banner */}
      <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
        <ArrowUp className="w-4 h-4 text-emerald-400" />
        <span>Zona de Acesso à Liga Diamante CEF (Posições 1 a 5)</span>
      </div>

      {/* Ranks list 4+ */}
      <div className="space-y-2">
        {users.map((user, idx) => {
          const rank = idx + 1;
          const isMe = user.isCurrentUser;
          const isPromo = rank <= 5;

          return (
            <div
              key={user.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                isMe
                  ? 'bg-orange-500/15 border-[#F39200] ring-2 ring-[#F39200]/50 shadow-lg'
                  : 'bg-[#002244] border-[#003870] hover:bg-[#00284d]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                  rank <= 3
                    ? 'bg-amber-400 text-slate-950'
                    : isPromo
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#00172E] text-slate-400'
                }`}>
                  {rank}
                </span>

                <div className="text-xl flex-shrink-0">{user.avatar}</div>

                <div>
                  <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{user.name}</span>
                    {isMe && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#F39200] text-slate-950 font-black">
                        VOCÊ
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{user.targetRole}</span>
                    <span className="flex items-center gap-0.5 text-orange-400 font-bold">
                      <Flame className="w-3 h-3 fill-orange-500" /> {user.streak}d
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-[#FFA41C]">
                  {user.xp} XP
                </div>
                {isPromo && (
                  <span className="text-[9px] text-emerald-400 font-bold flex items-center justify-end gap-0.5">
                    <ArrowUp className="w-2.5 h-2.5" /> Sobe
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
