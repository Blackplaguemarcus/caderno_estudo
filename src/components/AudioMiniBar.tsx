import { Pause, Play } from 'lucide-react';
import { AULAS } from '../data/banco';
import type { LessonPlayerState } from '../hooks/useLessonPlayer';

interface AudioMiniBarProps {
  player: LessonPlayerState;
  onOpenAulas: () => void;
}

export function AudioMiniBar({ player, onOpenAulas }: AudioMiniBarProps) {
  if (!player.playing) return null;
  const aula = AULAS[player.aulaIdx] ?? AULAS[0];

  return (
    <div className="fixed bottom-[64px] md:bottom-4 left-3 right-3 md:left-auto md:right-6 md:w-80 z-30 bg-[#17140e]/95 backdrop-blur-md border border-[#4a3c12] rounded-xl px-3 py-2 flex items-center gap-2.5 shadow-lg">
      <button
        type="button"
        onClick={onOpenAulas}
        className="flex-1 min-w-0 text-left cursor-pointer"
      >
        <div className="text-xs font-semibold text-[#f2d480] truncate">
          Aula {aula.numero} · {aula.titulo}
        </div>
        <div className="text-[11px] text-[#a89c86] truncate">
          Toque para abrir o leitor
        </div>
      </button>

      <button
        type="button"
        aria-label={player.playing ? 'Pausar aula' : 'Continuar aula'}
        onClick={player.toggle}
        className="w-10 h-10 rounded-lg bg-[#241d0e] border border-[#c9a227] flex items-center justify-center text-[#ffeec2] shrink-0 cursor-pointer"
      >
        {player.playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
    </div>
  );
}
