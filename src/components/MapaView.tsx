import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Music, Trash2, Upload } from 'lucide-react';
import { MECANISMOS, mecanismoDe, todosOsIds } from '../data/banco';
import type { ProgressMap } from '../types/study';
import {
  chillPreferido,
  guardarChill,
  ligarChill,
  pararChill,
} from '../utils/sound';
import {
  diasParado,
  estadoGrupo,
  gruposDoMapa,
  registarHistorico,
  resumoNiveis,
} from '../utils/storage';
import { MasteryIcon } from './MasteryIcon';

interface MapaViewProps {
  progress: ProgressMap;
  isAudioPlaying: boolean;
  onImportProgress: (next: ProgressMap) => void;
  onResetProgress: () => void;
  onNotify: (msg: string, tone?: 'neutral' | 'error') => void;
}

type CardFilter = 'todos' | 'frageis' | 'nunca';

export function MapaView({
  progress,
  isAudioPlaying,
  onImportProgress,
  onResetProgress,
  onNotify,
}: MapaViewProps) {
  const [chillOn, setChillOn] = useState<boolean>(() => chillPreferido());
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const [cardFilter, setCardFilter] = useState<CardFilter>('todos');

  useEffect(() => {
    if (chillOn) {
      ligarChill(isAudioPlaying);
    }
    return () => {
      pararChill(false);
    };
  }, [chillOn, isAudioPlaying]);

  const todos = useMemo(() => todosOsIds(), []);
  const levels = useMemo(() => resumoNiveis(progress, todos), [progress, todos]);
  const hist = useMemo(() => registarHistorico(progress), [progress]);

  const mechStats = useMemo(() => {
    const byMech: Record<number, string[]> = {};
    MECANISMOS.forEach((m) => {
      byMech[m.n] = [];
    });
    todos.forEach((id) => {
      byMech[mecanismoDe(id)].push(id);
    });
    return MECANISMOS.map((m) => ({
      ...m,
      stats: estadoGrupo(progress, byMech[m.n]),
    }));
  }, [progress, todos]);

  const groupsWithStats = useMemo(() => {
    return gruposDoMapa().map((g) => {
      const ids = g.itens.map((i) => i.id);
      return {
        ...g,
        ids,
        estado: estadoGrupo(progress, ids),
        resumo: resumoNiveis(progress, ids),
      };
    });
  }, [progress]);

  const rankedGroups = useMemo(() => {
    return groupsWithStats.slice().sort((a, b) => {
      const ma = a.estado.jogados ? a.estado.media : 9;
      const mb = b.estado.jogados ? b.estado.media : 9;
      if (ma !== mb) return ma - mb;
      const ta = a.estado.taxa === null ? 2 : a.estado.taxa;
      const tb = b.estado.taxa === null ? 2 : b.estado.taxa;
      return ta - tb;
    });
  }, [groupsWithStats]);

  const toggleChill = () => {
    const next = !chillOn;
    setChillOn(next);
    guardarChill(next);
    if (next) ligarChill(isAudioPlaying);
    else pararChill(true);
  };

  const handleCopyJson = async () => {
    const json = JSON.stringify(progress, null, 1);
    setShowExport(true);
    setShowImport(false);
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(json);
        onNotify(`Save copiado (${Object.keys(progress).length} cartões com registo).`, 'neutral');
      }
    } catch {
      onNotify('JSON aberto abaixo para copiar manualmente.', 'neutral');
    }
  };

  const handleRestoreJson = () => {
    try {
      const trimmed = importText.trim();
      if (!trimmed) {
        onNotify('Cole o texto JSON primeiro.', 'error');
        return;
      }
      const parsed = JSON.parse(trimmed);
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Formato inválido');
      }
      onImportProgress(parsed as ProgressMap);
      setShowImport(false);
      setImportText('');
      onNotify('Progresso restaurado com sucesso!', 'neutral');
    } catch {
      onNotify('JSON inválido ou corrompido.', 'error');
    }
  };

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div className="space-y-6">
      {/* Header + Ambient Chill Switch */}
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#e6dcc9]">
            O meu mapa
          </h1>
          <p className="text-xs sm:text-sm text-[#a89c86]">
            A maestria sobe com dois acertos seguidos e desce um grau com um erro.
          </p>
        </div>

        <button
          type="button"
          onClick={toggleChill}
          className={`min-h-[40px] px-3 py-1.5 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            chillOn
              ? 'bg-[#1a160d] border-[#c9a227]/60 text-[#f2d480]'
              : 'bg-[#14120f] border-[#2b2721] text-[#a89c86]'
          }`}
        >
          <Music size={14} aria-hidden="true" />
          <span>{chillOn ? 'Ambiente: ligado' : 'Ambiente: desligado'}</span>
        </button>
      </div>

      {/* Mastery Level Counters */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#14120f] border border-[#2b2721] space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {(
            [
              [3, 'Assinatura', levels.nv[3]],
              [2, 'Hábito', levels.nv[2]],
              [1, 'Praticado', levels.nv[1]],
              [0, 'Hesitante', levels.nv[0]],
              [-1, 'Nunca jogado', levels.nunca],
            ] as [0 | 1 | 2 | 3 | -1, string, number][]
          ).map(([lvl, label, count]) => (
            <div
              key={label}
              className="p-3 rounded-xl bg-[#110f0c] border border-[#2b2721] flex flex-col items-center text-center gap-1"
            >
              <MasteryIcon level={lvl} size={16} />
              <span className="font-[family-name:var(--font-mono)] text-xl font-semibold text-[#e6dcc9] tabular-nums">
                {count}
              </span>
              <span className="text-[11px] text-[#a89c86]">{label}</span>
            </div>
          ))}
        </div>

        {/* Save Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={handleCopyJson}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#1c1915] border border-[#3a332a] hover:border-[#c9a227] text-xs font-medium text-[#e6dcc9] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Copy size={14} aria-hidden="true" />
            Copiar save (JSON)
          </button>

          <button
            type="button"
            onClick={() => {
              setShowImport((s) => !s);
              setShowExport(false);
            }}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-[#1c1915] border border-[#3a332a] hover:border-[#c9a227] text-xs font-medium text-[#e6dcc9] inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Upload size={14} aria-hidden="true" />
            Importar save (JSON)
          </button>

          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-transparent border border-[#2b2721] hover:border-[#a9413a] text-xs font-medium text-[#a89c86] hover:text-[#e0a89f] inline-flex items-center gap-1.5 ml-auto cursor-pointer"
          >
            <Trash2 size={14} aria-hidden="true" />
            Apagar
          </button>
        </div>

        {showExport && (
          <div className="space-y-2 pt-1">
            <textarea
              readOnly
              value={JSON.stringify(progress, null, 1)}
              className="w-full h-32 p-3 rounded-xl bg-[#0c0b09] border border-[#2b2721] font-[family-name:var(--font-mono)] text-xs text-[#a89c86] resize-y"
            />
            <button
              type="button"
              onClick={() => setShowExport(false)}
              className="text-xs text-[#a89c86] hover:text-[#e6dcc9] cursor-pointer"
            >
              Fechar JSON
            </button>
          </div>
        )}

        {showImport && (
          <div className="p-3.5 rounded-xl bg-[#0c0b09] border border-[#2b2721] space-y-2.5">
            <p className="text-xs text-[#a89c86]">
              Cole aqui o conteúdo do teu save em JSON para restaurar o progresso:
            </p>
            <textarea
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"par:danca:...": { "v": 2, "a": 3, "e": 0 }}'
              className="w-full h-24 p-2.5 rounded-lg bg-[#14120f] border border-[#3a332a] font-[family-name:var(--font-mono)] text-xs text-[#e6dcc9] resize-y"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImport(false)}
                className="min-h-[38px] px-3 rounded-lg text-xs text-[#a89c86] hover:text-[#e6dcc9] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleRestoreJson}
                className="min-h-[38px] px-3.5 rounded-lg bg-[#c9a227] text-[#0e0d0b] text-xs font-semibold cursor-pointer"
              >
                Restaurar progresso
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Seven Mechanisms */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#14120f] border border-[#2b2721] space-y-3">
        <div className="space-y-0.5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#e6dcc9]">
            Os sete mecanismos
          </h2>
          <p className="text-xs text-[#a89c86]">
            A matéria diz o que estudaste; o mecanismo diz como erras.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {mechStats.map((m) => {
            const pct = m.stats.taxa !== null ? Math.round(m.stats.taxa * 100) : null;
            const isWeak = m.stats.taxa !== null && m.stats.taxa < 0.7;
            const isStrong = m.stats.taxa !== null && m.stats.taxa > 0.88;
            return (
              <div
                key={m.n}
                className={`p-3 rounded-xl border space-y-1 ${
                  isWeak
                    ? 'bg-[#1a1110] border-[#5c2e29]'
                    : isStrong
                      ? 'bg-[#12150e] border-[#46542e]'
                      : 'bg-[#110f0c] border-[#2b2721]'
                }`}
              >
                <div className="text-xs text-[#e6dcc9] font-medium leading-snug">
                  {m.n}. {m.nome}
                </div>
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={`font-[family-name:var(--font-mono)] text-xl font-semibold tabular-nums ${
                      isWeak
                        ? 'text-[#e0a89f]'
                        : isStrong
                          ? 'text-[#a8c07e]'
                          : 'text-[#e6dcc9]'
                    }`}
                  >
                    {pct !== null ? `${pct}%` : '—'}
                  </span>
                  <span className="text-[11px] text-[#a89c86]">
                    {isWeak ? 'Frágil' : isStrong ? 'Firme' : m.stats.taxa !== null ? 'Em curso' : 'Sem dados'}
                  </span>
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[11px] text-[#a89c86] tabular-nums">
                  {m.stats.a}✓ {m.stats.e}✗ · {m.stats.jogados}/{m.stats.total}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Daily Evolution Chart */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#14120f] border border-[#2b2721] space-y-3">
        <div className="space-y-0.5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#e6dcc9]">
            A tua evolução
          </h2>
          {hist.length < 2 ? (
            <p className="text-xs text-[#a89c86]">
              O histórico começa hoje. A partir de amanhã, cada dia acrescenta uma barra a esta
              linha.
            </p>
          ) : (
            (() => {
              const ini = hist[0];
              const fim = hist[hist.length - 1];
              const tIni = ini.a + ini.e ? Math.round((100 * ini.a) / (ini.a + ini.e)) : 0;
              const tFim = fim.a + fim.e ? Math.round((100 * fim.a) / (fim.a + fim.e)) : 0;
              const delta = tFim - tIni;
              return (
                <p className="text-xs text-[#a89c86] tabular-nums">
                  De {ini.d} ({tIni}%) a {fim.d} ({tFim}%) · {delta >= 0 ? '+' : ''}
                  {delta} pts · média {fim.v.toFixed(2)}/3
                </p>
              );
            })()
          )}
        </div>

        {hist.length >= 2 && (
          <div className="flex items-end gap-1.5 h-24 pt-2">
            {hist.slice(-14).map((s, i, arr) => {
              const t = s.a + s.e ? (100 * s.a) / (s.a + s.e) : 0;
              const isToday = i === arr.length - 1;
              return (
                <div
                  key={s.d}
                  title={`${s.d} · ${Math.round(t)}% · ${s.jog}/${s.total} cartões`}
                  className="flex-1 h-full flex flex-col justify-end items-center gap-1"
                >
                  <div
                    className={`w-full rounded-t transition-all ${
                      isToday ? 'bg-[#c9a227]' : 'bg-[#3a332a]'
                    }`}
                    style={{ height: `${Math.max(6, Math.min(100, t))}%` }}
                  />
                  <span className="font-[family-name:var(--font-mono)] text-[9px] text-[#a89c86] tabular-nums">
                    {s.d.slice(5)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Group Ranking Table */}
      <section className="p-4 sm:p-5 rounded-2xl bg-[#14120f] border border-[#2b2721] space-y-3 overflow-x-auto">
        <div className="space-y-0.5">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#e6dcc9]">
            O ranking
          </h2>
          <p className="text-xs text-[#a89c86]">
            Do mais frágil ao mais firme pela maestria média dos cartões jogados.
          </p>
        </div>

        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-[#2b2721] text-[11px] uppercase tracking-wider text-[#a89c86]">
              <th className="py-2 pr-2 font-medium">#</th>
              <th className="py-2 pr-3 font-medium">Grupo</th>
              <th className="py-2 pr-3 font-medium">Acerto</th>
              <th className="py-2 pr-3 font-medium hidden sm:table-cell">Certo / Errado</th>
              <th className="py-2 font-medium text-right">Maestria</th>
            </tr>
          </thead>
          <tbody>
            {rankedGroups.map((g, i) => {
              const lvl = Math.min(3, Math.floor(g.estado.media)) as 0 | 1 | 2 | 3;
              return (
                <tr key={g.nome} className="border-b border-[#1d1a16] last:border-none">
                  <td className="py-2.5 pr-2 font-[family-name:var(--font-mono)] text-[#a89c86] tabular-nums">
                    {i + 1}
                  </td>
                  <td className="py-2.5 pr-3 text-[#e6dcc9] font-medium">{g.nome}</td>
                  <td className="py-2.5 pr-3 font-[family-name:var(--font-mono)] text-[#f2d480] tabular-nums">
                    {g.estado.taxa === null ? '—' : `${Math.round(g.estado.taxa * 100)}%`}
                  </td>
                  <td className="py-2.5 pr-3 font-[family-name:var(--font-mono)] text-[#a89c86] tabular-nums hidden sm:table-cell">
                    {g.estado.a}✓ / {g.estado.e}✗
                  </td>
                  <td className="py-2.5 text-right font-[family-name:var(--font-mono)] tabular-nums whitespace-nowrap">
                    {g.estado.jogados ? (
                      <span className="inline-flex items-center gap-1 text-[#e6dcc9]">
                        <MasteryIcon level={lvl} size={13} />
                        {g.estado.media.toFixed(1)}
                        <span className="text-[#a89c86] text-xs">
                          ({g.estado.jogados}/{g.estado.total})
                        </span>
                      </span>
                    ) : (
                      <span className="text-[#7d7466]">
                        — ({g.estado.jogados}/{g.estado.total})
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Card Inventory by Group (Expandable for mobile comfort) */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#e6dcc9]">
            Cartões por grupo
          </h2>
          <div className="inline-flex p-1 rounded-xl bg-[#14120f] border border-[#2b2721] self-start">
            {(
              [
                ['todos', 'Todos'],
                ['frageis', 'Frágeis'],
                ['nunca', 'Nunca jogados'],
              ] as [CardFilter, string][]
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setCardFilter(id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg cursor-pointer transition-colors ${
                  cardFilter === id
                    ? 'bg-[#241d0e] text-[#f2d480]'
                    : 'text-[#a89c86] hover:text-[#e6dcc9]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          {groupsWithStats.map((g) => {
            const filteredItems = g.itens.filter((it) => {
              const rec = progress[it.id];
              if (cardFilter === 'frageis') return !!rec && (rec.e > rec.a || rec.a === 0);
              if (cardFilter === 'nunca') return !rec;
              return true;
            });
            if (cardFilter !== 'todos' && filteredItems.length === 0) return null;

            const isOpen = !!expandedGroups[g.nome] || cardFilter !== 'todos';

            return (
              <div
                key={g.nome}
                className="rounded-xl bg-[#14120f] border border-[#2b2721] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleGroup(g.nome)}
                  className="w-full min-h-[56px] p-4 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-[#1a1712] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[#e6dcc9] truncate">
                      {g.nome}
                    </div>
                    <div className="text-xs text-[#a89c86] font-[family-name:var(--font-mono)] tabular-nums">
                      {g.fonte} ·{' '}
                      {g.estado.taxa === null
                        ? 'sem dados'
                        : `${Math.round(g.estado.taxa * 100)}% (${g.estado.jogados}/${g.estado.total})`}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={18} className="text-[#a89c86] shrink-0" aria-hidden="true" />
                  ) : (
                    <ChevronDown size={18} className="text-[#a89c86] shrink-0" aria-hidden="true" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-[#2b2721] divide-y divide-[#1d1a16]">
                    {filteredItems.map((it) => {
                      const rec = progress[it.id];
                      const lvl = rec ? rec.v : -1;
                      const parado = rec ? diasParado(rec.ultimo) : null;
                      return (
                        <div
                          key={it.id}
                          className="px-4 py-2.5 flex items-start justify-between gap-3 text-xs sm:text-sm"
                        >
                          <div className="flex items-start gap-2.5 min-w-0">
                            <span className="mt-1 shrink-0">
                              <MasteryIcon level={lvl} size={14} />
                            </span>
                            <div className="min-w-0">
                              <div className="text-[#e6dcc9] leading-snug">{it.texto}</div>
                              <div className="text-xs text-[#a89c86]">{it.nota}</div>
                            </div>
                          </div>

                          <div className="font-[family-name:var(--font-mono)] text-xs text-[#a89c86] tabular-nums shrink-0 text-right">
                            {rec ? (
                              <>
                                <span>
                                  {rec.a}✓{rec.e ? ` / ${rec.e}✗` : ''}
                                </span>
                                {parado !== null && parado >= 3 && (
                                  <span className="block text-[10px] text-[#7d7466]">
                                    {parado}d parado
                                  </span>
                                )}
                              </>
                            ) : (
                              <span className="text-[#7d7466]">novo</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* In-App Reset Confirmation Modal (avoids window.confirm) */}
      {confirmReset && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[#14120f] border border-[#3a332a] space-y-4">
            <h2
              id="reset-dialog-title"
              className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#e6dcc9]"
            >
              Apagar todo o progresso?
            </h2>
            <p className="text-sm text-[#a89c86]">
              Toda a maestria e histórico guardados neste navegador serão apagados. Faça uma
              cópia JSON antes se quiser guardar o progresso atual.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[44px] px-4 rounded-xl bg-[#1c1915] border border-[#3a332a] text-sm font-medium text-[#e6dcc9] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onResetProgress();
                  setConfirmReset(false);
                  onNotify('Progresso apagado.', 'neutral');
                }}
                className="min-h-[44px] px-4 rounded-xl bg-[#a9413a] text-white text-sm font-semibold cursor-pointer"
              >
                Apagar tudo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
