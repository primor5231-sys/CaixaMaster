import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 right-4 md:right-auto md:w-auto z-50 flex items-center gap-2.5 rounded-2xl bg-amber-600/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-white shadow-xl border border-amber-400/40 animate-bounce">
      <WifiOff className="w-4 h-4 text-amber-200" />
      <span>Modo Offline: Seu progresso e questões estão sendo salvos localmente no dispositivo.</span>
    </div>
  );
};
