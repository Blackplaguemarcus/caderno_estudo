import { useCallback, useEffect, useRef, useState } from 'react';
import { AULAS } from '../data/banco';
import { chillDuck } from '../utils/sound';
import { CHAVE_AUDIO } from '../utils/storage';

export interface LessonPlayerState {
  aulaIdx: number;
  playing: boolean;
  vel: number;
  currentTime: number;
  duration: number;
  topicIdx: number;
  mode: 'audio' | 'speech';
  load: (idx: number, autoPlay?: boolean) => void;
  toggle: () => void;
  skip: (deltaSec: number) => void;
  setSpeed: (v: number) => void;
  seekPct: (pct: number) => void;
  selectTopic: (idx: number) => void;
}

function loadSavedAudioState(): { idx: number; vel: number } {
  try {
    const parsed = JSON.parse(localStorage.getItem(CHAVE_AUDIO) || '{}');
    const idx =
      typeof parsed.idx === 'number' && parsed.idx >= 0 && parsed.idx < AULAS.length
        ? parsed.idx
        : 0;
    const vel = typeof parsed.vel === 'number' ? parsed.vel : 1.0;
    return { idx, vel };
  } catch {
    return { idx: 0, vel: 1.0 };
  }
}

export function formatTime(sec: number): string {
  if (!sec || Number.isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function useLessonPlayer(): LessonPlayerState {
  const saved = useRef(loadSavedAudioState());
  const [aulaIdx, setAulaIdx] = useState<number>(saved.current.idx);
  const [vel, setVel] = useState<number>(saved.current.vel);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [topicIdx, setTopicIdx] = useState(0);
  const [mode, setMode] = useState<'audio' | 'speech'>('speech');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechQueueRef = useRef<string[]>([]);
  const speechActiveRef = useRef(false);
  const aulaIdxRef = useRef(aulaIdx);
  const velRef = useRef(vel);
  const topicIdxRef = useRef(topicIdx);

  aulaIdxRef.current = aulaIdx;
  velRef.current = vel;
  topicIdxRef.current = topicIdx;

  const persist = useCallback((idx: number, speed: number) => {
    try {
      localStorage.setItem(CHAVE_AUDIO, JSON.stringify({ idx, vel: speed }));
    } catch {
      /* ignore */
    }
  }, []);

  const stopSpeech = useCallback(() => {
    speechActiveRef.current = false;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const buildSegments = useCallback((idx: number): string[] => {
    const aula = AULAS[idx];
    return [
      `Aula ${aula.numero}. ${aula.titulo}. ${aula.subtitulo}.`,
      ...aula.topicos,
    ];
  }, []);

  const speakSegment = useCallback(
    (lessonIdx: number, segIdx: number, speed: number) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        setPlaying(false);
        chillDuck(false);
        return;
      }
      const segments = buildSegments(lessonIdx);
      speechQueueRef.current = segments;
      if (segIdx >= segments.length) {
        if (lessonIdx + 1 < AULAS.length) {
          const next = lessonIdx + 1;
          setAulaIdx(next);
          setTopicIdx(0);
          setCurrentTime(0);
          setDuration(buildSegments(next).length * 14);
          persist(next, speed);
          speakSegment(next, 0, speed);
        } else {
          speechActiveRef.current = false;
          setPlaying(false);
          chillDuck(false);
        }
        return;
      }

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(segments[segIdx]);
      utter.lang = 'pt-BR';
      utter.rate = speed;

      const voices = window.speechSynthesis.getVoices();
      const ptVoice = voices.find((v) => v.lang.toLowerCase().startsWith('pt'));
      if (ptVoice) utter.voice = ptVoice;

      setTopicIdx(segIdx);
      setDuration(segments.length * 14);
      setCurrentTime(segIdx * 14);

      utter.onend = () => {
        if (!speechActiveRef.current) return;
        speakSegment(lessonIdx, segIdx + 1, velRef.current);
      };
      utter.onerror = () => {
        if (!speechActiveRef.current) return;
        speechActiveRef.current = false;
        setPlaying(false);
        chillDuck(false);
      };

      speechActiveRef.current = true;
      setPlaying(true);
      chillDuck(true);
      window.speechSynthesis.speak(utter);
    },
    [buildSegments, persist]
  );

  // Clean up speech/audio on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [stopSpeech]);

  // Smooth simulated progress ticker when using speech synthesis
  useEffect(() => {
    if (!playing || mode !== 'speech') return;
    const timer = setInterval(() => {
      setCurrentTime((prev) => {
        const segStart = topicIdxRef.current * 14;
        const segCap = segStart + 13;
        return prev < segCap ? prev + 0.5 * velRef.current : prev;
      });
    }, 500);
    return () => clearInterval(timer);
  }, [playing, mode]);

  const load = useCallback(
    (idx: number, autoPlay = true) => {
      if (idx < 0 || idx >= AULAS.length) return;
      stopSpeech();
      if (audioRef.current) {
        audioRef.current.pause();
      }

      setAulaIdx(idx);
      setTopicIdx(0);
      setCurrentTime(0);
      const segs = buildSegments(idx);
      setDuration(segs.length * 14);
      persist(idx, velRef.current);

      if (!autoPlay) {
        setPlaying(false);
        chillDuck(false);
        return;
      }

      // Try native MP3 first if available on origin; fall back cleanly to SpeechSynthesis
      const aula = AULAS[idx];
      const audio = new Audio();
      audioRef.current = audio;
      audio.playbackRate = velRef.current;

      let settled = false;

      const fallbackToSpeech = () => {
        if (settled) return;
        settled = true;
        audio.src = '';
        setMode('speech');
        speakSegment(idx, 0, velRef.current);
      };

      audio.addEventListener('canplaythrough', () => {
        if (settled) return;
        settled = true;
        setMode('audio');
        setDuration(audio.duration || segs.length * 14);
        audio
          .play()
          .then(() => {
            setPlaying(true);
            chillDuck(true);
          })
          .catch(fallbackToSpeech);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
        if (audio.duration) setDuration(audio.duration);
      });

      audio.addEventListener('ended', () => {
        if (idx + 1 < AULAS.length) {
          load(idx + 1, true);
        } else {
          setPlaying(false);
          chillDuck(false);
        }
      });

      audio.addEventListener('error', fallbackToSpeech);
      audio.src = aula.srcMp3;
      audio.load();
    },
    [buildSegments, persist, speakSegment, stopSpeech]
  );

  const toggle = useCallback(() => {
    if (mode === 'audio' && audioRef.current && audioRef.current.src) {
      if (audioRef.current.paused) {
        audioRef.current
          .play()
          .then(() => {
            setPlaying(true);
            chillDuck(true);
          })
          .catch(() => {});
      } else {
        audioRef.current.pause();
        setPlaying(false);
        chillDuck(false);
      }
      return;
    }

    if (playing) {
      stopSpeech();
      setPlaying(false);
      chillDuck(false);
    } else {
      setMode('speech');
      speakSegment(aulaIdxRef.current, topicIdxRef.current, velRef.current);
    }
  }, [mode, playing, speakSegment, stopSpeech]);

  const skip = useCallback(
    (deltaSec: number) => {
      if (mode === 'audio' && audioRef.current && audioRef.current.duration) {
        audioRef.current.currentTime = Math.max(
          0,
          Math.min(audioRef.current.duration, audioRef.current.currentTime + deltaSec)
        );
        return;
      }
      const segments = buildSegments(aulaIdxRef.current);
      const step = deltaSec > 0 ? 1 : -1;
      const nextSeg = Math.max(0, Math.min(segments.length - 1, topicIdxRef.current + step));
      setTopicIdx(nextSeg);
      setCurrentTime(nextSeg * 14);
      if (playing) {
        speakSegment(aulaIdxRef.current, nextSeg, velRef.current);
      }
    },
    [buildSegments, mode, playing, speakSegment]
  );

  const setSpeed = useCallback(
    (v: number) => {
      setVel(v);
      velRef.current = v;
      persist(aulaIdxRef.current, v);
      if (mode === 'audio' && audioRef.current) {
        audioRef.current.playbackRate = v;
      } else if (playing) {
        speakSegment(aulaIdxRef.current, topicIdxRef.current, v);
      }
    },
    [mode, persist, playing, speakSegment]
  );

  const seekPct = useCallback(
    (pct: number) => {
      if (mode === 'audio' && audioRef.current && audioRef.current.duration) {
        audioRef.current.currentTime = audioRef.current.duration * pct;
        return;
      }
      const segments = buildSegments(aulaIdxRef.current);
      const targetSeg = Math.min(
        segments.length - 1,
        Math.max(0, Math.floor(pct * segments.length))
      );
      setTopicIdx(targetSeg);
      setCurrentTime(targetSeg * 14);
      if (playing) {
        speakSegment(aulaIdxRef.current, targetSeg, velRef.current);
      }
    },
    [buildSegments, mode, playing, speakSegment]
  );

  const selectTopic = useCallback(
    (segIdx: number) => {
      const segments = buildSegments(aulaIdxRef.current);
      const clamped = Math.max(0, Math.min(segments.length - 1, segIdx));
      setTopicIdx(clamped);
      setCurrentTime(clamped * 14);
      setMode('speech');
      speakSegment(aulaIdxRef.current, clamped, velRef.current);
    },
    [buildSegments, speakSegment]
  );

  return {
    aulaIdx,
    playing,
    vel,
    currentTime,
    duration,
    topicIdx,
    mode,
    load,
    toggle,
    skip,
    setSpeed,
    seekPct,
    selectTopic,
  };
}
