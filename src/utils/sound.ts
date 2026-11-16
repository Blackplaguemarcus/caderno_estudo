// Web Audio API sound effects + Chill ambient pad/arpeggio sequencer

const CHAVE_CHILL = 'raven_estudo_act_chill_v1';
const CHAVE_FX = 'raven_estudo_act_fx_v1';

let ctxSom: AudioContext | null = null;

function contextoDeSom(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctxSom) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctxSom = new AC();
  }
  if (ctxSom.state === 'suspended') {
    ctxSom.resume().catch(() => {});
  }
  return ctxSom;
}

if (typeof document !== 'undefined') {
  document.addEventListener(
    'pointerdown',
    () => {
      contextoDeSom();
    },
    { passive: true }
  );
}

export function fxPreferido(): boolean {
  try {
    const v = localStorage.getItem(CHAVE_FX);
    return v === null ? true : v === '1';
  } catch {
    return true;
  }
}

export function guardarFx(on: boolean): void {
  try {
    localStorage.setItem(CHAVE_FX, on ? '1' : '0');
  } catch {
    /* ignore */
  }
}

export function haptic(ms = 12): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(ms);
    }
  } catch {
    /* ignore */
  }
}

export function somAcerto(): void {
  if (!fxPreferido()) return;
  const ctx = contextoDeSom();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'triangle';
  o.frequency.setValueAtTime(587.33, t);
  o.frequency.exponentialRampToValueAtTime(783.99, t + 0.07);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.18);
}

export function somErro(): void {
  if (!fxPreferido()) return;
  const ctx = contextoDeSom();
  if (!ctx) return;
  const t = ctx.currentTime + 0.01;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.setValueAtTime(220, t);
  o.frequency.exponentialRampToValueAtTime(164.81, t + 0.12);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.08, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(t);
  o.stop(t + 0.2);
}

export function somGabaritou(): void {
  if (!fxPreferido()) return;
  const ctx = contextoDeSom();
  if (!ctx) return;
  const t0 = ctx.currentTime + 0.02;
  [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o.frequency.value = f;
    const t = t0 + i * 0.11;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.6);
  });
}

export function somDoFim(erros: number): void {
  if (!fxPreferido()) return;
  if (!erros) {
    somGabaritou();
    return;
  }
  const ctx = contextoDeSom();
  if (!ctx) return;
  const t0 = ctx.currentTime + 0.02;
  [
    [392.0, 0],
    [329.63, 0.16],
  ].forEach(([freq, delay]) => {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    const t = t0 + delay;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.09, t + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    o.connect(g);
    g.connect(ctx.destination);
    o.start(t);
    o.stop(t + 0.5);
  });
}

// Ambient chill sequencer (Am7 - Fmaj7 - Cmaj7 - G6 at 72 BPM)
const ACORDES_CHILL = [
  [220.0, 261.63, 329.63, 392.0],
  [174.61, 220.0, 261.63, 329.63],
  [130.81, 164.81, 196.0, 246.94],
  [196.0, 246.94, 293.66, 329.63],
];
const CHILL_BPM = 72;
const CHILL_TEMPOS = 8;
const CHILL_TEMPO = 60 / CHILL_BPM;
const CHILL_DUR = CHILL_TEMPO * CHILL_TEMPOS;
const CHILL_SWING = 0.12;
const ARP_PADRAO = [0, 2, 1, 3, 4, 3, 1, 2];

interface ChillState {
  ligado: boolean;
  timer: ReturnType<typeof setInterval> | null;
  nos: OscillatorNode[];
  ganho: GainNode | null;
  filtro: BiquadFilterNode | null;
  passo: number;
  proximo: number;
  ducked: boolean;
}

export function chillPreferido(): boolean {
  try {
    const v = localStorage.getItem(CHAVE_CHILL);
    return v === null ? true : v === '1';
  } catch {
    return true;
  }
}

export function guardarChill(ligado: boolean): void {
  try {
    localStorage.setItem(CHAVE_CHILL, ligado ? '1' : '0');
  } catch {
    /* ignore */
  }
}

const chill: ChillState = {
  ligado: chillPreferido(),
  timer: null,
  nos: [],
  ganho: null,
  filtro: null,
  passo: 0,
  proximo: 0,
  ducked: false,
};

function chillPad(ctx: AudioContext, idx: number, t: number): void {
  if (!chill.filtro) return;
  const acorde = ACORDES_CHILL[idx];
  const dur = CHILL_DUR + 0.6;
  const vozes: [number, number][] = acorde.map((f, i) => [
    f,
    [0.34, 0.26, 0.2, 0.14][i] || 0.14,
  ]);
  vozes.push([acorde[0] * 2, 0.12]);
  vozes.forEach(([f, baseVol], i) => {
    const v = baseVol * (0.85 + Math.random() * 0.15);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = i ? 'sine' : 'triangle';
    o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(v, t + 1.9);
    g.gain.exponentialRampToValueAtTime(v * 0.65, t + dur - 1.1);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g);
    g.connect(chill.filtro!);
    o.start(t);
    o.stop(t + dur + 0.1);
    chill.nos.push(o);
  });
}

function chillArpejo(ctx: AudioContext, idx: number, dentro: number, t: number): void {
  if (!chill.filtro) return;
  const acorde = ACORDES_CHILL[idx];
  const pos = ARP_PADRAO[dentro] || 0;
  const f = pos === 4 ? acorde[0] * 4 : acorde[pos];
  const v = 0.13 * (0.7 + Math.random() * 0.3);
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = 'sine';
  o.frequency.value = f;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(v, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  o.connect(g);
  g.connect(chill.filtro);
  o.start(t);
  o.stop(t + 1.2);
  chill.nos.push(o);
}

function chillAgenda(): void {
  if (!chill.ligado || !ctxSom) return;
  const ctx = ctxSom;
  if (chill.proximo < ctx.currentTime - 0.5) chill.proximo = ctx.currentTime + 0.05;
  const horizonte = ctx.currentTime + 0.5;
  let n = 0;
  while (chill.proximo < horizonte && n < 10) {
    const passo = chill.passo;
    const idx = Math.floor(passo / CHILL_TEMPOS) % ACORDES_CHILL.length;
    const dentro = passo % CHILL_TEMPOS;
    const atraso = dentro % 2 ? CHILL_TEMPO * CHILL_SWING : 0;
    const jitter = (Math.random() - 0.5) * 0.03;
    if (dentro === 0) chillPad(ctx, idx, chill.proximo);
    chillArpejo(ctx, idx, dentro, chill.proximo + atraso + jitter);
    chill.proximo += CHILL_TEMPO;
    chill.passo += 1;
    n += 1;
  }
  chill.nos = chill.nos.slice(-60);
}

export function ligarChill(isAudioPlaying: boolean): void {
  chill.ligado = chillPreferido();
  if (!chill.ligado || chill.timer) return;
  const ctx = contextoDeSom();
  if (!ctx) return;
  if (!chill.ganho) {
    chill.ganho = ctx.createGain();
    chill.ganho.connect(ctx.destination);
  }
  if (!chill.filtro) {
    chill.filtro = ctx.createBiquadFilter();
    chill.filtro.type = 'lowpass';
    chill.filtro.frequency.value = 900;
    chill.filtro.Q.value = 0.7;
    chill.filtro.connect(chill.ganho);
    const lfo = ctx.createOscillator();
    const lfoGanho = ctx.createGain();
    lfo.type = 'sine';
    lfo.frequency.value = 0.05;
    lfoGanho.gain.value = 380;
    lfo.connect(lfoGanho);
    lfoGanho.connect(chill.filtro.frequency);
    lfo.start();
  }
  chill.ducked = isAudioPlaying;
  const alvo = isAudioPlaying ? 0.03 : 0.18;
  chill.ganho.gain.cancelScheduledValues(ctx.currentTime);
  chill.ganho.gain.setValueAtTime(Math.max(0.0001, chill.ganho.gain.value), ctx.currentTime);
  chill.ganho.gain.exponentialRampToValueAtTime(alvo, ctx.currentTime + 1.4);
  chill.passo = 0;
  chill.proximo = ctx.currentTime + 0.15;
  chill.timer = setInterval(chillAgenda, 120);
  chillAgenda();
}

export function pararChill(imediato = false): void {
  if (chill.timer) {
    clearInterval(chill.timer);
    chill.timer = null;
  }
  const nos = chill.nos;
  chill.nos = [];
  if (chill.ganho && ctxSom) {
    const t = ctxSom.currentTime;
    try {
      chill.ganho.gain.cancelScheduledValues(t);
      chill.ganho.gain.setValueAtTime(Math.max(0.0001, chill.ganho.gain.value), t);
      chill.ganho.gain.exponentialRampToValueAtTime(0.0001, t + (imediato ? 0.25 : 1.2));
    } catch {
      /* ignore */
    }
  }
  setTimeout(() => {
    nos.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* ignore */
      }
    });
  }, imediato ? 300 : 1300);
}

export function chillDuck(mudo: boolean): void {
  chill.ducked = mudo;
  if (!chill.ganho || !ctxSom || !chill.timer) return;
  const t = ctxSom.currentTime;
  try {
    chill.ganho.gain.cancelScheduledValues(t);
    chill.ganho.gain.setValueAtTime(Math.max(0.0001, chill.ganho.gain.value), t);
    chill.ganho.gain.exponentialRampToValueAtTime(mudo ? 0.03 : 0.18, t + 0.8);
  } catch {
    /* ignore */
  }
}
