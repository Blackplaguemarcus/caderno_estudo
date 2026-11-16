import {
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  Headphones,
  Layers,
  Play,
  Puzzle,
  ScrollText,
} from 'lucide-react';
import { IDS_CLASSIFICAR, IDS_LITERAL, IDS_PAREAR, todosOsIds } from '../data/banco';
import type { ActiveTab, ProgressMap, SessionConfig } from '../types/study';
import {
  comporSessaoFiltrada,
  diasParaProva,
  estaDevido,
  estadoGrupo,
  isFragil,
  maestriaMedia,
  nivelDe,
} from '../utils/storage';
import { MasteryIcon } from './MasteryIcon';

interface HomeViewProps {
  progress: ProgressMap;
  onStartSession: (config: SessionConfig) => void;
  onNavigate: (tab: ActiveTab) => void;
  onNotify: (msg: string, tone?: 'neutral' | 'error') => void;
}

export function HomeView({
  progress,
  onStartSession,
  onNavigate,
  onNotify,
}: HomeViewProps) {
  const todos = todosOsIds();
  const dueIds = todos.filter((id) => estaDevido(progress, id));
  const fragileIds = todos.filter((id) => isFragil(progress, id));
  const fixedCount = todos.filter((id) => nivelDe(progress, id) >= 2).length;
  const globalStats = estadoGrupo(progress, todos);
  const globalPct = globalStats.taxa !== null ? Math.round(globalStats.taxa * 100) : null;
  const daysLeft = diasParaProva();

  const parearIds = Object.values(IDS_PAREAR).flat();
  const classificarIds = Object.values(IDS_CLASSIFICAR).flat();

  const handleStartDue = () => {
    if (!dueIds.length) {
      onNotify('Nada vencido agora. Escolhe um treino livre ou desafio rápido.', 'neutral');
      return;
    }
    const rodadas = comporSessaoFiltrada(progress, 'due');
    if (!rodadas.length) {
      onNotify('Sem rodadas vencidas disponíveis.', 'neutral');
      return;
    }
    onStartSession({ titulo: 'Fila do dia', rodadas });
  };

  const handleStartFragile = () => {
    if (!fragileIds.length) {
      onNotify('Nenhum cartão frágil no momento. Bom trabalho.', 'neutral');
      return;
    }
    const rodadas = comporSessaoFiltrada(progress, 'fragile');
    if (!rodadas.length) {
      onNotify('Nenhum cartão frágil disponível.', 'neutral');
      return;
    }
    onStartSession({ titulo: 'Os frágeis', rodadas });
  };

  return (
    <div className="space-y-6">
      {/* Hero / Focal Anchor */}
      <section className="space-y-3">
        <div className="space-y-1">
          <p className="text-xs text-[#a89c86] tabular-nums">
            ACT nº 039/2026 · Professor de Arte · Itapoá/SC
            {daysLeft > 0 ? ` · ${daysLeft} dias para a prova` : ''}
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-semibold text-[#e6dcc9] tracking-tight text-balance">
            Treino dos mecanismos de erro
          </h1>
          <p className="text-sm text-[#a89c86] leading-relaxed max-w-2xl">
            Cada cartão carrega a âncora da ficha e a frase literal da prova. O erro volta em
            ciclos de 48h e 7 dias até virar assinatura.
          </p>
        </div>

        {/* Single Dominant CTA */}
        <button
          type="button"
          onClick={handleStartDue}
          className={`w-full min-h-[76px] p-4 sm:p-5 rounded-2xl border text-left flex items-center justify-between gap-4 transition-transform active:scale-[0.99] cursor-pointer ${
            dueIds.length > 0
              ? 'bg-[#1a160d] border-[#c9a227]/60 hover:border-[#c9a227]'
              : 'bg-[#14120f] border-[#2b2721] hover:border-[#3a332a]'
          }`}
        >
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Play
                size={16}
                className={dueIds.length > 0 ? 'text-[#f2d480] fill-[#f2d480]' : 'text-[#a89c86]'}
                aria-hidden="true"
              />
              <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-semibold text-[#f2d480]">
                Fila do dia
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#a89c86]">
              {dueIds.length > 0
                ? `${dueIds.length} cartão(ões) vencido(s) aguardando revisão (48h / 7d)`
                : 'Tudo em dia — toque para ver opções ou escolha um treino livre abaixo'}
            </p>
          </div>
          <ArrowRight size={20} className="text-[#c9a227] shrink-0" aria-hidden="true" />
        </button>
      </section>

      {/* Compact 2-Col Mobile / 4-Col Desktop Status Strip */}
      <section aria-label="Resumo do progresso" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#14120f] border border-[#2b2721] rounded-xl p-3.5">
          <span className="block text-xs text-[#a89c86]">Fixos (Hábito / Assinatura)</span>
          <span className="mt-1 block font-[family-name:var(--font-mono)] text-xl font-semibold text-[#e6dcc9] tabular-nums">
            {fixedCount}
            <span className="text-sm font-normal text-[#a89c86]"> / {todos.length}</span>
          </span>
        </div>

        <div className="bg-[#14120f] border border-[#2b2721] rounded-xl p-3.5">
          <span className="block text-xs text-[#a89c86]">Taxa de acerto</span>
          <span className="mt-1 block font-[family-name:var(--font-mono)] text-xl font-semibold text-[#f2d480] tabular-nums">
            {globalPct !== null ? `${globalPct}%` : '—'}
          </span>
        </div>

        <div className="bg-[#14120f] border border-[#2b2721] rounded-xl p-3.5">
          <span className="block text-xs text-[#a89c86]">Jogados</span>
          <span className="mt-1 block font-[family-name:var(--font-mono)] text-xl font-semibold text-[#e6dcc9] tabular-nums">
            {globalStats.jogados}
            <span className="text-sm font-normal text-[#a89c86]"> / {todos.length}</span>
          </span>
        </div>

        <div className="bg-[#14120f] border border-[#2b2721] rounded-xl p-3.5">
          <span className="block text-xs text-[#a89c86]">Cartões frágeis</span>
          <span
            className={`mt-1 block font-[family-name:var(--font-mono)] text-xl font-semibold tabular-nums ${
              fragileIds.length > 0 ? 'text-[#e0a89f]' : 'text-[#7a9459]'
            }`}
          >
            {fragileIds.length}
          </span>
        </div>
      </section>

      {/* Priority Drills & Audio Lessons */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={handleStartFragile}
          className="min-h-[68px] p-4 rounded-xl bg-[#14120f] border border-[#2b2721] hover:border-[#a9413a]/70 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#1d1210] border border-[#5c2e29] flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle size={18} className="text-[#e0a89f]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold text-[#e6dcc9] tabular-nums">
                Os frágeis {fragileIds.length > 0 ? `(${fragileIds.length})` : ''}
              </div>
              <p className="text-xs text-[#a89c86] mt-0.5">
                {fragileIds.length > 0
                  ? 'Treinar só onde os erros superam os acertos'
                  : 'Nenhum cartão frágil acumulado'}
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#a89c86] shrink-0" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('aulas')}
          className="min-h-[68px] p-4 rounded-xl bg-[#14120f] border border-[#2b2721] hover:border-[#c9a227]/60 text-left flex items-center justify-between gap-3 transition-colors cursor-pointer"
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#1a160d] border border-[#4a3c12] flex items-center justify-center shrink-0 mt-0.5">
              <Headphones size={18} className="text-[#f2d480]" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold text-[#e6dcc9]">
                As Aulas Faladas (5 aulas + abertura)
              </div>
              <p className="text-xs text-[#a89c86] mt-0.5">
                Fundamentos, LDB, ECA, Arte e História para ouvir em movimento
              </p>
            </div>
          </div>
          <ChevronRight size={18} className="text-[#a89c86] shrink-0" aria-hidden="true" />
        </button>
      </section>

      {/* Free Training Modes */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold text-[#e6dcc9]">
            Modos de treino livre
          </h2>
          <button
            type="button"
            onClick={() => onNavigate('treino')}
            className="text-xs font-medium text-[#c9a227] hover:text-[#f2d480] py-2 px-1 whitespace-nowrap cursor-pointer"
          >
            Escolher grupo →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: 'Par: Campo → Elementos',
              desc: 'Dança (6 campos), Laban (4 fatores) e Artes Visuais (4 colunas).',
              ids: parearIds,
              Icon: Puzzle,
            },
            {
              title: 'Colunas: Sentir × Julgar',
              desc: 'Estética × Crítica, Gavetas do Século e Verbo do Enunciado.',
              ids: classificarIds,
              Icon: Layers,
            },
            {
              title: 'A Palavra Literal',
              desc: `A frase exata da ficha contra o distrator (${IDS_LITERAL.length} armadilhas).`,
              ids: IDS_LITERAL,
              Icon: ScrollText,
            },
          ].map(({ title, desc, ids, Icon }) => {
            const avg = maestriaMedia(progress, ids);
            const pct = Math.round((avg / 3) * 100);
            const lvl = Math.min(3, Math.floor(avg)) as 0 | 1 | 2 | 3;
            return (
              <button
                key={title}
                type="button"
                onClick={() => onNavigate('treino')}
                className="p-4 rounded-xl bg-[#14120f] border border-[#2b2721] hover:border-[#c9a227]/60 text-left flex flex-col justify-between gap-3 transition-colors cursor-pointer"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <Icon size={18} className="text-[#c9a227]" aria-hidden="true" />
                    <span className="inline-flex items-center gap-1 text-xs text-[#a89c86] font-[family-name:var(--font-mono)] tabular-nums">
                      <MasteryIcon level={lvl} size={13} />
                      {avg.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-[#e6dcc9]">{title}</h3>
                  <p className="text-xs text-[#a89c86] leading-relaxed">{desc}</p>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#241f19] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4d5c34] to-[#c9a227]"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Exam Footer */}
      <footer className="pt-4 border-t border-[#2b2721] text-center text-xs text-[#a89c86]">
        Prova: 22/11/2026 às 8h · Escola Municipal Frei Valentim · Corte: 10/14
      </footer>
    </div>
  );
}
