import { BookOpen, Compass, Headphones, Layers } from 'lucide-react';
import type { ActiveTab } from '../types/study';

interface BottomNavProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
}

const ITEMS: {
  id: ActiveTab;
  label: string;
  Icon: typeof BookOpen;
}[] = [
  { id: 'casa', label: 'Início', Icon: BookOpen },
  { id: 'treino', label: 'Treinar', Icon: Layers },
  { id: 'aulas', label: 'Aulas', Icon: Headphones },
  { id: 'mapa', label: 'Mapa', Icon: Compass },
];

export function BottomNav({ activeTab, onNavigate }: BottomNavProps) {
  return (
    <nav
      aria-label="Navegação móvel"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#14120f]/95 backdrop-blur-md border-t border-[#2b2721] pb-safe"
    >
      <div className="grid grid-cols-4 h-[56px] max-w-lg mx-auto">
        {ITEMS.map(({ id, label, Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`min-h-[44px] flex flex-col items-center justify-center gap-0.5 transition-colors cursor-pointer ${
                active ? 'text-[#f2d480]' : 'text-[#a89c86] active:text-[#e6dcc9]'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} aria-hidden="true" />
              <span className="text-[11px] font-medium tracking-tight leading-none whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
