import React, { useState } from 'react';
import { Flashcard, UserProfile } from '../types';
import { FLASHCARDS } from '../data/mockCurriculum';
import { Lightbulb, RotateCw, CheckCircle2, ChevronRight, ChevronLeft, Sparkles, BookOpen } from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface MnemonicFlashcardsProps {
  profile: UserProfile;
  onRewardXP: (xp: number, coins: number) => void;
}

export const MnemonicFlashcards: React.FC<MnemonicFlashcardsProps> = ({ profile, onRewardXP }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredIds, setMasteredIds] = useState<string[]>([]);

  const currentCard = FLASHCARDS[currentIndex];
  const isDark = profile.theme === 'dark';

  const handleFlip = () => {
    playSound('click', profile.soundEnabled);
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    playSound('click', profile.soundEnabled);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % FLASHCARDS.length);
  };

  const handlePrev = () => {
    playSound('click', profile.soundEnabled);
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + FLASHCARDS.length) % FLASHCARDS.length);
  };

  const handleMaster = (id: string) => {
    if (!masteredIds.includes(id)) {
      setMasteredIds([...masteredIds, id]);
      onRewardXP(20, 10);
      playSound('coin', profile.soundEnabled);
    }
    handleNext();
  };

  return (
    <div className="max-w-xl mx-auto px-4 pb-28 pt-4 space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004481] border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Lightbulb className="w-3.5 h-3.5 text-[#F39200]" />
          <span>Mnemônicos & Macetes Caixa</span>
        </div>
        <h1 className={`text-xl sm:text-2xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Flashcards de Memorização Rápida
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Memorize as regras de ouro, fórmulas e siglas do edital CEF com cartões interativos.
        </p>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-400">
        <span>Cartão {currentIndex + 1} de {FLASHCARDS.length}</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {masteredIds.length} Dominados
        </span>
      </div>

      {/* Flip Card Container */}
      <div
        onClick={handleFlip}
        className={`w-full min-h-[300px] sm:min-h-[340px] rounded-3xl p-6 sm:p-8 border-2 transition-all duration-300 cursor-pointer shadow-2xl flex flex-col justify-between relative group ${
          isDark
            ? 'bg-[#002244] border-[#004d80] text-white hover:border-sky-400/60'
            : 'bg-white border-slate-200 text-slate-800 hover:border-sky-500'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-xl bg-[#004481] text-sky-200 text-xs font-bold">
            {currentCard.title}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <RotateCw className="w-3.5 h-3.5" /> Toque para virar
          </span>
        </div>

        {/* Center content */}
        <div className="py-6 text-center space-y-4">
          {!isFlipped ? (
            <div className="space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#F39200]">
                Conceito Chave
              </span>
              <h2 className="text-xl sm:text-2xl font-black leading-snug">
                {currentCard.concept}
              </h2>
              <p className="text-xs text-slate-400">
                (Qual é o macete ou regra prática para lembrar disso na prova?)
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in duration-200">
              <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">
                Mnemônico / Regra de Ouro 🧠
              </span>
              <div className="text-xl sm:text-2xl font-black text-[#FFA41C] p-3 rounded-2xl bg-[#00172E]/40 border border-amber-500/30">
                "{currentCard.mnemonic}"
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {currentCard.details}
              </p>
            </div>
          )}
        </div>

        {/* Card Footer status */}
        <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs">
          <span className="text-slate-400">
            {isFlipped ? '💡 Dica memorizada!' : '🤔 Tente se lembrar antes de virar'}
          </span>
          <span className="font-extrabold text-[#FFA41C] flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> +20 XP ao dominar
          </span>
        </div>
      </div>

      {/* Card Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
            isDark
              ? 'border-white/10 hover:bg-white/10 text-slate-200'
              : 'border-slate-300 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          onClick={() => handleMaster(currentCard.id)}
          className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs sm:text-sm shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Já Sei / Dominado!</span>
        </button>

        <button
          onClick={handleNext}
          className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
            isDark
              ? 'border-white/10 hover:bg-white/10 text-slate-200'
              : 'border-slate-300 hover:bg-slate-100 text-slate-700'
          }`}
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
