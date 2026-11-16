export type MasteryLevel = 0 | 1 | 2 | 3;

export interface ProgressRecord {
  v: MasteryLevel;
  a: number;
  e: number;
  seg: number;
  ultimo: number;
}

export type ProgressMap = Record<string, ProgressRecord>;

export interface HistorySnapshot {
  d: string;
  a: number;
  e: number;
  jog: number;
  total: number;
  v: number;
}

export interface ParearGroup {
  id: string;
  grupo: string;
  fonte: string;
  tamanho: number;
  rotulos: Record<string, string[]>;
}

export interface ClassificarColumn {
  id: string;
  nome: string;
}

export interface ClassificarFicha {
  id: string;
  texto: string;
  col: string;
}

export interface ClassificarSet {
  id: string;
  grupo: string;
  fonte: string;
  quantos: number;
  colunas: ClassificarColumn[];
  fichas: ClassificarFicha[];
}

export interface LiteralQuestion {
  id: string;
  grupo: string;
  fonte: string;
  enunciado: string;
  opcoes: string[];
  certa: number;
  nota: string;
}

export interface BancoData {
  versao: string;
  parear: ParearGroup[];
  classificar: ClassificarSet[];
  literal: LiteralQuestion[];
}

export interface CardIndexEntry {
  id: string;
  tipo: 'parear' | 'classificar' | 'literal';
  texto: string;
  fonte: string;
  grupo: string;
  extra: string;
  nota?: string;
}

export interface AulaItem {
  id: string;
  numero: string;
  titulo: string;
  subtitulo: string;
  duracaoTexto: string;
  srcMp3: string;
  srcWav: string;
  topicos: string[];
}

export interface GroupStats {
  a: number;
  e: number;
  taxa: number | null;
  media: number;
  jogados: number;
  total: number;
}

export type ActiveTab = 'casa' | 'treino' | 'aulas' | 'mapa';

export type RoundSpec =
  | {
      kind: 'parear';
      grupo: ParearGroup;
      filterMode?: 'due' | 'fragile';
    }
  | {
      kind: 'classificar';
      set: ClassificarSet;
      filterMode?: 'due' | 'fragile';
    }
  | {
      kind: 'literal';
      perguntas: LiteralQuestion[];
    };

export interface SessionConfig {
  titulo: string;
  rodadas: RoundSpec[];
}
