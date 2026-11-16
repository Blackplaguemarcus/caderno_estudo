import { Volume2, VolumeX } from 'lucide-react';
import type { ActiveTab } from '../types/study';

interface TopBarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  dueCount: number;
  daysLeft: number;
  fxEnabled: boolean;
  onToggleFx: () => void;
  inSession: boolean;
}

const DESKTOP_LINKS: { id: ActiveTab; label: string }[] = [
  { id: 'casa', label: 'Início' },
  { id: 'treino', label: 'Treino' },
  { id: 'aulas', label: 'Aulas' },
  { id: 'mapa', label: 'Meu Mapa' },
];

export function TopBar({
  activeTab,
  onNavigate,
  dueCount,
  daysLeft,
  fxEnabled,
  onToggleFx,
  inSession,
}: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 h-[52px] bg-[#0e0d0b]/90 backdrop-blur-md border-b border-[#2b2721] pt-safe">
      <div className="max-w-5xl mx-auto h-full px-4 flex items-center justify-between gap-4">
        {/* Zone 1: Single-element brand wordmark */}
        <button
          type="button"
          onClick={() => onNavigate('casa')}
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-wide text-[#e6dcc9] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a227] rounded px-1 -ml-1"
        >
          <span className="text-[#c9a227]">O</span> Caderno Vivo
        </button>

        {/* Zone 2: Desktop single-line nav links (hidden on mobile & during active session) */}
        {!inSession ? (
          <nav className="hidden md:flex items-center gap-6" aria-label="Navegação principal">
            {DESKTOP_LINKS.map((link) => {
              const active = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  className={`text-sm font-medium whitespace-nowrap shrink-0 py-1 border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'text-[#f2d480] border-[#c9a227]'
                      : 'text-[#a89c86] border-transparent hover:text-[#e6dcc9]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>
        ) : (
          <span className="hidden md:inline text-xs text-[#a89c86] tabular-nums whitespace-nowrap">
            ACT 2027 · Professor de Arte · Itapoá/SC
          </span>
        )}

        {/* Zone 3: Compact metadata + single FX action */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-[#a89c86] font-[family-name:var(--font-mono)] tabular-nums whitespace-nowrap">
            {daysLeft > 0 ? `${daysLeft}d` : 'Hoje'}
            <span className="mx-1.5 text-[#5a5145]" aria-hidden="true">
              ·
            </span>
            <span className={dueCount > 0 ? 'text-[#f2d480]' : 'text-[#a89c86]'}>
              {dueCount} a rever
            </span>
          </span>

          <button
            type="button"
            onClick={onToggleFx}
            aria-label={fxEnabled ? 'Silenciar efeitos sonoros' : 'Ativar efeitos sonoros'}
            title={fxEnabled ? 'Efeitos sonoros ligados' : 'Efeitos sonoros desligados'}
            className="min-h-[44px] min-w-[44px] -mr-2 flex items-center justify-center rounded-lg text-[#a89c86] hover:text-[#f2d480] transition-colors cursor-pointer"
          >
            {fxEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
