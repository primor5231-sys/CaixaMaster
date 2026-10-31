-- ==============================================================================
-- CAIXAMASTER PWA - SCHEMA DE BANCO DE DADOS SUPABASE (POSTGRESQL)
-- Arquitetura completa para preparação de concursos CEF com gamificação Duolingo
-- ==============================================================================

-- 1. Extensões essenciais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Tabela de Perfis de Usuários (Integrada com Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Concurseiro Caixa',
    avatar TEXT NOT NULL DEFAULT '👨‍💼',
    target_role TEXT NOT NULL DEFAULT 'Técnico Bancário Novo - Geral',
    target_polo TEXT NOT NULL DEFAULT 'São Paulo - Polo Capital / Matriz',
    daily_goal_minutes INTEGER NOT NULL DEFAULT 60,
    studied_minutes_today INTEGER NOT NULL DEFAULT 0,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 1,
    hearts INTEGER NOT NULL DEFAULT 5,
    max_hearts INTEGER NOT NULL DEFAULT 5,
    coins INTEGER NOT NULL DEFAULT 50,
    streak INTEGER NOT NULL DEFAULT 1,
    streak_freeze_count INTEGER NOT NULL DEFAULT 1,
    last_studied_date DATE NOT NULL DEFAULT CURRENT_DATE,
    theme TEXT NOT NULL DEFAULT 'dark',
    sound_enabled BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Matérias do Edital da Caixa
CREATE TABLE IF NOT EXISTS public.subjects (
    id TEXT PRIMARY KEY, -- 'bancarios', 'portugues', 'matematica', 'estatistica', 'direito_adm', 'ti', 'atendimento', 'legislacao'
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Módulos e Trilhas de Aprendizado
CREATE TABLE IF NOT EXISTS public.modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Micro-aulas (Nodes da Trilha Duolingo)
CREATE TABLE IF NOT EXISTS public.lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '🏛️',
    xp_reward INTEGER NOT NULL DEFAULT 30,
    coins_reward INTEGER NOT NULL DEFAULT 15,
    slides JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de slides com { title, content, highlightBox, mnemonic }
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela de Banco de Questões Comentadas
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    banca TEXT NOT NULL DEFAULT 'Cesgranrio', -- 'Cesgranrio', 'Cebraspe', 'FGV', 'FCC', 'Caixa Inédita'
    year INTEGER NOT NULL DEFAULT 2024,
    statement TEXT NOT NULL,
    options JSONB NOT NULL, -- Array com 5 alternativas ["A", "B", "C", "D", "E"]
    correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index <= 4),
    explanation TEXT NOT NULL,
    mnemonic TEXT,
    legal_base TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Histórico de Resoluções do Aluno
CREATE TABLE IF NOT EXISTS public.user_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    selected_index INTEGER NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, question_id)
);

-- 8. Registro de Conclusão de Aulas
CREATE TABLE IF NOT EXISTS public.user_completed_lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, lesson_id)
);

-- 9. Registro de Atividade Diária e Consistência (Alimenta o Gráfico Recharts)
CREATE TABLE IF NOT EXISTS public.user_daily_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    study_date DATE NOT NULL DEFAULT CURRENT_DATE,
    minutes_studied INTEGER NOT NULL DEFAULT 0,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    questions_answered INTEGER NOT NULL DEFAULT 0,
    goal_achieved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, study_date)
);

-- 10. Mnemônicos e Flashcards Rápidos
CREATE TABLE IF NOT EXISTS public.flashcards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id TEXT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    concept TEXT NOT NULL,
    mnemonic TEXT NOT NULL,
    details TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Conquistas e Badges Desbloqueadas
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- ==============================================================================
-- TRIGGER AUTOMÁTICO: Cria perfil em public.profiles quando usuário se registra
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar, target_role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'Concurseiro Caixa'),
    COALESCE(new.raw_user_meta_data->>'avatar', '👨‍💼'),
    COALESCE(new.raw_user_meta_data->>'target_role', 'Técnico Bancário Novo - Geral')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) - SEGURANÇA POR USUÁRIO
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_completed_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública para Conteúdo
CREATE POLICY "Conteúdo público para leitura" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Módulos públicos para leitura" ON public.modules FOR SELECT USING (true);
CREATE POLICY "Aulas públicas para leitura" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Questões públicas para leitura" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Flashcards públicos para leitura" ON public.flashcards FOR SELECT USING (true);

-- Políticas de Usuário Autenticado para Perfil e Respostas
CREATE POLICY "Usuário gerencia seu próprio perfil" ON public.profiles
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Usuário gerencia suas respostas" ON public.user_answers
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas aulas concluídas" ON public.user_completed_lessons
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia sua atividade diária" ON public.user_daily_activity
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Usuário gerencia suas conquistas" ON public.user_achievements
    FOR ALL USING (auth.uid() = user_id);

-- View para Ranking Semanal (Liga dos Bancários)
CREATE OR REPLACE VIEW public.weekly_leaderboard AS
SELECT 
    p.id,
    p.name,
    p.avatar,
    p.target_role,
    p.xp,
    p.streak,
    RANK() OVER (ORDER BY p.xp DESC) as rank_position
FROM public.profiles p
ORDER BY p.xp DESC
LIMIT 50;
