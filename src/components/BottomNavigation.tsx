import React from 'react';
import { Map, HelpCircle, Timer, Bot, BarChart3, Trophy, Lightbulb, Award } from 'lucide-react';
import { playSound } from '../services/soundEffects';

export type NavTab = 'path' | 'questions' | 'simulado' | 'flashcards' | 'tutor' | 'achievements' | 'metrics' | 'ranking';

interface BottomNavigationProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  soundEnabled: boolean;
  unclaimedAchievementsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onTabChange,
  soundEnabled,
  unclaimedAchievementsCount = 0,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'path', label: 'Trilha', icon: <Map className="w-5 h-5" /> },
    { id: 'questions', label: 'Questões', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'simulado', label: 'Simulado', icon: <Timer className="w-5 h-5" />, badge: 'Foco' },
    { id: 'achievements', label: 'Conquistas', icon: <Award className="w-5 h-5 text-amber-400" />, badge: unclaimedAchievementsCount > 0 ? String(unclaimedAchievementsCount) : undefined },
    { id: 'flashcards', label: 'Macetes', icon: <Lightbulb className="w-5 h-5 text-amber-300" /> },
    { id: 'tutor', label: 'Tutor IA', icon: <Bot className="w-5 h-5 text-sky-400" />, badge: 'IA' },
    { id: 'metrics', label: 'Métricas', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'ranking', label: 'Ranking', icon: <Trophy className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#00172E]/95 backdrop-blur-lg border-t border-[#003366] safe-bottom px-2 py-1.5 shadow-2xl">
      <div className="max-w-xl mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (currentTab !== tab.id) {
                  playSound('click', soundEnabled);
                  onTabChange(tab.id);
                }
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-[#F39200] scale-105 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active glow indicator */}
              {isActive && (
                <span className="absolute -top-1 w-6 h-1 bg-[#F39200] rounded-full shadow-[0_0_8px_#F39200]" />
              )}
              
              <div className="relative">
                {tab.icon}
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 px-1 py-0.2 bg-[#F39200] text-slate-950 text-[9px] font-black rounded-full leading-tight">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight truncate max-w-[50px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
