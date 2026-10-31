import React, { useState } from 'react';
import { Question, SubjectId, UserProfile } from '../types';
import { SUBJECTS, QUESTION_BANK } from '../data/mockCurriculum';
import { CheckCircle2, AlertCircle, Bot, Sparkles, Filter, RefreshCw, ChevronRight, HelpCircle, BookOpen, Lightbulb } from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface QuestionBankProps {
  profile: UserProfile;
  onAnswerQuestion: (questionId: string, selectedIndex: number, isCorrect: boolean) => void;
  onAskAITutor: (prompt: string) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({
  profile,
  onAnswerQuestion,
  onAskAITutor,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unanswered' | 'correct' | 'wrong'>('all');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [isGeneratingQuestion, setIsGeneratingQuestion] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);

  // Combined questions list
  const allQuestions = [...customQuestions, ...QUESTION_BANK];

  // Filtered questions
  const filteredQuestions = allQuestions.filter((q) => {
    if (selectedSubject !== 'all' && q.subjectId !== selectedSubject) return false;
    const answer = profile.answeredQuestionIds[q.id];
    if (statusFilter === 'unanswered' && answer !== undefined) return false;
    if (statusFilter === 'correct' && (!answer || !answer.isCorrect)) return false;
    if (statusFilter === 'wrong' && (!answer || answer.isCorrect)) return false;
    return true;
  });

  const currentQ: Question | undefined = filteredQuestions[activeQuestionIndex];

  // If question changes, reset local state
  const handleSelectQuestion = (index: number) => {
    playSound('click', profile.soundEnabled);
    setActiveQuestionIndex(index);
    setSelectedOption(null);
    setHasRevealed(false);
    setAiExplanation(null);
  };

  const handleConfirmAnswer = () => {
    if (selectedOption === null || !currentQ) return;
    setHasRevealed(true);
    const isCorrect = selectedOption === currentQ.correctIndex;

    if (isCorrect) {
      playSound('correct', profile.soundEnabled);
    } else {
      playSound('wrong', profile.soundEnabled);
    }

    onAnswerQuestion(currentQ.id, selectedOption, isCorrect);
  };

  // Call Server-side Gemini to explain the question
  const handleRequestAIExplanation = async () => {
    if (!currentQ) return;
    setIsLoadingAI(true);
    setAiExplanation(null);
    playSound('click', profile.soundEnabled);

    try {
      const optionLetters = ['A', 'B', 'C', 'D', 'E'];
      const userSelectedLetter = selectedOption !== null ? optionLetters[selectedOption] : 'Não respondeu';
      const correctLetter = optionLetters[currentQ.correctIndex];
      const subjectName = SUBJECTS.find(s => s.id === currentQ.subjectId)?.name || currentQ.subjectId;

      const res = await fetch('/api/tutor/explain-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: currentQ,
          userSelected: userSelectedLetter,
          correctOption: correctLetter,
          subject: subjectName,
        }),
      });

      const data = await res.json();
      if (data.explanation) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation('Não foi possível gerar a explicação no momento. Tente novamente!');
      }
    } catch (err) {
      console.error(err);
      setAiExplanation('Erro de conexão ao consultar o Tutor IA.');
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Generate a brand new question with AI
  const handleGenerateNewQuestion = async () => {
    setIsGeneratingQuestion(true);
    playSound('click', profile.soundEnabled);

    try {
      const subjectToUse = selectedSubject !== 'all' ? selectedSubject : 'bancarios';
      const subjectObj = SUBJECTS.find(s => s.id === subjectToUse);

      const res = await fetch('/api/tutor/generate-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: subjectObj?.name || 'Conhecimentos Bancários',
          topic: subjectObj?.description || 'Edital Caixa',
        }),
      });

      const data = await res.json();
      if (data.statement && Array.isArray(data.options)) {
        const newQ: Question = {
          id: `ai_${Date.now()}`,
          subjectId: subjectToUse,
          topic: 'Gerada por IA • Edital CEF',
          banca: 'Caixa Inédita',
          year: 2026,
          statement: data.statement,
          options: data.options,
          correctIndex: data.correctIndex ?? 0,
          explanation: data.explanation || 'Comentário didático oficial da banca.',
        };

        setCustomQuestions([newQ, ...customQuestions]);
        setActiveQuestionIndex(0);
        setSelectedOption(null);
        setHasRevealed(false);
        setAiExplanation(null);
        playSound('levelup', profile.soundEnabled);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingQuestion(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 pt-4">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004481] border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Banco de Questões CEF</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white">
            Treino Focado nas Bancas Oficiais
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Resolva questões da Cesgranrio e Cebraspe com mnemônicos e comentários da IA.
          </p>
        </div>

        {/* Generate AI Question Button */}
        <button
          onClick={handleGenerateNewQuestion}
          disabled={isGeneratingQuestion}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-[#0066B2] text-white font-bold text-xs sm:text-sm shadow-lg hover:shadow-sky-500/20 active:scale-95 transition cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${isGeneratingQuestion ? 'animate-spin' : ''}`} />
          <span>{isGeneratingQuestion ? 'Criando Questão...' : 'Gerar Questão Inédita (IA)'}</span>
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-4">
        <button
          onClick={() => {
            playSound('click', profile.soundEnabled);
            setSelectedSubject('all');
            setActiveQuestionIndex(0);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            selectedSubject === 'all'
              ? 'bg-[#F39200] text-slate-950 shadow-md'
              : 'bg-[#002244] border border-[#003870] text-slate-300 hover:text-white'
          }`}
        >
          Todas as Matérias ({allQuestions.length})
        </button>

        {SUBJECTS.map((sub) => {
          const count = allQuestions.filter(q => q.subjectId === sub.id).length;
          const isSelected = selectedSubject === sub.id;
          return (
            <button
              key={sub.id}
              onClick={() => {
                playSound('click', profile.soundEnabled);
                setSelectedSubject(sub.id);
                setActiveQuestionIndex(0);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isSelected
                  ? 'bg-[#0066B2] text-white border border-sky-400 shadow-md'
                  : 'bg-[#002244] border border-[#003870] text-slate-300 hover:text-white'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.shortName}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
          <Filter className="w-3.5 h-3.5" /> Filtrar:
        </span>
        {(['all', 'unanswered', 'correct', 'wrong'] as const).map((filter) => {
          const labels = {
            all: 'Todas',
            unanswered: 'Não respondidas',
            correct: 'Acertos',
            wrong: 'Erros',
          };
          const isSelected = statusFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => {
                playSound('click', profile.soundEnabled);
                setStatusFilter(filter);
                setActiveQuestionIndex(0);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                isSelected
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-400/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {labels[filter]}
            </button>
          );
        })}
      </div>

      {/* Main Question Display */}
      {filteredQuestions.length === 0 ? (
        <div className="p-8 rounded-3xl bg-[#002244] border border-[#003870] text-center space-y-3">
          <span className="text-4xl">🔍</span>
          <h3 className="text-lg font-bold text-white">Nenhuma questão encontrada com esses filtros</h3>
          <p className="text-xs text-slate-400">
            Tente selecionar outra matéria ou redefinir os filtros de acertos e erros.
          </p>
        </div>
      ) : currentQ ? (
        <div className="space-y-4">
          {/* Question Card */}
          <div className="rounded-3xl bg-[#002244] border-2 border-[#004d80] p-5 sm:p-6 shadow-xl relative text-white">
            {/* Question Meta Tag */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-[#003870]">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-[#004481] text-sky-200 text-xs font-bold">
                  {currentQ.banca} {currentQ.year}
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  {currentQ.topic}
                </span>
              </div>

              {/* Navigator Counter */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">
                  Questão {activeQuestionIndex + 1} de {filteredQuestions.length}
                </span>
              </div>
            </div>

            {/* Statement */}
            <h2 className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed mb-6">
              {currentQ.statement}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;

                let stateClasses = 'border-[#003870] bg-[#001b36] hover:bg-[#00284d] text-slate-200';

                if (isSelected && !hasRevealed) {
                  stateClasses = 'border-[#F39200] bg-orange-500/20 text-white font-semibold ring-2 ring-[#F39200]';
                } else if (hasRevealed) {
                  if (isCorrect) {
                    stateClasses = 'border-emerald-500 bg-emerald-500/20 text-emerald-100 font-bold';
                  } else if (isSelected) {
                    stateClasses = 'border-rose-500 bg-rose-500/20 text-rose-100 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!hasRevealed) {
                        playSound('click', profile.soundEnabled);
                        setSelectedOption(idx);
                      }
                    }}
                    disabled={hasRevealed}
                    className={`w-full p-4 rounded-2xl border-2 text-left text-xs sm:text-sm transition flex items-start gap-3 cursor-pointer ${stateClasses}`}
                  >
                    <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      isSelected ? 'bg-[#F39200] text-slate-950' : 'bg-[#003366] text-sky-300'
                    }`}>
                      {letter}
                    </span>
                    <span className="leading-snug pt-0.5">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#003870]">
              {!hasRevealed ? (
                <button
                  onClick={handleConfirmAnswer}
                  disabled={selectedOption === null}
                  className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition ${
                    selectedOption !== null
                      ? 'bg-[#10B981] hover:bg-emerald-400 text-white shadow-md cursor-pointer active:scale-95'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Responder Questão
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRequestAIExplanation}
                    disabled={isLoadingAI}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-400/30 text-xs font-bold transition cursor-pointer"
                  >
                    <Bot className={`w-4 h-4 ${isLoadingAI ? 'animate-spin' : ''}`} />
                    <span>{isLoadingAI ? 'Consultando IA...' : 'Explicar com Tutor IA'}</span>
                  </button>
                </div>
              )}

              {/* Navigation controls (Next / Previous) */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSelectQuestion(Math.max(0, activeQuestionIndex - 1))}
                  disabled={activeQuestionIndex === 0}
                  className="px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  onClick={() => handleSelectQuestion(Math.min(filteredQuestions.length - 1, activeQuestionIndex + 1))}
                  disabled={activeQuestionIndex === filteredQuestions.length - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#004481] hover:bg-[#005299] text-sky-200 text-xs font-bold transition disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Próxima</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Standard Banca Explanation */}
          {hasRevealed && (
            <div className="rounded-3xl bg-[#001D3D] border border-sky-500/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Gabarito Comentado Oficial: Alternativa {String.fromCharCode(65 + currentQ.correctIndex)}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
                {currentQ.explanation}
              </p>

              {currentQ.mnemonic && (
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs font-medium flex items-start gap-2.5">
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Mnemônico Caixa:</strong> {currentQ.mnemonic}</span>
                </div>
              )}

              {currentQ.legalBase && (
                <div className="text-[11px] text-slate-400 italic">
                  Base Legal: {currentQ.legalBase}
                </div>
              )}
            </div>
          )}

          {/* Gemini AI Tutor Deep Analysis Box */}
          {aiExplanation && (
            <div className="rounded-3xl bg-gradient-to-br from-[#002447] to-[#001933] border-2 border-sky-400/40 p-5 space-y-3 shadow-xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-300 font-extrabold text-xs sm:text-sm">
                  <Bot className="w-5 h-5 text-sky-400 animate-pulse" />
                  <span>Análise Pedagógica do Tutor CaixaMaster (IA)</span>
                </div>
                <button
                  onClick={() => onAskAITutor(`Tutor, ainda tenho dúvida sobre esta questão da Caixa: ${currentQ.statement}`)}
                  className="text-xs font-bold text-[#F39200] hover:underline"
                >
                  Abrir no Chat →
                </button>
              </div>

              <div className="text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-line bg-black/20 p-4 rounded-2xl border border-white/5">
                {aiExplanation}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
