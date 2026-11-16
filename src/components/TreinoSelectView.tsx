import { useState } from 'react';
import { AlertTriangle, Play, Shuffle } from 'lucide-react';
import { BANCO, IDS_CLASSIFICAR, IDS_LITERAL, IDS_PAREAR } from '../data/banco';
import type { ProgressMap, SessionConfig } from '../types/study';
import { baralhar, isFragil, maestriaMedia } from '../utils/storage';
import { MasteryIcon } from './MasteryIcon';

interface TreinoSelectViewProps {
  progress: ProgressMap;
  onStartSession: (config: SessionConfig) => void;
}

type ModeFilter = 'todos' | 'parear' | 'classificar' | 'literal';

export function TreinoSelectView({ progress, onStartSession }: TreinoSelectViewProps) {
  const [filter, setFilter] = useState<ModeFilter>('todos');

  const literalFragile = BANCO.literal.filter((q) => isFragil(progress, q.id));

  const renderGroupCard = (
    title: string,
    subtitle: string,
    ids: string[],
    onClick: () => void,
    hideFragile = false
  ) => {
    const avg = maestriaMedia(progress, ids);
    const pct = Math.round((avg / 3) * 100);
    const lvl = Math.min(3, Math.floor(avg)) as 0 | 1 | 2 | 3;
    const fragileCount = hideFragile ? 0 : ids.filter((id) => isFragil(progress, id)).length;

    return (
      <button
        key={title}
        type="button"
        onClick={onClick}
        className="min-h-[112px] p-4 rounded-xl bg-[#14120f] border border-[#2b2721] hover:border-[#c9a227]/70 active:scale-[0.99] text-left flex flex-col justify-between gap-3 transition-all cursor-pointer"
      >
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-[#e6dcc9] leading-snug">{title}</h3>
            <span className="inline-flex items-center gap-1 text-xs font-[family-name:var(--font-mono)] text-[#a89c86] tabular-nums shrink-0">
              <MasteryIcon level={lvl} size={13} />
              {avg.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-[#a89c86]">{subtitle}</p>
          {fragileCount > 0 && (
            <p className="inline-flex items-center gap-1 text-xs text-[#e0a89f] pt-0.5">
              <AlertTriangle size={12} aria-hidden="true" />
              {fragileCount} {fragileCount === 1 ? 'frágil' : 'frágeis'}
            </p>
          )}
        </div>

        <div className="w-full h-1.5 rounded-full bg-[#241f19] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#4d5c34] to-[#c9a227]"
            style={{ width: `${pct}%` }}
          />
        </div>
      </button>
    );
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#e6dcc9]">
          Escolhe o grupo
        </h1>
        <p className="text-xs sm:text-sm text-[#a89c86]">
          O treino livre entra direto na matéria sem esperar pelo relógio de 48h/7 dias.
        </p>
      </div>

      {/* Segmented Mode Filter */}
      <div
        role="tablist"
        aria-label="Filtrar modo de treino"
        className="grid grid-cols-4 gap-1 p-1 bg-[#14120f] border border-[#2b2721] rounded-xl"
      >
        {(
          [
            ['todos', 'Todos'],
            ['parear', 'Parear'],
            ['classificar', 'Colunas'],
            ['literal', 'Literal'],
          ] as [ModeFilter, string][]
        ).map(([id, label]) => {
          const active = filter === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(id)}
              className={`min-h-[40px] px-2 py-1.5 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                active
                  ? 'bg-[#241d0e] text-[#f2d480] border border-[#4a3c12]'
                  : 'text-[#a89c86] hover:text-[#e6dcc9] border border-transparent'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Parear */}
      {(filter === 'todos' || filter === 'parear') && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#a89c86]">Par: Campo → Elementos</h2>
            <button
              type="button"
              onClick={() => {
                const g = BANCO.parear[Math.floor(Math.random() * BANCO.parear.length)];
                onStartSession({
                  titulo: g.grupo,
                  rodadas: [{ kind: 'parear', grupo: g }],
                });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c9a227] hover:text-[#f2d480] py-1.5 cursor-pointer"
            >
              <Shuffle size={13} aria-hidden="true" />
              Sortear grupo
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BANCO.parear.map((g) =>
              renderGroupCard(
                g.grupo,
                `${g.fonte} · ${IDS_PAREAR[g.id].length} fichas`,
                IDS_PAREAR[g.id],
                () =>
                  onStartSession({
                    titulo: g.grupo,
                    rodadas: [{ kind: 'parear', grupo: g }],
                  })
              )
            )}
          </div>
        </section>
      )}

      {/* Classificar */}
      {(filter === 'todos' || filter === 'classificar') && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#a89c86]">Colunas</h2>
            <button
              type="button"
              onClick={() => {
                const s =
                  BANCO.classificar[Math.floor(Math.random() * BANCO.classificar.length)];
                onStartSession({
                  titulo: s.grupo,
                  rodadas: [{ kind: 'classificar', set: s }],
                });
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#c9a227] hover:text-[#f2d480] py-1.5 cursor-pointer"
            >
              <Shuffle size={13} aria-hidden="true" />
              Sortear conjunto
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {BANCO.classificar.map((s) =>
              renderGroupCard(
                s.grupo,
                `${s.fonte} · ${IDS_CLASSIFICAR[s.id].length} fichas`,
                IDS_CLASSIFICAR[s.id],
                () =>
                  onStartSession({
                    titulo: s.grupo,
                    rodadas: [{ kind: 'classificar', set: s }],
                  })
              )
            )}
          </div>
        </section>
      )}

      {/* Literal */}
      {(filter === 'todos' || filter === 'literal') && (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-[#a89c86]">
              A Palavra Literal ({IDS_LITERAL.length} armadilhas)
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {renderGroupCard(
              'Tiragem rápida (6)',
              'Seis armadilhas sorteadas na hora',
              IDS_LITERAL,
              () =>
                onStartSession({
                  titulo: 'A Palavra Literal · Rápida',
                  rodadas: [
                    { kind: 'literal', perguntas: baralhar(BANCO.literal).slice(0, 6) },
                  ],
                }),
              true
            )}
            {renderGroupCard(
              `Todas as ${IDS_LITERAL.length}`,
              'Volta completa pelas leis e fichas',
              IDS_LITERAL,
              () =>
                onStartSession({
                  titulo: 'A Palavra Literal · Completa',
                  rodadas: [{ kind: 'literal', perguntas: baralhar(BANCO.literal) }],
                }),
              true
            )}
            {literalFragile.length > 0 ? (
              renderGroupCard(
                `Só as frágeis (${literalFragile.length})`,
                'As questões que já derrubaram você',
                literalFragile.map((q) => q.id),
                () =>
                  onStartSession({
                    titulo: 'A Palavra Literal · Frágeis',
                    rodadas: [{ kind: 'literal', perguntas: baralhar(literalFragile) }],
                  })
              )
            ) : (
              <div className="min-h-[112px] p-4 rounded-xl bg-[#110f0c] border border-dashed border-[#2b2721] flex flex-col justify-center gap-1">
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-[#a89c86]">
                  <Play size={14} aria-hidden="true" />
                  Sem literais frágeis
                </span>
                <span className="text-xs text-[#7d7466]">
                  Qualquer literal com mais erros que acertos aparece aqui.
                </span>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
