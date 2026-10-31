import { Achievement, AchievementCategory, AchievementTier, UserProfile } from '../types';
import { saveUserProfile, addXP } from './storageService';

interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;
  badgeBg: string;
  badgeBorder: string;
  targetValue: number;
  metric: 'streak' | 'questions_answered' | 'questions_correct' | 'simulado' | 'lesson' | 'coins' | 'checkins' | 'pwa';
  rewardXP: number;
  rewardCoins: number;
  criteriaLabel: string;
  lore: string;
}

export const ACHIEVEMENTS_DEFINITIONS: AchievementDef[] = [
  // --- OFENSIVA & DIAS DE ESTUDO (STREAK) ---
  {
    id: 'streak_1',
    title: 'Primeiro Passo',
    description: 'Iniciou sua jornada de preparação com 1 dia de estudo registrado.',
    category: 'streak',
    tier: 'bronze',
    icon: '⚡',
    badgeBg: 'from-amber-600/30 to-orange-800/20',
    badgeBorder: 'border-amber-600/40',
    targetValue: 1,
    metric: 'streak',
    rewardXP: 50,
    rewardCoins: 20,
    criteriaLabel: '1 dia de ofensiva',
    lore: 'Toda aprovação na Caixa começa com a decisão corajosa de dar o primeiro passo no edital.',
  },
  {
    id: 'streak_3',
    title: 'Hábito em Formação',
    description: 'Mantenha 3 dias consecutivos de ofensiva e garanta consistência.',
    category: 'streak',
    tier: 'bronze',
    icon: '🔥',
    badgeBg: 'from-orange-600/30 to-amber-700/20',
    badgeBorder: 'border-orange-500/50',
    targetValue: 3,
    metric: 'streak',
    rewardXP: 100,
    rewardCoins: 35,
    criteriaLabel: '3 dias de ofensiva',
    lore: 'O cérebro começa a transformar o estudo diário em hábito natural e foco focado na vaga.',
  },
  {
    id: 'streak_5',
    title: 'Ritmo Concurseiro',
    description: 'Completou 5 dias consecutivos de preparação focada no edital CEF.',
    category: 'streak',
    tier: 'silver',
    icon: '🚀',
    badgeBg: 'from-sky-600/30 to-blue-800/20',
    badgeBorder: 'border-sky-400/50',
    targetValue: 5,
    metric: 'streak',
    rewardXP: 150,
    rewardCoins: 50,
    criteriaLabel: '5 dias de ofensiva',
    lore: 'Você já superou a fase de hesitação e está entre os concurseiros mais constantes do polo!',
  },
  {
    id: 'streak_10',
    title: 'Ofensiva de Titânio (10 Dias)',
    description: 'Mantenha uma sequência imparável de 10 dias seguidos de estudo!',
    category: 'streak',
    tier: 'gold',
    icon: '👑',
    badgeBg: 'from-amber-500/30 via-[#F39200]/25 to-yellow-600/20',
    badgeBorder: 'border-amber-400',
    targetValue: 10,
    metric: 'streak',
    rewardXP: 300,
    rewardCoins: 120,
    criteriaLabel: '10 dias de ofensiva',
    lore: 'Disciplina inabalável. Quem estuda 10 dias seguidos sem desanimar conquista a vaga de Técnico Bancário.',
  },
  {
    id: 'streak_14',
    title: 'Quinzena da Posse',
    description: 'Conquistou 14 dias (duas semanas ininterruptas) de ofensiva acesa.',
    category: 'streak',
    tier: 'diamond',
    icon: '💎',
    badgeBg: 'from-cyan-500/30 to-blue-600/20',
    badgeBorder: 'border-cyan-400',
    targetValue: 14,
    metric: 'streak',
    rewardXP: 450,
    rewardCoins: 180,
    criteriaLabel: '14 dias de ofensiva',
    lore: 'Duas semanas seguidas colocam seu domínio de Conhecimentos Bancários e Português no topo da Cesgranrio.',
  },
  {
    id: 'streak_30',
    title: 'Lenda da Caixa (30 Dias)',
    description: 'Manteve 30 dias ininterruptos de estudos! O crachá da CEF já é seu.',
    category: 'streak',
    tier: 'master',
    icon: '🏛️',
    badgeBg: 'from-purple-600/30 via-indigo-600/20 to-blue-900/30',
    badgeBorder: 'border-purple-400',
    targetValue: 30,
    metric: 'streak',
    rewardXP: 800,
    rewardCoins: 350,
    criteriaLabel: '30 dias de ofensiva',
    lore: 'O nível mais alto de maestria e comprometimento com o serviço público bancário federal.',
  },

  // --- QUESTÕES & RESOLUÇÃO (QUESTIONS) ---
  {
    id: 'q_1',
    title: 'Primeiro Gabarito',
    description: 'Resolveu sua primeira questão oficial do banco da CaixaMaster.',
    category: 'questions',
    tier: 'bronze',
    icon: '🎯',
    badgeBg: 'from-emerald-600/30 to-teal-800/20',
    badgeBorder: 'border-emerald-500/50',
    targetValue: 1,
    metric: 'questions_answered',
    rewardXP: 40,
    rewardCoins: 15,
    criteriaLabel: '1 questão resolvida',
    lore: 'A teoria ganha vida quando você analisa os enunciados da Cesgranrio e Cebraspe.',
  },
  {
    id: 'q_10',
    title: 'Aquecendo os Motores',
    description: 'Responda a 10 questões de qualquer matéria do edital CEF.',
    category: 'questions',
    tier: 'bronze',
    icon: '📝',
    badgeBg: 'from-sky-600/30 to-blue-700/20',
    badgeBorder: 'border-sky-400/50',
    targetValue: 10,
    metric: 'questions_answered',
    rewardXP: 100,
    rewardCoins: 35,
    criteriaLabel: '10 questões resolvidas',
    lore: 'Detectando as primeiras pegadinhas clássicas de banca e fixando conceitos normativos.',
  },
  {
    id: 'q_25',
    title: 'Praticante Focado',
    description: 'Responda a 25 questões do banco oficial de provas da Caixa.',
    category: 'questions',
    tier: 'silver',
    icon: '📊',
    badgeBg: 'from-indigo-600/30 to-sky-800/20',
    badgeBorder: 'border-indigo-400/50',
    targetValue: 25,
    metric: 'questions_answered',
    rewardXP: 180,
    rewardCoins: 60,
    criteriaLabel: '25 questões resolvidas',
    lore: 'Seu percentual de acertos começa a se estabilizar em patamares competitivos.',
  },
  {
    id: 'q_50',
    title: 'Especialista em Bancas',
    description: 'Responda a 50 questões do edital da Caixa Econômica Federal.',
    category: 'questions',
    tier: 'silver',
    icon: '🔍',
    badgeBg: 'from-purple-600/30 to-pink-800/20',
    badgeBorder: 'border-purple-400/50',
    targetValue: 50,
    metric: 'questions_answered',
    rewardXP: 280,
    rewardCoins: 100,
    criteriaLabel: '50 questões resolvidas',
    lore: 'Você já consegue antecipar a resposta certa antes mesmo de terminar de ler as alternativas!',
  },
  {
    id: 'q_100',
    title: 'Centurião do Concurso (100 Questões)',
    description: 'Atingiu a marca histórica de 100 questões respondidas com comentário!',
    category: 'questions',
    tier: 'gold',
    icon: '💯',
    badgeBg: 'from-amber-500/30 via-[#F39200]/30 to-yellow-600/30',
    badgeBorder: 'border-amber-400',
    targetValue: 100,
    metric: 'questions_answered',
    rewardXP: 500,
    rewardCoins: 200,
    criteriaLabel: '100 questões resolvidas',
    lore: 'Quem resolve 100 questões com método e análise crítica entra para disputar as primeiras vagas no polo.',
  },
  {
    id: 'q_correct_50',
    title: 'Precisão Cirúrgica',
    description: 'Acertou 50 questões com gabarito correto no banco de questões.',
    category: 'questions',
    tier: 'gold',
    icon: '✨',
    badgeBg: 'from-emerald-500/30 to-teal-600/30',
    badgeBorder: 'border-emerald-400',
    targetValue: 50,
    metric: 'questions_correct',
    rewardXP: 400,
    rewardCoins: 150,
    criteriaLabel: '50 acertos confirmados',
    lore: 'Alta taxa de assertividade, fundamental para superar a concorrência acirrada.',
  },

  // --- SIMULADOS & EXAMES (SIMULADO) ---
  {
    id: 'sim_1',
    title: 'Batismo de Prova',
    description: 'Finalizou seu 1º Simulado Cronometrado no padrão oficial da Cesgranrio.',
    category: 'simulado',
    tier: 'bronze',
    icon: '⏱️',
    badgeBg: 'from-sky-600/30 to-blue-800/20',
    badgeBorder: 'border-sky-400/40',
    targetValue: 1,
    metric: 'simulado',
    rewardXP: 150,
    rewardCoins: 50,
    criteriaLabel: '1 simulado completo',
    lore: 'Treinar com cronômetro desenvolve controle emocional e gestão de tempo para o dia da prova.',
  },
  {
    id: 'sim_3',
    title: 'Resistência de Gabarito',
    description: 'Finalizou 3 simulados cronometrados com foco total.',
    category: 'simulado',
    tier: 'silver',
    icon: '🛡️',
    badgeBg: 'from-indigo-600/30 to-blue-700/20',
    badgeBorder: 'border-indigo-400/50',
    targetValue: 3,
    metric: 'simulado',
    rewardXP: 300,
    rewardCoins: 120,
    criteriaLabel: '3 simulados completos',
    lore: 'Sua resistência para provas longas de 5 horas foi testada e aprovada.',
  },

  // --- TRILHA & CONHECIMENTO (CURRICULUM) ---
  {
    id: 'lesson_1',
    title: 'Pé na Agência',
    description: 'Concluiu sua primeira micro-aula interativa com quiz na Trilha.',
    category: 'curriculum',
    tier: 'bronze',
    icon: '📖',
    badgeBg: 'from-blue-600/30 to-sky-800/20',
    badgeBorder: 'border-blue-400/40',
    targetValue: 1,
    metric: 'lesson',
    rewardXP: 60,
    rewardCoins: 25,
    criteriaLabel: '1 micro-aula concluída',
    lore: 'Conhecendo a estrutura e a história centenária da Caixa Econômica Federal.',
  },
  {
    id: 'lesson_3',
    title: 'Mestre do Módulo',
    description: 'Concluiu 3 micro-aulas completas na Trilha de Aprendizado.',
    category: 'curriculum',
    tier: 'silver',
    icon: '🎓',
    badgeBg: 'from-emerald-600/30 to-sky-700/20',
    badgeBorder: 'border-emerald-400/40',
    targetValue: 3,
    metric: 'lesson',
    rewardXP: 180,
    rewardCoins: 70,
    criteriaLabel: '3 micro-aulas concluídas',
    lore: 'Dominando o Sistema Financeiro Nacional, CMN, BACEN e Produtos Sociais.',
  },

  // --- ECONOMIA & CHECK-INS (ECONOMY) ---
  {
    id: 'coins_200',
    title: 'Poupança Caixa',
    description: 'Acumulou 200 CaixaCoins no cofre do seu perfil.',
    category: 'economy',
    tier: 'silver',
    icon: '🪙',
    badgeBg: 'from-amber-600/30 to-yellow-700/20',
    badgeBorder: 'border-amber-400/50',
    targetValue: 200,
    metric: 'coins',
    rewardXP: 120,
    rewardCoins: 50,
    criteriaLabel: '200 CaixaCoins no saldo',
    lore: 'Como bom bancário da Caixa, você sabe valorizar e gerenciar suas reservas!',
  },
  {
    id: 'checkin_5',
    title: 'Fidelidade Diária',
    description: 'Realizou 5 resgates no Bônus de Check-in Diário.',
    category: 'economy',
    tier: 'gold',
    icon: '🎁',
    badgeBg: 'from-purple-600/30 to-amber-600/20',
    badgeBorder: 'border-amber-400',
    targetValue: 5,
    metric: 'checkins',
    rewardXP: 250,
    rewardCoins: 100,
    criteriaLabel: '5 check-ins realizados',
    lore: 'A pontualidade é um dos valores fundamentais exigidos pelo Código de Conduta da CEF.',
  },
];

/**
 * Calculates current progress for all achievements based on the live user profile.
 */
export function getAchievementsWithProgress(profile: UserProfile): Achievement[] {
  const answeredQuestionIds = profile.answeredQuestionIds || {};
  const questionsAnsweredCount = Object.keys(answeredQuestionIds).length;
  const questionsCorrectCount = Object.values(answeredQuestionIds).filter((q) => q.isCorrect).length;
  const currentStreak = profile.checkInStreak ?? profile.streak ?? 0;
  const lessonsCompletedCount = (profile.completedLessonIds || []).length;
  const simuladosCompletedCount = profile.simuladosCompleted ?? 1; // Default to 1 from baseline study
  const coinsCount = profile.coins ?? 0;
  const checkinsCount = (profile.claimedCheckInDays || []).length;
  const claimedSet = new Set(profile.claimedAchievementIds || ['streak_1', 'q_1', 'lesson_1']);

  return ACHIEVEMENTS_DEFINITIONS.map((def) => {
    let currentValue = 0;

    switch (def.metric) {
      case 'streak':
        currentValue = currentStreak;
        break;
      case 'questions_answered':
        currentValue = questionsAnsweredCount;
        break;
      case 'questions_correct':
        currentValue = questionsCorrectCount;
        break;
      case 'simulado':
        currentValue = simuladosCompletedCount;
        break;
      case 'lesson':
        currentValue = lessonsCompletedCount;
        break;
      case 'coins':
        currentValue = coinsCount;
        break;
      case 'checkins':
        currentValue = checkinsCount;
        break;
      case 'pwa':
        currentValue = 1;
        break;
    }

    const unlocked = currentValue >= def.targetValue;
    const claimed = claimedSet.has(def.id);
    const progressPercent = Math.min(100, Math.round((currentValue / def.targetValue) * 100));

    return {
      id: def.id,
      title: def.title,
      description: def.description,
      category: def.category,
      tier: def.tier,
      icon: def.icon,
      badgeBg: def.badgeBg,
      badgeBorder: def.badgeBorder,
      targetValue: def.targetValue,
      currentValue,
      progressPercent,
      rewardXP: def.rewardXP,
      rewardCoins: def.rewardCoins,
      unlocked,
      claimed,
      criteriaLabel: def.criteriaLabel,
      lore: def.lore,
    };
  });
}

/**
 * Returns the count of achievements that are unlocked and waiting to be claimed.
 */
export function getUnclaimedAchievementsCount(profile: UserProfile): number {
  const achievements = getAchievementsWithProgress(profile);
  return achievements.filter((a) => a.unlocked && !a.claimed).length;
}

/**
 * Claims the reward for an unlocked achievement, awarding XP and coins to the user profile.
 */
export function claimAchievementReward(
  profile: UserProfile,
  achievementId: string
): { updatedProfile: UserProfile; achievement: Achievement | null } {
  const achievements = getAchievementsWithProgress(profile);
  const target = achievements.find((a) => a.id === achievementId);

  if (!target || !target.unlocked || target.claimed) {
    return { updatedProfile: profile, achievement: null };
  }

  const currentClaimed = Array.isArray(profile.claimedAchievementIds)
    ? [...profile.claimedAchievementIds]
    : ['streak_1', 'q_1', 'lesson_1'];

  if (!currentClaimed.includes(achievementId)) {
    currentClaimed.push(achievementId);
  }

  const profileWithClaimed: UserProfile = {
    ...profile,
    claimedAchievementIds: currentClaimed,
  };

  const updatedProfile = addXP(profileWithClaimed, target.rewardXP, target.rewardCoins);
  saveUserProfile(updatedProfile);

  return {
    updatedProfile,
    achievement: { ...target, claimed: true },
  };
}
