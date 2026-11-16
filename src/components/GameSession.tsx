import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { INDICE, chipId } from '../data/banco';
import type {
  ClassificarFicha,
  ClassificarSet,
  LiteralQuestion,
  ParearGroup,
  ProgressMap,
  SessionConfig,
} from '../types/study';
import { haptic, somAcerto, somDoFim, somErro } from '../utils/sound';
import { baralhar, estaDevido, isFragil } from '../utils/storage';

interface GameSessionProps {
  config: SessionConfig;
  progress: ProgressMap;
  onRecord: (id: string, acertou: boolean) => void;
  onExit: () => void;
  onNotify: (msg: string, tone?: 'neutral' | 'error') => void;
}

interface ParearChip {
  id: string;
  txt: string;
  rot: string;
  aval: boolean;
}

function RoundParear({
  grupo,
  filterMode,
  initialProgress,
  onRecord,
  onDone,
  onNotify,
}: {
  grupo: ParearGroup;
  filterMode?: 'due' | 'fragile';
  initialProgress: ProgressMap;
  onRecord: (id: string, acertou: boolean) => void;
  onDone: () => void;
  onNotify: (msg: string, tone?: 'neutral' | 'error') => void;
}) {
  const { chosenFields, initialChips } = useMemo(() => {
    const allFields = Object.keys(grupo.rotulos);
    const filtro =
      filterMode === 'due'
        ? (id: string) => estaDevido(initialProgress, id)
        : filterMode === 'fragile'
          ? (id: string) => isFragil(initialProgress, id)
          : null;

    let selected: string[];
    if (filtro) {
      const countTarget = (rot: string) =>
        grupo.rotulos[rot].filter((t) => filtro(chipId(grupo.id, rot, t))).length;
      selected = allFields
        .filter((rot) => countTarget(rot) > 0)
        .sort((a, b) => countTarget(b) - countTarget(a))
        .slice(0, grupo.tamanho || 3);
      allFields.forEach((rot) => {
        if (selected.length < 2 && !selected.includes(rot)) selected.push(rot);
      });
    } else {
      selected = baralhar(allFields).slice(0, grupo.tamanho || 3);
    }

    const chips: ParearChip[] = [];
    selected.forEach((rot) => {
      grupo.rotulos[rot].forEach((txt) => {
        const id = chipId(grupo.id, rot, txt);
        chips.push({ id, txt, rot, aval: !filtro || filtro(id) });
      });
    });

    return { chosenFields: selected, initialChips: baralhar(chips) };
  }, [grupo, filterMode, initialProgress]);

  const [pool, setPool] = useState<ParearChip[]>(initialChips);
  const [placed, setPlaced] = useState<Record<string, ParearChip[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(initialChips[0]?.id ?? null);
  const [errorsByChip, setErrorsByChip] = useState<Record<string, number>>({});
  const [shakingBucket, setShakingBucket] = useState<string | null>(null);

  const avalCount = useMemo(
    () => initialChips.filter((c) => c.aval).length,
    [initialChips]
  );

  const selectedChip = pool.find((c) => c.id === selectedId) ?? null;

  const placeChip = (chip: ParearChip, targetRot: string, acertou: boolean) => {
    const nextPool = pool.filter((c) => c.id !== chip.id);
    setPool(nextPool);
    setPlaced((prev) => ({
      ...prev,
      [targetRot]: [...(prev[targetRot] || []), chip],
    }));
    // Auto-select next chip on mobile to reduce taps by 50%!
    setSelectedId(nextPool[0]?.id ?? null);

    if (acertou && chip.aval) {
      onRecord(chip.id, true);
    }
    if (nextPool.length === 0) {
      setTimeout(onDone, 420);
    }
  };

  const handleBucketTap = (rot: string) => {
    if (!selectedChip) {
      onNotify('Toque primeiro num elemento acima.', 'neutral');
      return;
    }

    if (selectedChip.rot === rot) {
      haptic(10);
      somAcerto();
      placeChip(selectedChip, rot, true);
      return;
    }

    haptic(25);
    somErro();
    setShakingBucket(rot);
    setTimeout(() => setShakingBucket(null), 320);

    const errCount = (errorsByChip[selectedChip.id] || 0) + 1;
    setErrorsByChip((prev) => ({ ...prev, [selectedChip.id]: errCount }));
    if (selectedChip.aval) {
      onRecord(selectedChip.id, false);
    }

    if (errCount >= 2) {
      onNotify(`«${selectedChip.txt}» pertence a «${selectedChip.rot}».`, 'error');
      placeChip(selectedChip, selectedChip.rot, false);
    } else {
      onNotify('Não é aqui. Pensa no conceito do campo.', 'error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#e6dcc9]">
          {grupo.grupo}
        </h2>
        <p className="text-xs text-[#a89c86]">
          {grupo.fonte}
          {' · '}
          {filterMode
            ? `só ${avalCount} ficha(s) contam para a maestria`
            : 'toque no elemento e depois no campo certo'}
        </p>
      </div>

      {/* Pool of Remaining Elements */}
      <div className="p-3.5 rounded-xl bg-[#100e0c] border border-dashed border-[#302a22] min-h-[76px]">
        {pool.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {pool.map((chip) => {
              const active = chip.id === selectedId;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    haptic(6);
                    setSelectedId(active ? null : chip.id);
                  }}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer ${
                    active
                      ? 'bg-[#2a2418] border-[#c9a227] text-[#ffeec2] ring-2 ring-[#c9a227]/25 -translate-y-0.5'
                      : 'bg-[#201c17] border-[#3a332a] text-[#e6dcc9] hover:border-[#c9a227]/70'
                  }`}
                >
                  {chip.txt}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="h-11 flex items-center justify-center text-xs text-[#a8c07e] gap-1.5">
            <Check size={15} aria-hidden="true" />
            Todos os elementos encaixados
          </div>
        )}
      </div>

      {/* Selected Callout Hint for Thumb Clarity */}
      {selectedChip && (
        <p className="text-xs text-[#f2d480] px-1">
          Selecionado: <strong className="font-semibold">«{selectedChip.txt}»</strong> — toque
          num campo abaixo
        </p>
      )}

      {/* Target Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {chosenFields.map((rot) => {
          const items = placed[rot] || [];
          const isShaking = shakingBucket === rot;
          const allDone = pool.length === 0;
          return (
            <button
              key={rot}
              type="button"
              onClick={() => handleBucketTap(rot)}
              className={`min-h-[104px] p-3.5 rounded-xl border text-left flex flex-col justify-start gap-2.5 transition-colors cursor-pointer ${
                isShaking ? 'animate-shake border-[#a9413a] bg-[#1a1210]' : ''
              } ${
                allDone
                  ? 'border-[#3d4f2e] bg-[#121710]'
                  : selectedChip
                    ? 'border-[#3a332a] bg-[#14120f] hover:border-[#c9a227] active:bg-[#1c1914]'
                    : 'border-[#2b2721] bg-[#110f0c]'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a227]">
                {rot}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item.id}
                    className="animate-settle px-2.5 py-1 rounded-lg text-xs bg-[#1a2416] border border-[#3d4f2e] text-[#c6d3b4]"
                  >
                    {item.txt}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface ClassificarItem {
  id: string;
  texto: string;
  col: string;
  aval: boolean;
}

function RoundClassificar({
  set,
  filterMode,
  initialProgress,
  onRecord,
  onDone,
  onNotify,
}: {
  set: ClassificarSet;
  filterMode?: 'due' | 'fragile';
  initialProgress: ProgressMap;
  onRecord: (id: string, acertou: boolean) => void;
  onDone: () => void;
  onNotify: (msg: string, tone?: 'neutral' | 'error') => void;
}) {
  const { initialChips, colNameById } = useMemo(() => {
    const names: Record<string, string> = {};
    set.colunas.forEach((c) => {
      names[c.id] = c.nome;
    });

    const quantos = set.quantos || 10;
    const filtro =
      filterMode === 'due'
        ? (id: string) => estaDevido(initialProgress, id)
        : filterMode === 'fragile'
          ? (id: string) => isFragil(initialProgress, id)
          : null;

    let chosen: ClassificarFicha[];
    if (filtro) {
      chosen = set.fichas.filter((f) => filtro(f.id));
      const emptyCols = set.colunas.filter((c) => !chosen.some((f) => f.col === c.id));
      chosen = chosen.slice(0, Math.max(1, quantos - emptyCols.length));
      emptyCols.forEach((c) => {
        const anchor = set.fichas.find((f) => f.col === c.id);
        if (anchor) chosen = chosen.concat([anchor]);
      });
    } else {
      const shuffled = baralhar(set.fichas);
      const byCol: Record<string, typeof set.fichas> = {};
      set.colunas.forEach((c) => {
        byCol[c.id] = [];
      });
      shuffled.forEach((f) => {
        if (byCol[f.col]) byCol[f.col].push(f);
      });
      chosen = [];
      set.colunas.forEach((c) => {
        chosen.push(...byCol[c.id].slice(0, 2));
      });
      const rest = shuffled.filter((f) => !chosen.includes(f));
      chosen.push(...rest.slice(0, Math.max(0, quantos - chosen.length)));
    }

    const chips: ClassificarItem[] = baralhar(chosen).map((f) => ({
      id: f.id,
      texto: f.texto,
      col: f.col,
      aval: !filtro || filtro(f.id),
    }));

    return { initialChips: chips, colNameById: names };
  }, [set, filterMode, initialProgress]);

  const [pool, setPool] = useState<ClassificarItem[]>(initialChips);
  const [placed, setPlaced] = useState<Record<string, ClassificarItem[]>>({});
  const [selectedId, setSelectedId] = useState<string | null>(initialChips[0]?.id ?? null);
  const [errorsByChip, setErrorsByChip] = useState<Record<string, number>>({});
  const [shakingCol, setShakingCol] = useState<string | null>(null);

  const avalCount = useMemo(
    () => initialChips.filter((c) => c.aval).length,
    [initialChips]
  );
  const selectedChip = pool.find((c) => c.id === selectedId) ?? null;

  const placeChip = (chip: ClassificarItem, targetCol: string, acertou: boolean) => {
    const nextPool = pool.filter((c) => c.id !== chip.id);
    setPool(nextPool);
    setPlaced((prev) => ({
      ...prev,
      [targetCol]: [...(prev[targetCol] || []), chip],
    }));
    setSelectedId(nextPool[0]?.id ?? null);
    if (acertou && chip.aval) {
      onRecord(chip.id, true);
    }
    if (nextPool.length === 0) {
      setTimeout(onDone, 420);
    }
  };

  const handleColTap = (colId: string) => {
    if (!selectedChip) {
      onNotify('Toque primeiro numa ficha.', 'neutral');
      return;
    }

    if (selectedChip.col === colId) {
      haptic(10);
      somAcerto();
      placeChip(selectedChip, colId, true);
      return;
    }

    haptic(25);
    somErro();
    setShakingCol(colId);
    setTimeout(() => setShakingCol(null), 320);

    const errCount = (errorsByChip[selectedChip.id] || 0) + 1;
    setErrorsByChip((prev) => ({ ...prev, [selectedChip.id]: errCount }));
    if (selectedChip.aval) {
      onRecord(selectedChip.id, false);
    }

    if (errCount >= 2) {
      onNotify(`«${selectedChip.texto}» vai para «${colNameById[selectedChip.col]}».`, 'error');
      placeChip(selectedChip, selectedChip.col, false);
    } else {
      onNotify('Não é essa coluna.', 'error');
    }
  };

  const gridColsClass =
    set.colunas.length >= 4
      ? 'grid-cols-2 sm:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className="space-y-4">
      <div className="space-y-0.5">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold text-[#e6dcc9]">
          {set.grupo}
        </h2>
        <p className="text-xs text-[#a89c86]">
          {set.fonte}
          {' · '}
          {filterMode
            ? `só ${avalCount} ficha(s) contam para a maestria`
            : 'toque na ficha e depois na coluna'}
        </p>
      </div>

      {/* Pool */}
      <div className="p-3.5 rounded-xl bg-[#100e0c] border border-dashed border-[#302a22] min-h-[76px]">
        {pool.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {pool.map((chip) => {
              const active = chip.id === selectedId;
              return (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => {
                    haptic(6);
                    setSelectedId(active ? null : chip.id);
                  }}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-sm font-medium border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-[#2a2418] border-[#c9a227] text-[#ffeec2] ring-2 ring-[#c9a227]/25 -translate-y-0.5'
                      : 'bg-[#201c17] border-[#3a332a] text-[#e6dcc9] hover:border-[#c9a227]/70'
                  }`}
                >
                  {chip.texto}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="h-11 flex items-center justify-center text-xs text-[#a8c07e] gap-1.5">
            <Check size={15} aria-hidden="true" />
            Todas as fichas classificadas
          </div>
        )}
      </div>

      {selectedChip && (
        <p className="text-xs text-[#f2d480] px-1">
          Ficha ativa: <strong className="font-semibold">«{selectedChip.texto}»</strong>
        </p>
      )}

      {/* Columns */}
      <div className={`grid ${gridColsClass} gap-2.5`}>
        {set.colunas.map((c) => {
          const items = placed[c.id] || [];
          const isShaking = shakingCol === c.id;
          const allDone = pool.length === 0;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => handleColTap(c.id)}
              className={`min-h-[112px] p-3.5 rounded-xl border text-left flex flex-col justify-start gap-2.5 transition-colors cursor-pointer ${
                isShaking ? 'animate-shake border-[#a9413a] bg-[#1a1210]' : ''
              } ${
                allDone
                  ? 'border-[#3d4f2e] bg-[#121710]'
                  : selectedChip
                    ? 'border-[#3a332a] bg-[#14120f] hover:border-[#c9a227] active:bg-[#1c1914]'
                    : 'border-[#2b2721] bg-[#110f0c]'
              }`}
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-[#c9a227] leading-snug">
                {c.nome}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item.id}
                    className="animate-settle px-2.5 py-1 rounded-lg text-xs bg-[#1a2416] border border-[#3d4f2e] text-[#c6d3b4]"
                  >
                    {item.texto}
                  </span>
                ))}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RoundLiteral({
  perguntas,
  onRecord,
  onDone,
}: {
  perguntas: LiteralQuestion[];
  onRecord: (id: string, acertou: boolean) => void;
  onDone: () => void;
}) {
  const [idx, setIdx] = useState(0);
  const [chosenOptIdx, setChosenOptIdx] = useState<number | null>(null);

  const q = perguntas[idx];
  const shuffledIndices = useMemo(() => {
    if (!q) return [];
    return baralhar(q.opcoes.map((_, k) => k));
  }, [q]);

  const handleChoose = (optIdx: number) => {
    if (chosenOptIdx !== null || !q) return;
    setChosenOptIdx(optIdx);
    const acertou = optIdx === q.certa;
    onRecord(q.id, acertou);
    if (acertou) {
      haptic(12);
      somAcerto();
    } else {
      haptic(30);
      somErro();
    }
  };

  const handleNext = () => {
    if (idx + 1 >= perguntas.length) {
      onDone();
    } else {
      setChosenOptIdx(null);
      setIdx((i) => i + 1);
    }
  };

  // Keyboard shortcuts 1-4 and Enter
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!q) return;
      if (chosenOptIdx === null) {
        const num = parseInt(e.key, 10);
        if (num >= 1 && num <= shuffledIndices.length) {
          e.preventDefault();
          handleChoose(shuffledIndices[num - 1]);
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!q) return null;

  const answered = chosenOptIdx !== null;
  const isCorrect = answered && chosenOptIdx === q.certa;

  return (
    <div className="space-y-4 pb-20 sm:pb-4">
      <div className="flex items-center justify-between gap-2 text-xs text-[#a89c86]">
        <span className="font-medium text-[#c9a227]">{q.grupo}</span>
        <span className="font-[family-name:var(--font-mono)] tabular-nums">
          {idx + 1} / {perguntas.length}
        </span>
      </div>

      <div className="space-y-1.5">
        <h2 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-semibold text-[#e6dcc9] leading-snug text-balance">
          {q.enunciado}
        </h2>
        <p className="text-xs text-[#a89c86]">{q.fonte}</p>
      </div>

      <div className="space-y-2.5">
        {shuffledIndices.map((optIdx, pos) => {
          const isThisCorrect = optIdx === q.certa;
          const isThisChosen = optIdx === chosenOptIdx;

          let cardClass =
            'bg-[#1a1712] border-[#3a332a] text-[#e6dcc9] hover:border-[#c9a227] active:bg-[#221e17]';
          if (answered) {
            if (isThisCorrect) {
              cardClass = 'bg-[#16200f] border-[#7a9459] text-[#d3e2c0]';
            } else if (isThisChosen) {
              cardClass = 'bg-[#200f0e] border-[#a9413a] text-[#e8c4c0]';
            } else {
              cardClass = 'bg-[#14120f] border-[#241f19] text-[#7d7466] opacity-75';
            }
          }

          return (
            <button
              key={optIdx}
              type="button"
              disabled={answered}
              onClick={() => handleChoose(optIdx)}
              className={`w-full min-h-[54px] px-4 py-3 rounded-xl border text-left text-sm sm:text-base flex items-start gap-3 transition-colors cursor-pointer disabled:cursor-default ${cardClass}`}
            >
              <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-md border border-[#4a3c12] font-[family-name:var(--font-mono)] text-xs text-[#c9a227] shrink-0">
                {pos + 1}
              </span>
              <span className="leading-snug flex-1">{q.opcoes[optIdx]}</span>
              {answered && isThisCorrect && (
                <CheckCircle2 size={18} className="text-[#7a9459] shrink-0 mt-0.5" aria-hidden="true" />
              )}
              {answered && isThisChosen && !isThisCorrect && (
                <XCircle size={18} className="text-[#a9413a] shrink-0 mt-0.5" aria-hidden="true" />
              )}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`p-4 rounded-xl border text-sm leading-relaxed animate-settle ${
            isCorrect
              ? 'bg-[#121710] border-[#3d4f2e] text-[#d3e2c0]'
              : 'bg-[#1a1110] border-[#5c2e29] text-[#e8c4c0]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-semibold mb-1">
            {isCorrect ? (
              <>
                <CheckCircle2 size={16} className="text-[#7a9459]" aria-hidden="true" />
                <span>Certo.</span>
              </>
            ) : (
              <>
                <XCircle size={16} className="text-[#a9413a]" aria-hidden="true" />
                <span>Caiu na armadilha.</span>
              </>
            )}
          </div>
          <p className="text-[#e6dcc9]/90">{q.nota}</p>
        </div>
      )}

      {answered && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0e0d0b] via-[#0e0d0b] to-transparent sm:static sm:p-0 sm:bg-none pb-safe z-30">
          <button
            type="button"
            onClick={handleNext}
            className="w-full h-12 rounded-xl bg-[#c9a227] hover:bg-[#d6b138] text-[#0e0d0b] font-semibold text-sm flex items-center justify-center transition-transform active:scale-[0.98] cursor-pointer"
          >
            {idx + 1 < perguntas.length ? 'Seguinte' : 'Fechar rodada'}
          </button>
        </div>
      )}
    </div>
  );
}

export function GameSession({
  config,
  progress,
  onRecord,
  onExit,
  onNotify,
}: GameSessionProps) {
  const [roundIdx, setRoundIdx] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [failures, setFailures] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);

  // Capture snapshot of progress at session start so filtered rounds don't shift mid-round
  const initialProgressRef = useRef(progress);
  const playedEndSoundRef = useRef(false);

  const handleRecord = (id: string, acertou: boolean) => {
    onRecord(id, acertou);
    if (acertou) {
      setHits((h) => h + 1);
    } else {
      setMisses((m) => m + 1);
      setFailures((prev) => (prev.includes(id) ? prev : [...prev, id]));
    }
  };

  const handleRoundDone = () => {
    if (roundIdx + 1 >= config.rodadas.length) {
      setFinished(true);
    } else {
      setRoundIdx((r) => r + 1);
    }
  };

  useEffect(() => {
    if (finished && !playedEndSoundRef.current) {
      playedEndSoundRef.current = true;
      somDoFim(misses);
    }
  }, [finished, misses]);

  if (finished) {
    const total = hits + misses;
    const pct = total ? Math.round((hits / total) * 100) : 0;

    return (
      <div className="space-y-6">
        <div className="p-5 sm:p-6 rounded-2xl bg-[#14120f] border border-[#2b2721] space-y-4">
          <div className="space-y-1">
            <h1 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-[#e6dcc9]">
              {hits > misses ? 'A mão já sabe' : 'Ainda tropeça — e é assim que se aprende'}
            </h1>
            <p className="font-[family-name:var(--font-mono)] text-lg text-[#f2d480] tabular-nums">
              {hits} acertos · {misses} erros · {pct}%
            </p>
          </div>

          {failures.length > 0 ? (
            <div className="pt-4 border-t border-[#2b2721] space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-[#a89c86]">
                O que fica para rever ({failures.length})
              </h2>
              <ul className="space-y-2.5">
                {failures.map((id) => {
                  const it = INDICE[id];
                  if (!it) return null;
                  return (
                    <li
                      key={id}
                      className="p-3.5 rounded-xl bg-[#100e0c] border border-[#5c2e29]/60 space-y-1 text-sm"
                    >
                      <div className="font-semibold text-[#e6dcc9]">{it.texto}</div>
                      <div className="text-xs text-[#a89c86]">
                        {it.fonte}
                        {it.extra ? ` · ${it.extra}` : ''}
                      </div>
                      {it.nota && (
                        <p className="text-xs text-[#e8c4c0] leading-relaxed pt-1">{it.nota}</p>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : (
            <p className="text-sm text-[#c6d3b4]">
              Nenhum erro nesta sessão. A repetição seguinte é em 48h — a memória cobra juros.
            </p>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={onExit}
              className="flex-1 h-12 rounded-xl bg-[#c9a227] hover:bg-[#d6b138] text-[#0e0d0b] font-semibold text-sm flex items-center justify-center transition-colors cursor-pointer"
            >
              Voltar ao início
            </button>
            <button
              type="button"
              onClick={() => {
                playedEndSoundRef.current = false;
                setRoundIdx(0);
                setHits(0);
                setMisses(0);
                setFailures([]);
                setFinished(false);
              }}
              className="h-12 px-5 rounded-xl bg-[#1c1915] border border-[#3a332a] hover:border-[#c9a227] text-sm font-medium text-[#e6dcc9] inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw size={15} aria-hidden="true" />
              Repetir sessão
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentRound = config.rodadas[roundIdx];

  return (
    <div className="space-y-5">
      {/* Session Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#2b2721]">
        <button
          type="button"
          onClick={onExit}
          className="min-h-[44px] px-2 -ml-2 inline-flex items-center gap-1.5 text-sm text-[#a89c86] hover:text-[#e6dcc9] cursor-pointer"
        >
          <ArrowLeft size={17} aria-hidden="true" />
          <span>Sair</span>
        </button>

        <span className="text-xs font-medium uppercase tracking-wider text-[#a89c86] truncate">
          {config.titulo}
        </span>

        <span className="font-[family-name:var(--font-mono)] text-xs tabular-nums shrink-0">
          <span className="text-[#7a9459]">{hits}✓</span>
          <span className="mx-1 text-[#5a5145]">·</span>
          <span className="text-[#e0a89f]">{misses}✗</span>
        </span>
      </div>

      {/* Round Progress Segments */}
      {config.rodadas.length > 1 && (
        <div className="flex gap-1.5" aria-label={`Etapa ${roundIdx + 1} de ${config.rodadas.length}`}>
          {config.rodadas.map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < roundIdx
                  ? 'bg-[#4d5c34]'
                  : i === roundIdx
                    ? 'bg-[#c9a227]'
                    : 'bg-[#2b2721]'
              }`}
            />
          ))}
        </div>
      )}

      {/* Active Engine */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#14120f] border border-[#2b2721]">
        {currentRound.kind === 'parear' && (
          <RoundParear
            key={`parear-${roundIdx}-${currentRound.grupo.id}`}
            grupo={currentRound.grupo}
            filterMode={currentRound.filterMode}
            initialProgress={initialProgressRef.current}
            onRecord={handleRecord}
            onDone={handleRoundDone}
            onNotify={onNotify}
          />
        )}
        {currentRound.kind === 'classificar' && (
          <RoundClassificar
            key={`classificar-${roundIdx}-${currentRound.set.id}`}
            set={currentRound.set}
            filterMode={currentRound.filterMode}
            initialProgress={initialProgressRef.current}
            onRecord={handleRecord}
            onDone={handleRoundDone}
            onNotify={onNotify}
          />
        )}
        {currentRound.kind === 'literal' && (
          <RoundLiteral
            key={`literal-${roundIdx}`}
            perguntas={currentRound.perguntas}
            onRecord={handleRecord}
            onDone={handleRoundDone}
          />
        )}
      </div>
    </div>
  );
}
