import {
  BANCO,
  IDS_CLASSIFICAR,
  IDS_LITERAL,
  IDS_PAREAR,
  chipId,
  todosOsIds,
} from '../data/banco';
import type {
  GroupStats,
  HistorySnapshot,
  MasteryLevel,
  ProgressMap,
  ProgressRecord,
  RoundSpec,
} from '../types/study';

export const CHAVE_PROGRESSO = 'raven_estudo_act_v1';
export const CHAVE_HIST = 'raven_estudo_act_hist_v1';
export const CHAVE_AUDIO = 'raven_estudo_act_audio_v1';

const H48 = 48 * 3600 * 1000;
const D7 = 7 * 24 * 3600 * 1000;

export const LEVEL_LABELS: Record<MasteryLevel, string> = {
  0: 'Hesitante',
  1: 'Praticado',
  2: 'Hábito',
  3: 'Assinatura',
};

export function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(CHAVE_PROGRESSO);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)
      ? parsed
      : {};
  } catch {
    return {};
  }
}

export function saveProgress(p: ProgressMap): void {
  try {
    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(p));
  } catch {
    /* private mode fallback */
  }
}

export function recordResult(
  progress: ProgressMap,
  id: string,
  acertou: boolean
): ProgressMap {
  const existing = progress[id] ?? { v: 0 as MasteryLevel, a: 0, e: 0, seg: 0, ultimo: 0 };
  const next: ProgressRecord = { ...existing, ultimo: Date.now() };
  if (acertou) {
    next.a += 1;
    next.seg += 1;
    if (next.seg >= 2 && next.v < 3) {
      next.v = (next.v + 1) as MasteryLevel;
      next.seg = 0;
    }
  } else {
    next.e += 1;
    next.seg = 0;
    if (next.v > 0) {
      next.v = (next.v - 1) as MasteryLevel;
    }
  }
  const updated = { ...progress, [id]: next };
  saveProgress(updated);
  return updated;
}

export function nivelDe(progress: ProgressMap, id: string): MasteryLevel {
  return progress[id] ? progress[id].v : 0;
}

export function estaDevido(progress: ProgressMap, id: string): boolean {
  const r = progress[id];
  if (!r) return true;
  const intervalo = r.v < 2 ? H48 : D7;
  return Date.now() - r.ultimo >= intervalo;
}

export function isFragil(progress: ProgressMap, id: string): boolean {
  const r = progress[id];
  return !!r && (r.e > r.a || r.a === 0);
}

export function estadoGrupo(progress: ProgressMap, ids: string[]): GroupStats {
  let a = 0;
  let e = 0;
  let soma = 0;
  let jogados = 0;
  ids.forEach((id) => {
    const r = progress[id];
    if (!r) return;
    a += r.a;
    e += r.e;
    soma += r.v;
    jogados += 1;
  });
  return {
    a,
    e,
    taxa: a + e ? a / (a + e) : null,
    media: jogados ? soma / jogados : 0,
    jogados,
    total: ids.length,
  };
}

export function maestriaMedia(progress: ProgressMap, ids: string[]): number {
  if (!ids.length) return 0;
  let s = 0;
  ids.forEach((id) => {
    s += nivelDe(progress, id);
  });
  return s / ids.length;
}

export function resumoNiveis(progress: ProgressMap, ids: string[]) {
  const nv = [0, 0, 0, 0];
  let nunca = 0;
  ids.forEach((id) => {
    const rec = progress[id];
    if (!rec) nunca += 1;
    else nv[rec.v] = (nv[rec.v] || 0) + 1;
  });
  return { nunca, nv };
}

export function diasParaProva(): number {
  const prova = new Date(2026, 10, 22, 8, 0, 0);
  const agora = new Date();
  const diffMs = prova.getTime() - agora.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function diasParado(ms?: number): number | null {
  if (!ms) return null;
  const d = Math.floor((Date.now() - ms) / 86400000);
  return d < 0 ? 0 : d;
}

export function historicoLer(): HistorySnapshot[] {
  try {
    const h = JSON.parse(localStorage.getItem(CHAVE_HIST) || '[]');
    return Array.isArray(h) ? h : [];
  } catch {
    return [];
  }
}

export function registarHistorico(progress: ProgressMap): HistorySnapshot[] {
  const h = historicoLer();
  const ids = todosOsIds();
  let a = 0;
  let e = 0;
  let jog = 0;
  let soma = 0;
  ids.forEach((id) => {
    const r = progress[id];
    if (!r) return;
    a += r.a;
    e += r.e;
    soma += r.v;
    jog += 1;
  });
  const d = new Date();
  const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
  const snap: HistorySnapshot = {
    d: chave,
    a,
    e,
    jog,
    total: ids.length,
    v: jog ? Math.round((100 * soma) / jog) / 100 : 0,
  };
  const idx = h.findIndex((x) => x.d === chave);
  if (idx >= 0) h[idx] = snap;
  else h.push(snap);
  h.sort((x, y) => (x.d < y.d ? -1 : x.d > y.d ? 1 : 0));
  const trimmed = h.slice(-60);
  try {
    localStorage.setItem(CHAVE_HIST, JSON.stringify(trimmed));
  } catch {
    /* ignore */
  }
  return trimmed;
}

export function baralhar<T>(arr: T[]): T[] {
  const c = arr.slice();
  for (let i = c.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = c[i];
    c[i] = c[j];
    c[j] = t;
  }
  return c;
}

export function comporSessaoFiltrada(
  progress: ProgressMap,
  mode: 'due' | 'fragile'
): RoundSpec[] {
  const filtro = mode === 'due' ? (id: string) => estaDevido(progress, id) : (id: string) => isFragil(progress, id);
  const rodadas: RoundSpec[] = [];

  const grupos = BANCO.parear
    .map((g) => ({ g, n: IDS_PAREAR[g.id].filter(filtro).length }))
    .sort((a, b) => b.n - a.n);
  if (grupos[0] && grupos[0].n > 0) {
    rodadas.push({ kind: 'parear', grupo: grupos[0].g, filterMode: mode });
  }

  const sets = BANCO.classificar
    .map((s) => ({ s, n: IDS_CLASSIFICAR[s.id].filter(filtro).length }))
    .sort((a, b) => b.n - a.n);
  if (sets[0] && sets[0].n > 0) {
    rodadas.push({ kind: 'classificar', set: sets[0].s, filterMode: mode });
  }

  const perguntas = baralhar(BANCO.literal.filter((q) => filtro(q.id))).slice(0, 5);
  if (perguntas.length > 0) {
    rodadas.push({ kind: 'literal', perguntas });
  }

  return rodadas;
}

export interface MapGroupItem {
  id: string;
  texto: string;
  nota: string;
}

export interface MapGroup {
  nome: string;
  fonte: string;
  itens: MapGroupItem[];
}

export function gruposDoMapa(): MapGroup[] {
  const g: MapGroup[] = [];
  BANCO.parear.forEach((gr) => {
    const itens: MapGroupItem[] = [];
    Object.keys(gr.rotulos).forEach((rot) => {
      gr.rotulos[rot].forEach((txt) => {
        itens.push({ id: chipId(gr.id, rot, txt), texto: txt, nota: `Campo: ${rot}` });
      });
    });
    g.push({ nome: gr.grupo, fonte: gr.fonte, itens });
  });
  BANCO.classificar.forEach((s) => {
    const nomes: Record<string, string> = {};
    s.colunas.forEach((c) => {
      nomes[c.id] = c.nome;
    });
    g.push({
      nome: s.grupo,
      fonte: s.fonte,
      itens: s.fichas.map((f) => ({
        id: f.id,
        texto: f.texto,
        nota: nomes[f.col] || '',
      })),
    });
  });
  g.push({
    nome: 'A Palavra Literal',
    fonte: 'LDB · ECA · Proposta de Itapoá · Arte',
    itens: BANCO.literal.map((q) => {
      const resposta = q.opcoes[q.certa];
      const curto =
        resposta.length > 52
          ? resposta.slice(0, 52).replace(/[,;\s]+\S*$/, '') + '…'
          : resposta;
      return { id: q.id, texto: curto, nota: `${q.grupo} · ${q.fonte}` };
    }),
  });
  return g;
}
