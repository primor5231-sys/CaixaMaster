import React, { useState } from 'react';
import { Lesson, Question, UserProfile } from '../types';
import { X, ArrowRight, ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Bot, Volume2, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound } from '../services/soundEffects';

interface LessonModalProps {
  lesson: Lesson;
  profile: UserProfile;
  onClose: () => void;
  onComplete: (lessonId: string, earnedXP: number, earnedCoins: number) => void;
  onLoseHeart: () => void;
  onAskTutor: (questionText: string) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  lesson,
  profile,
  onClose,
  onComplete,
  onLoseHeart,
  onAskTutor,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const totalSlides = lesson.slides.length;
  const isQuizPhase = currentSlideIndex >= totalSlides;

  // Quiz state
  const currentQuiz: Question | undefined = lesson.quizQuestions[0];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasCheckedAnswer, setHasCheckedAnswer] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = totalSlides + (currentQuiz ? 1 : 0);
  const currentStep = currentSlideIndex + 1;
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  const handleNextSlide = () => {
    playSound('click', profile.soundEnabled);
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else if (currentQuiz) {
      setCurrentSlideIndex(totalSlides); // Move to quiz
    } else {
      finishLesson();
    }
  };

  const handlePrevSlide = () => {
    playSound('click', profile.soundEnabled);
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleCheckQuiz = () => {
    if (selectedOption === null || !currentQuiz) return;
    setHasCheckedAnswer(true);

    const isCorrect = selectedOption === currentQuiz.correctIndex;
    if (isCorrect) {
      playSound('correct', profile.soundEnabled);
    } else {
      playSound('wrong', profile.soundEnabled);
      onLoseHeart();
    }
  };

  const finishLesson = () => {
    playSound('levelup', profile.soundEnabled);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00A3E0', '#F39200', '#10B981', '#FFFFFF'],
    });
    setIsCompleted(true);
    onComplete(lesson.id, lesson.xpReward, lesson.coinsReward);
  };

  const currentSlide = !isQuizPhase ? lesson.slides[currentSlideIndex] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in">
      <div className="w-full max-w-xl bg-[#002244] border-2 border-[#004d80] rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white">
        
        {/* Top Header with Progress Bar */}
        <div className="p-4 border-b border-[#003870] flex items-center justify-between gap-4 bg-[#001D3D]">
          <button
            onClick={() => {
              playSound('click', profile.soundEnabled);
              onClose();
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Progress Bar */}
          <div className="flex-1">
            <div className="w-full bg-[#001429] h-3 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-gradient-to-r from-sky-400 via-[#F39200] to-emerald-400 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/20 text-[#FFA41C] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>+{lesson.xpReward} XP</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {!isCompleted && !isQuizPhase && currentSlide && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-wider">
                <span>Micro-aula {currentSlideIndex + 1} de {totalSlides}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {currentSlide.title}
              </h2>

              <div className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line space-y-2 bg-[#001a33]/60 p-4 rounded-2xl border border-sky-500/10">
                {currentSlide.content}
              </div>

              {/* Highlight Callout Box */}
              {currentSlide.highlightBox && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs sm:text-sm font-medium flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">⚠️</span>
                  <div>{currentSlide.highlightBox}</div>
                </div>
              )}

              {/* Mnemonic Memory Hack */}
              {currentSlide.mnemonic && (
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/30 text-sky-200 text-xs sm:text-sm font-semibold flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">🧠</span>
                  <div>{currentSlide.mnemonic}</div>
                </div>
              )}
            </div>
          )}

          {/* Quiz Question Phase */}
          {!isCompleted && isQuizPhase && currentQuiz && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#F39200] uppercase tracking-wider">
                  Desafio de Fixação • Cesgranrio
                </span>
                <span className="text-xs bg-[#004481] px-2 py-0.5 rounded text-sky-200">
                  {currentQuiz.banca} {currentQuiz.year}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed">
                {currentQuiz.statement}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 pt-2">
                {currentQuiz.options.map((opt, idx) => {
                  const letter = String.fromCharCode(65 + idx);
                  const isSelected = selectedOption === idx;
                  const isAnswerChecked = hasCheckedAnswer;
                  const isCorrect = idx === currentQuiz.correctIndex;

                  let borderClass = 'border-[#003d73] bg-[#001b36] hover:bg-[#00284d] text-slate-200';
                  if (isSelected && !isAnswerChecked) {
                    borderClass = 'border-[#F39200] bg-orange-500/20 text-white font-semibold ring-2 ring-[#F39200]';
                  } else if (isAnswerChecked) {
                    if (isCorrect) {
                      borderClass = 'border-emerald-500 bg-emerald-500/20 text-emerald-200 font-bold';
                    } else if (isSelected) {
                      borderClass = 'border-rose-500 bg-rose-500/20 text-rose-200 font-bold';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        if (!hasCheckedAnswer) {
                          playSound('click', profile.soundEnabled);
                          setSelectedOption(idx);
                        }
                      }}
                      disabled={hasCheckedAnswer}
                      className={`w-full p-3.5 rounded-2xl border-2 text-left text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer ${borderClass}`}
                    >
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-black text-xs flex-shrink-0 ${
                        isSelected ? 'bg-[#F39200] text-slate-950' : 'bg-[#003366] text-sky-300'
                      }`}>
                        {letter}
                      </span>
                      <span className="leading-snug">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Result explanation feedback box */}
              {hasCheckedAnswer && (
                <div className={`p-4 rounded-2xl border mt-4 ${
                  selectedOption === currentQuiz.correctIndex
                    ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-100'
                    : 'bg-rose-950/40 border-rose-500/40 text-rose-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2 font-bold text-sm">
                    {selectedOption === currentQuiz.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400">Excelente! Gabarito Correto!</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5 text-rose-400" />
                        <span className="text-rose-400">Resposta incorreta (-1 vida)</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {currentQuiz.explanation}
                  </p>

                  {/* Ask AI Tutor for further explanation */}
                  <button
                    onClick={() => onAskTutor(`Por favor, comente a questão de concurso da Caixa sobre "${currentQuiz.topic}". O enunciado é: ${currentQuiz.statement}`)}
                    className="flex items-center gap-2 text-xs font-bold text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-xl border border-sky-400/30 transition cursor-pointer"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>Dúvida? Explicar com o Tutor IA</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Victory Completed Screen */}
          {isCompleted && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-3xl shadow-xl shadow-emerald-500/20">
                🎉
              </div>

              <h2 className="text-2xl font-black text-white">
                Micro-aula Concluída!
              </h2>

              <p className="text-sm text-slate-300 max-w-sm mx-auto">
                Você assimilou um conceito estratégico do edital da Caixa e deu mais um passo rumo à posse!
              </p>

              <div className="flex items-center justify-center gap-4 py-2">
                <div className="px-4 py-3 rounded-2xl bg-[#001a33] border border-sky-500/30 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase">XP Ganho</div>
                  <div className="text-xl font-black text-[#FFA41C]">+{lesson.xpReward}</div>
                </div>
                <div className="px-4 py-3 rounded-2xl bg-[#001a33] border border-amber-500/30 text-center">
                  <div className="text-xs text-slate-400 font-bold uppercase">Moedas</div>
                  <div className="text-xl font-black text-amber-300">+{lesson.coinsReward} 🪙</div>
                </div>
              </div>

              <button
                onClick={() => {
                  playSound('click', profile.soundEnabled);
                  onClose();
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F39200] to-[#FFA41C] text-slate-950 font-black text-base shadow-lg hover:shadow-orange-500/30 active:scale-95 transition cursor-pointer"
              >
                Continuar Trilha
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isCompleted && (
          <div className="p-4 border-t border-[#003870] bg-[#001A33] flex items-center justify-between gap-3">
            {!isQuizPhase ? (
              <>
                <button
                  onClick={handlePrevSlide}
                  disabled={currentSlideIndex === 0}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold ${
                    currentSlideIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/10 cursor-pointer'
                  }`}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <button
                  onClick={handleNextSlide}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#F39200] hover:bg-[#FFA41C] text-slate-950 font-black text-xs sm:text-sm shadow-md active:scale-95 transition cursor-pointer"
                >
                  <span>{currentSlideIndex === totalSlides - 1 ? 'Iniciar Desafio' : 'Próximo'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <div className="w-full flex items-center justify-between gap-3">
                {!hasCheckedAnswer ? (
                  <button
                    onClick={handleCheckQuiz}
                    disabled={selectedOption === null}
                    className={`w-full py-3 rounded-2xl font-black text-sm transition ${
                      selectedOption !== null
                        ? 'bg-[#10B981] hover:bg-emerald-400 text-white shadow-lg active:scale-95 cursor-pointer'
                        : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Verificar Resposta
                  </button>
                ) : (
                  <button
                    onClick={finishLesson}
                    className="w-full py-3 rounded-2xl bg-[#F39200] hover:bg-[#FFA41C] text-slate-950 font-black text-sm shadow-lg active:scale-95 transition cursor-pointer"
                  >
                    Concluir Aula
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
