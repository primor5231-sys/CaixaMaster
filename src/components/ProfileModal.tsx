import React, { useState } from 'react';
import { UserProfile } from '../types';
import { X, User, Heart, Shield, Award, Sparkles, Check, RefreshCw } from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface ProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updated: Partial<UserProfile>) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ profile, onClose, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [targetRole, setTargetRole] = useState(profile.targetRole);
  const [targetPolo, setTargetPolo] = useState(profile.targetPolo);

  const avatarsList = ['👨‍💼', '👩‍💼', '👨‍💻', '👩‍💻', '⭐', '🦁', '🦉', '🎯', '🚀', '🏛️'];

  const handleSave = () => {
    playSound('coin', profile.soundEnabled);
    onSave({
      name,
      avatar,
      targetRole,
      targetPolo,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#002244] border-2 border-[#004d80] rounded-3xl p-6 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#003870]">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <User className="w-5 h-5 text-[#F39200]" />
            <span>Perfil do Concurseiro Caixa</span>
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

        {/* Avatar selection */}
        <div>
          <label className="text-xs font-bold text-sky-300 block mb-2">
            Escolha seu Avatar:
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {avatarsList.map((av) => (
              <button
                key={av}
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  setAvatar(av);
                }}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 transition cursor-pointer ${
                  avatar === av
                    ? 'bg-[#F39200] border-2 border-white scale-110 shadow-lg'
                    : 'bg-[#001D3D] border border-white/10 hover:border-white/30'
                }`}
              >
                {av}
              </button>
            ))}
          </div>
        </div>

        {/* Name input */}
        <div>
          <label className="text-xs font-bold text-sky-300 block mb-1">
            Seu Nome de Concurseiro:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#00172E] border border-[#003870] focus:border-sky-400 text-white text-sm outline-none"
            placeholder="Ex: João da Silva"
          />
        </div>

        {/* Target role selection */}
        <div>
          <label className="text-xs font-bold text-sky-300 block mb-1.5">
            Cargo Desejado no Concurso da Caixa:
          </label>
          <div className="grid grid-cols-1 gap-2">
            {[
              'Técnico Bancário Novo - Geral',
              'Técnico Bancário Novo - TI',
            ].map((role) => (
              <button
                key={role}
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  setTargetRole(role as any);
                }}
                className={`p-3 rounded-xl border text-left text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                  targetRole === role
                    ? 'border-[#F39200] bg-orange-500/20 text-white'
                    : 'border-[#003870] bg-[#00172E] text-slate-300'
                }`}
              >
                <span>{role}</span>
                {targetRole === role && <Check className="w-4 h-4 text-[#F39200]" />}
              </button>
            ))}
          </div>
        </div>

        {/* Polo / Região */}
        <div>
          <label className="text-xs font-bold text-sky-300 block mb-1">
            Polo / Macropolo Alvo:
          </label>
          <input
            type="text"
            value={targetPolo}
            onChange={(e) => setTargetPolo(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#00172E] border border-[#003870] focus:border-sky-400 text-white text-sm outline-none"
            placeholder="Ex: Polo SP Capital / Matriz"
          />
        </div>

        {/* Career Goal & Stats summary */}
        <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Ofensiva de Estudos:</span>
            <span className="font-black text-orange-400">🔥 {profile.streak} dias</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>Experiência Acumulada:</span>
            <span className="font-black text-[#FFA41C]">{profile.xp} XP (Nível {profile.level})</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span>CaixaCoins disponíveis:</span>
            <span className="font-black text-amber-300">🪙 {profile.coins}</span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#F39200] to-[#FFA41C] text-slate-950 font-black text-sm shadow-lg hover:shadow-orange-500/20 active:scale-95 transition cursor-pointer"
        >
          Salvar Alterações
        </button>
      </div>
    </div>
  );
};
