import { Pause, Play, RotateCcw, RotateCw, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { AULAS } from '../data/banco';
import { formatTime, type LessonPlayerState } from '../hooks/useLessonPlayer';

interface AulasViewProps {
  player: LessonPlayerState;
}

const SPEEDS = [1.0, 1.25, 1.5, 1.75, 2.0];

export function AulasView({ player }: AulasViewProps) {
  const aula = AULAS[player.aulaIdx] ?? AULAS[0];
  const progressPct = player.duration > 0 ? Math.min(100, (player.currentTime / player.duration) * 100) : 0;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#e6dcc9]">
          O Caderno para o Ouvido
        </h1>
        <p className="text-xs sm:text-sm text-[#a89c86]">
          Cinco aulas faladas mais a abertura do Caderno — explicam os eixos mais cobrados da
          prova com narração integrada.
        </p>
      </div>

      {/* Active Player Card */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#14120e] border border-[#4a3c12] space-y-4">
        <div className="flex items-center justify-between gap-2 text-xs text-[#a89c86]">
          <span className="font-medium text-[#c9a227]">
            Aula {aula.numero} · {player.mode === 'audio' ? 'Áudio original' : 'Narrador de voz'}
          </span>
          <span className="font-[family-name:var(--font-mono)] tabular-nums">
            {aula.duracaoTexto}
          </span>
        </div>

        <div className="space-y-0.5">
          <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#e6dcc9]">
            {aula.titulo}
          </h2>
          <p className="text-xs text-[#a89c86]">{aula.subtitulo}</p>
        </div>

        {/* Scrubber */}
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-mono)] text-xs text-[#a89c86] tabular-nums w-10">
            {formatTime(player.currentTime)}
          </span>
          <input
            type="range"
            aria-label="Posição da aula"
            min={0}
            max={100}
            step={0.5}
            value={progressPct}
            onChange={(e) => player.seekPct(parseFloat(e.target.value) / 100)}
            className="flex-1 h-2 bg-[#2b2721] rounded-full accent-[#c9a227] cursor-pointer"
          />
          <span className="font-[family-name:var(--font-mono)] text-xs text-[#a89c86] tabular-nums w-10 text-right">
            {formatTime(player.duration)}
          </span>
        </div>

        {/* Controls (44px+ targets) */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Aula anterior"
            disabled={player.aulaIdx <= 0}
            onClick={() => player.load(player.aulaIdx - 1, true)}
            className="w-11 h-11 rounded-full bg-[#1c1915] border border-[#3a332a] hover:border-[#c9a227] disabled:opacity-40 flex items-center justify-center text-[#e6dcc9] cursor-pointer"
          >
            <SkipBack size={17} />
          </button>

          <button
            type="button"
            aria-label="Voltar tópico"
            onClick={() => player.skip(-15)}
            className="w-11 h-11 rounded-full bg-[#1c1915] border border-[#3a332a] hover:border-[#c9a227] flex items-center justify-center text-[#e6dcc9] cursor-pointer"
          >
            <RotateCcw size={17} />
          </button>

          <button
            type="button"
            aria-label={player.playing ? 'Pausar aula' : 'Ouvir aula'}
            onClick={player.toggle}
            className="w-14 h-14 rounded-full bg-[#241d0e] border border-[#c9a227] hover:bg-[#322814] flex items-center justify-center text-[#ffeec2] cursor-pointer transition-transform active:scale-95"
          >
            {player.playing ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
          </button>

          <button
            type="button"
            aria-label="Avançar tópico"
            onClick={() => player.skip(15)}
            className="w-11 h-11 rounded-full bg-[#1c1915] border border-[#3a332a] hover:border-[#c9a227] flex items-center justify-center text-[#e6dcc9] cursor-pointer"
          >
            <RotateCw size={17} />
          </button>

          <button
            type="button"
            aria-label="Próxima aula"
            disabled={player.aulaIdx >= AULAS.length - 1}
            onClick={() => player.load(player.aulaIdx + 1, true)}
            className="w-11 h-11 rounded-full bg-[#1c1915] border border-[#3a332a] hover:border-[#c9a227] disabled:opacity-40 flex items-center justify-center text-[#e6dcc9] cursor-pointer"
          >
            <SkipForward size={17} />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <span className="text-xs text-[#a89c86] mr-1">Velocidade:</span>
          {SPEEDS.map((v) => {
            const active = Math.abs(player.vel - v) < 0.05;
            return (
              <button
                key={v}
                type="button"
                onClick={() => player.setSpeed(v)}
                className={`min-h-[36px] px-2.5 py-1 rounded-lg text-xs font-[family-name:var(--font-mono)] border transition-colors cursor-pointer ${
                  active
                    ? 'bg-[#1f1a10] border-[#c9a227] text-[#f2d480] font-semibold'
                    : 'bg-transparent border-[#2b2721] text-[#a89c86] hover:text-[#e6dcc9]'
                }`}
              >
                {v.toString().replace(/\.0$/, '')}x
              </button>
            );
          })}
        </div>
      </section>

      {/* Lesson List */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-[#a89c86]">As 5 Aulas + Abertura</h2>
        <div className="space-y-3">
          {AULAS.map((a, idx) => {
            const active = idx === player.aulaIdx;
            return (
              <div
                key={a.id}
                className={`p-4 rounded-xl border transition-colors ${
                  active
                    ? 'bg-[#17140e] border-[#c9a227]'
                    : 'bg-[#14120f] border-[#2b2721]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => player.load(idx, true)}
                    aria-label={`Ouvir aula ${a.numero}: ${a.titulo}`}
                    className={`w-11 h-11 rounded-xl border font-[family-name:var(--font-mono)] text-sm font-semibold flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                      active
                        ? 'bg-[#2b2210] border-[#c9a227] text-[#f2d480]'
                        : 'bg-[#1b1814] border-[#332d24] text-[#c9a227] hover:border-[#c9a227]'
                    }`}
                  >
                    {active && player.playing ? <Volume2 size={18} /> : a.numero}
                  </button>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => player.load(idx, true)}
                        className="text-left text-base font-semibold text-[#e6dcc9] hover:text-[#f2d480] leading-snug cursor-pointer"
                      >
                        {a.titulo}
                      </button>
                      <span className="text-xs font-[family-name:var(--font-mono)] text-[#a89c86] tabular-nums shrink-0">
                        {a.duracaoTexto}
                      </span>
                    </div>
                    <p className="text-xs text-[#a89c86]">{a.subtitulo}</p>

                    <ul className="pt-2 space-y-1.5">
                      {a.topicos.map((topico, tIdx) => {
                        const isReadingThis =
                          active && player.playing && player.topicIdx === tIdx + 1;
                        return (
                          <li key={tIdx}>
                            <button
                              type="button"
                              onClick={() => {
                                if (!active) {
                                  player.load(idx, true);
                                } else {
                                  player.selectTopic(tIdx + 1);
                                }
                              }}
                              className={`text-left text-xs leading-relaxed transition-colors cursor-pointer ${
                                isReadingThis
                                  ? 'text-[#f2d480] font-medium'
                                  : 'text-[#a89c86] hover:text-[#e6dcc9]'
                              }`}
                            >
                              • {topico}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
