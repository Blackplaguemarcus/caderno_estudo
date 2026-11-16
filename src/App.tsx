/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { AudioMiniBar } from './components/AudioMiniBar';
import { AulasView } from './components/AulasView';
import { BottomNav } from './components/BottomNav';
import { GameSession } from './components/GameSession';
import { HomeView } from './components/HomeView';
import { MapaView } from './components/MapaView';
import { TopBar } from './components/TopBar';
import { TreinoSelectView } from './components/TreinoSelectView';
import { todosOsIds } from './data/banco';
import { useLessonPlayer } from './hooks/useLessonPlayer';
import type { ActiveTab, ProgressMap, SessionConfig } from './types/study';
import { fxPreferido, guardarFx, pararChill } from './utils/sound';
import {
  diasParaProva,
  estaDevido,
  loadProgress,
  recordResult,
  registarHistorico,
  saveProgress,
} from './utils/storage';

export default function App() {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [activeTab, setActiveTab] = useState<ActiveTab>('casa');
  const [session, setSession] = useState<SessionConfig | null>(null);
  const [fxEnabled, setFxEnabled] = useState<boolean>(() => fxPreferido());
  const [toast, setToast] = useState<{ msg: string; tone: 'neutral' | 'error' } | null>(null);

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const player = useLessonPlayer();

  const notify = useCallback((msg: string, tone: 'neutral' | 'error' = 'neutral') => {
    setToast({ msg, tone });
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const handleRecord = useCallback((id: string, acertou: boolean) => {
    setProgress((prev) => recordResult(prev, id, acertou));
  }, []);

  const handleStartSession = useCallback((config: SessionConfig) => {
    pararChill(true);
    setSession(config);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleExitSession = useCallback(() => {
    setProgress((prev) => {
      registarHistorico(prev);
      return prev;
    });
    setSession(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavigate = useCallback((tab: ActiveTab) => {
    setSession(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleToggleFx = useCallback(() => {
    setFxEnabled((prev) => {
      const next = !prev;
      guardarFx(next);
      return next;
    });
  }, []);

  const handleImportProgress = useCallback((next: ProgressMap) => {
    saveProgress(next);
    setProgress(next);
    registarHistorico(next);
  }, []);

  const handleResetProgress = useCallback(() => {
    saveProgress({});
    setProgress({});
  }, []);

  const dueCount = todosOsIds().filter((id) => estaDevido(progress, id)).length;
  const daysLeft = diasParaProva();

  return (
    <div className="min-h-screen bg-[#0e0d0b] text-[#e6dcc9] flex flex-col">
      <TopBar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        dueCount={dueCount}
        daysLeft={daysLeft}
        fxEnabled={fxEnabled}
        onToggleFx={handleToggleFx}
        inSession={session !== null}
      />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 pt-5 pb-24 md:pb-12">
        {session ? (
          <GameSession
            config={session}
            progress={progress}
            onRecord={handleRecord}
            onExit={handleExitSession}
            onNotify={notify}
          />
        ) : activeTab === 'casa' ? (
          <HomeView
            progress={progress}
            onStartSession={handleStartSession}
            onNavigate={handleNavigate}
            onNotify={notify}
          />
        ) : activeTab === 'treino' ? (
          <TreinoSelectView progress={progress} onStartSession={handleStartSession} />
        ) : activeTab === 'aulas' ? (
          <AulasView player={player} />
        ) : (
          <MapaView
            progress={progress}
            isAudioPlaying={player.playing}
            onImportProgress={handleImportProgress}
            onResetProgress={handleResetProgress}
            onNotify={notify}
          />
        )}
      </main>

      {!session && activeTab !== 'aulas' && (
        <AudioMiniBar player={player} onOpenAulas={() => handleNavigate('aulas')} />
      )}

      {!session && <BottomNav activeTab={activeTab} onNavigate={handleNavigate} />}

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl border text-xs sm:text-sm max-w-[90vw] shadow-xl transition-all ${
            session ? 'bottom-16 sm:bottom-6' : 'bottom-20 md:bottom-6'
          } ${
            toast.tone === 'error'
              ? 'bg-[#1a1110] border-[#a9413a] text-[#e8c4c0]'
              : 'bg-[#1c1915] border-[#3a332a] text-[#e6dcc9]'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
