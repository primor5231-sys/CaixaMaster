import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside an installed PWA window, hide
  if (isInstalled) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>PWA Instalado</span>
      </div>
    );
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#F39200] to-[#FFA41C] text-slate-950 font-bold px-3 py-1.5 text-xs shadow-lg hover:shadow-orange-500/20 active:scale-95 transition-all cursor-pointer"
        title="Instalar CaixaMaster como App"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span className="hidden sm:inline">Instalar App</span>
        <span className="sm:hidden">Instalar</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Instalar no iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-[#002244] border border-[#0066B2] p-6 shadow-2xl text-slate-100">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📲</span>
                  <h3 className="text-lg font-bold text-white">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Tenha a melhor experiência com tela cheia, alertas de ofensiva diária e estudos sem barra de navegação:
              </p>

              <ol className="space-y-3 text-sm text-slate-200">
                <li className="flex items-start gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004481] text-sky-300 flex items-center justify-center font-bold text-xs">1</span>
                  <span>Toque no botão <strong>Compartilhar</strong> (ícone do quadrado com a seta para cima) na barra do Safari.</span>
                </li>
                <li className="flex items-start gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004481] text-sky-300 flex items-center justify-center font-bold text-xs">2</span>
                  <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
                </li>
                <li className="flex items-start gap-3 bg-white/5 p-2.5 rounded-xl border border-white/5">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#004481] text-sky-300 flex items-center justify-center font-bold text-xs">3</span>
                  <span>Toque em <strong>Adicionar</strong> no canto superior direito.</span>
                </li>
              </ol>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#F39200] text-slate-950 font-bold py-2.5 text-sm hover:bg-[#FFA41C] transition cursor-pointer"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Fallback for desktop or non-prompting browsers
  return (
    <button
      onClick={() => {
        alert('Para instalar o CaixaMaster PWA: no Chrome ou Edge, clique no ícone de instalação ao lado da barra de endereços (ou no menu ⋮ > Instalar CaixaMaster).');
      }}
      className="hidden md:flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-300 px-2.5 py-1.5 text-xs font-medium transition cursor-pointer"
    >
      <Download className="w-3.5 h-3.5 text-sky-400" />
      <span>Instalar PWA</span>
    </button>
  );
};
