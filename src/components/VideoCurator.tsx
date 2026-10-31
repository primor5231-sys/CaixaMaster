import React, { useState } from 'react';
import { VideoLesson, SubjectId, UserProfile } from '../types';
import { CURATED_VIDEOS, SUBJECTS } from '../data/mockCurriculum';
import { Video, Play, ExternalLink, CheckCircle, Clock, Sparkles, X } from 'lucide-react';
import { playSound } from '../services/soundEffects';

interface VideoCuratorProps {
  profile: UserProfile;
  onRewardXP: (xp: number, coins: number) => void;
}

export const VideoCurator: React.FC<VideoCuratorProps> = ({ profile, onRewardXP }) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [activeVideo, setActiveVideo] = useState<VideoLesson | null>(null);
  const [watchedVideos, setWatchedVideos] = useState<string[]>([]);

  const filteredVideos = CURATED_VIDEOS.filter((v) => {
    if (selectedSubject !== 'all' && v.subjectId !== selectedSubject) return false;
    return true;
  });

  const handleWatchVideo = (vid: VideoLesson) => {
    playSound('click', profile.soundEnabled);
    setActiveVideo(vid);

    if (!watchedVideos.includes(vid.id)) {
      setWatchedVideos([...watchedVideos, vid.id]);
      onRewardXP(25, 10);
      playSound('coin', profile.soundEnabled);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-28 pt-4 space-y-6 text-white">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004481] border border-sky-400/30 text-sky-300 text-xs font-bold uppercase tracking-wider mb-1">
          <Video className="w-3.5 h-3.5" />
          <span>Curadoria de Videoaulas CEF</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black">
          Aulas Estratégicas para o Concurso da Caixa
        </h1>
        <p className="text-xs text-slate-300 mt-0.5">
          Seleção direta dos melhores professores do Brasil focados nos tópicos do edital CEF.
        </p>
      </div>

      {/* Filter by subject */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedSubject('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
            selectedSubject === 'all'
              ? 'bg-[#F39200] text-slate-950 shadow-md'
              : 'bg-[#002244] border border-[#003870] text-slate-300 hover:text-white'
          }`}
        >
          Todas ({CURATED_VIDEOS.length})
        </button>

        {SUBJECTS.map((sub) => {
          const count = CURATED_VIDEOS.filter((v) => v.subjectId === sub.id).length;
          if (count === 0) return null;
          return (
            <button
              key={sub.id}
              onClick={() => setSelectedSubject(sub.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedSubject === sub.id
                  ? 'bg-[#0066B2] text-white border border-sky-400 shadow-md'
                  : 'bg-[#002244] border border-[#003870] text-slate-300 hover:text-white'
              }`}
            >
              <span>{sub.icon}</span>
              <span>{sub.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredVideos.map((video) => {
          const isWatched = watchedVideos.includes(video.id);

          return (
            <div
              key={video.id}
              className="rounded-3xl bg-[#002244] border border-[#003870] hover:border-sky-400/40 p-4 shadow-xl transition flex flex-col justify-between group"
            >
              <div>
                {/* Video thumbnail simulation */}
                <div
                  onClick={() => handleWatchVideo(video)}
                  className="relative aspect-video rounded-2xl bg-gradient-to-br from-[#001D3D] to-[#003366] border border-white/10 flex items-center justify-center cursor-pointer overflow-hidden mb-3 group-hover:scale-[1.02] transition"
                >
                  <div className="w-12 h-12 rounded-full bg-[#F39200] text-slate-950 flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </div>
                  <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-[10px] font-mono text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" />
                    <span>{video.duration}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[11px] font-bold text-[#FFA41C]">
                    {video.topic}
                  </span>
                  {isWatched && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> Assistida
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                  {video.title}
                </h3>

                <p className="text-xs text-slate-400 mt-1">
                  {video.instructor} • <span className="text-sky-300">{video.channel}</span>
                </p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-3">
                <span className="text-[11px] font-extrabold text-amber-300">
                  +25 XP por aula assistida
                </span>
                <button
                  onClick={() => handleWatchVideo(video)}
                  className="px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>Assistir</span>
                  <Play className="w-3 h-3 fill-sky-300" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Embedded Video Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6">
          <div className="w-full max-w-3xl bg-[#002244] border-2 border-sky-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="p-4 border-b border-[#003870] flex items-center justify-between bg-[#001D3D]">
              <div className="flex items-center gap-2">
                <span className="text-xl">📺</span>
                <h3 className="text-sm font-bold text-white truncate max-w-sm">
                  {activeVideo.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="p-4 bg-[#00172E] flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-sky-300">{activeVideo.instructor}</span> • {activeVideo.channel}
              </div>
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                <span>+25 XP creditados ao seu perfil!</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
