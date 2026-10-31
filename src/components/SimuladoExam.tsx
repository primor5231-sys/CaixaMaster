import React, { useState, useEffect } from 'react';
import { Question, UserProfile, SubjectId } from '../types';
import { QUESTION_BANK, SUBJECTS } from '../data/mockCurriculum';
import { Timer, Eye, EyeOff, AlertTriangle, CheckCircle, Flag, ArrowLeft, ArrowRight, RotateCcw, Award, Sparkles } from 'lucide-react';
import { playSound } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface SimuladoExamProps {
  profile: UserProfile;
  onFinishSimulado: (earnedXP: number, earnedCoins: number) => void;
  onExit: () => void;
}

export const SimuladoExam: React.FC<SimuladoExamProps> = ({
  profile,
  onFinishSimulado,
  onExit,
}) => {
  const [questions] = useState<Question[]>(() => [...QUESTION_BANK].sort(() => Math.random() - 0.5));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [isFocusMode, setIsFocusMode] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(35 * 60); // 35 min
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isSubmitted]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIndex: number) => {
    playSound('click', profile.soundEnabled);
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const toggleFlag = () => {
    playSound('click', profile.soundEnabled);
    setFlaggedQuestions((prev) => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    playSound('levelup', profile.soundEnabled);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#00A3E0', '#F39200', '#10B981'],
    });

    // Calculate score
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const earnedXP = correctCount * 25 + 50;
    const earnedCoins = correctCount * 10 + 20;
    onFinishSimulado(earnedXP, earnedCoins);
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  // Calculate results if submitted
  const correctCount = questions.reduce((acc, q, idx) => (userAnswers[idx] === q.correctIndex ? acc + 1 : acc), 0);
  const totalQuestions = questions.length;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isApproved = scorePercent >= 75; // Caixa standard cut-off benchmark

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 pb-28 text-white space-y-6">
        <div className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-4 ${
          isApproved ? 'bg-[#002D57] border-emerald-500/50' : 'bg-[#002244] border-amber-500/50'
        }`}>
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-[#00A3E0] to-[#F39200] flex items-center justify-center text-4xl shadow-xl">
            {isApproved ? '🏆' : '📚'}
          </div>

          <h2 className="text-2xl sm:text-3xl font-black">
            {isApproved ? 'Aprovado no Simulado CEF!' : 'Bom Treino! Continue Firme!'}
          </h2>

          <p className="text-sm text-slate-300 max-w-md mx-auto">
            {isApproved
              ? 'Seu aproveitamento supera a nota de corte histórica para o cargo de Técnico Bancário!'
              : 'O concurso da Caixa exige constância. Revise as questões que errou para consolidar a matéria.'}
          </p>

          {/* Big Score Stats */}
          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase">Aproveitamento</span>
              <div className="text-2xl sm:text-3xl font-black text-[#F39200]">{scorePercent}%</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase">Acertos</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">{correctCount} / {totalQuestions}</div>
            </div>
            <div className="p-3 rounded-2xl bg-black/30 border border-white/10">
              <span className="text-xs text-slate-400 font-bold uppercase">Nota de Corte</span>
              <div className="text-2xl sm:text-3xl font-black text-sky-300">75%</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onExit}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#F39200] text-slate-950 font-black text-sm shadow-lg hover:bg-[#FFA41C] transition cursor-pointer"
            >
              Voltar à Trilha
            </button>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setUserAnswers({});
                setFlaggedQuestions({});
                setSecondsRemaining(35 * 60);
                setCurrentIndex(0);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl border border-white/20 text-slate-200 hover:text-white hover:bg-white/10 font-bold text-sm transition cursor-pointer"
            >
              Refazer Simulado
            </button>
          </div>
        </div>

        {/* Detailed Question Review List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-sky-300">Gabarito e Revisão Detalhada</h3>
          {questions.map((q, idx) => {
            const userChoice = userAnswers[idx];
            const isRight = userChoice === q.correctIndex;
            return (
              <div
                key={q.id}
                className={`p-4 rounded-2xl border text-xs sm:text-sm space-y-2 ${
                  isRight
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>Questão {idx + 1} • {q.topic}</span>
                  <span className={isRight ? 'text-emerald-400' : 'text-rose-400'}>
                    {isRight ? '✓ Acertou' : `✗ Errou (Gabarito: ${String.fromCharCode(65 + q.correctIndex)})`}
                  </span>
                </div>
                <p className="text-slate-200">{q.statement}</p>
                <p className="text-xs text-slate-400 pt-1 border-t border-white/5">{q.explanation}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isFocusMode ? 'bg-[#001020]' : 'bg-[#00172E]'
    } pb-28 pt-2`}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Top Focus Mode Bar */}
        <div className="flex items-center justify-between py-3 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm('Deseja realmente sair do simulado? Seu progresso nesta tentativa será perdido.')) {
                  onExit();
                }
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Desistir</span>
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#002B54] border border-sky-500/20 text-sky-300 text-xs font-bold">
              <span>Simulado Geral CEF</span>
            </div>
          </div>

          {/* Timer Display */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm font-bold shadow-md ${
            secondsRemaining < 300 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse' : 'bg-[#002244] text-amber-300 border border-amber-500/30'
          }`}>
            <Timer className="w-4 h-4" />
            <span>{formatTime(secondsRemaining)}</span>
          </div>

          {/* Focus Mode Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playSound('click', profile.soundEnabled);
                setIsFocusMode(!isFocusMode);
              }}
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                isFocusMode
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
              }`}
              title="Ativar/Desativar Modo Foco sem distrações"
            >
              {isFocusMode ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              <span className="hidden md:inline">Modo Foco</span>
            </button>
          </div>
        </div>

        {/* Question Palette (Numbers grid) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-4 scrollbar-none">
          {questions.map((_, i) => {
            const isAnswered = userAnswers[i] !== undefined;
            const isFlagged = flaggedQuestions[i];
            const isCurrent = i === currentIndex;

            return (
              <button
                key={i}
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  setCurrentIndex(i);
                }}
                className={`relative w-8 h-8 rounded-lg flex-shrink-0 font-bold text-xs transition cursor-pointer ${
                  isCurrent
                    ? 'bg-[#F39200] text-slate-950 ring-2 ring-white scale-105'
                    : isAnswered
                    ? 'bg-[#004481] text-sky-200 border border-sky-400/40'
                    : 'bg-[#001D3D] text-slate-400 border border-white/5 hover:border-white/20'
                }`}
              >
                {i + 1}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Question Box */}
        {currentQ && (
          <div className="rounded-3xl bg-[#001D3D] border border-white/10 p-5 sm:p-7 shadow-2xl text-white space-y-6">
            <div className="flex items-center justify-between text-xs pb-3 border-b border-white/10">
              <span className="font-bold text-sky-300">
                Questão {currentIndex + 1} de {questions.length} • {currentQ.topic}
              </span>
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                  flaggedQuestions[currentIndex]
                    ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                    : 'border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5" />
                <span>{flaggedQuestions[currentIndex] ? 'Marcada para Revisão' : 'Marcar para Revisão'}</span>
              </button>
            </div>

            <h3 className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
              {currentQ.statement}
            </h3>

            {/* Alternatives */}
            <div className="space-y-3">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = userAnswers[currentIndex] === oIdx;
                const letter = String.fromCharCode(65 + oIdx);

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition flex items-start gap-3.5 cursor-pointer ${
                      isSelected
                        ? 'border-[#F39200] bg-orange-500/20 text-white font-semibold ring-2 ring-[#F39200]/50'
                        : 'border-[#003366] bg-[#00172E] hover:bg-[#002244] text-slate-200'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isSelected ? 'bg-[#F39200] text-slate-950' : 'bg-[#002B54] text-sky-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="leading-snug pt-0.5">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  setCurrentIndex(Math.max(0, currentIndex - 1));
                }}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 cursor-pointer"
              >
                Anterior
              </button>

              <div className="text-xs text-slate-400 font-medium">
                Respondidas: {answeredCount} de {questions.length}
              </div>

              {currentIndex < questions.length - 1 ? (
                <button
                  onClick={() => {
                    playSound('click', profile.soundEnabled);
                    setCurrentIndex(currentIndex + 1);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#004481] hover:bg-[#005599] text-sky-100 font-bold text-xs transition cursor-pointer"
                >
                  Próxima
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F39200] to-[#FFA41C] text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-orange-500/20 transition cursor-pointer"
                >
                  Finalizar Simulado
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
