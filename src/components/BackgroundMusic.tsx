import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const backgroundMusicUrl = new URL('../../sound/Vietsub  Bất Phàm - Vương Tranh Lượng (OST Phàm Nhân Tu Tiên) - Cửu Trùng Thiên.mp3', import.meta.url).href;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userStoppedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.28;
    audio.load();

    const handlePlaying = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };
    const handlePaused = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePaused);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePaused);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  const playBackgroundMusic = async () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;

    setIsLoading(true);
    try {
      audio.loop = true;
      audio.muted = false;
      audio.volume = 0.28;
      await audio.play();
    } catch {
      setIsPlaying(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleFirstInteraction = (event: PointerEvent | KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest('[data-music-toggle]') || userStoppedRef.current) return;
      void playBackgroundMusic();
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { once: true });
    window.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  const handleToggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!audio.paused || isPlaying) {
      userStoppedRef.current = true;
      audio.pause();
      setIsPlaying(false);
      setIsLoading(false);
      return;
    }

    userStoppedRef.current = false;
    await playBackgroundMusic();
  };

  return (
    <>
      <audio ref={audioRef} src={backgroundMusicUrl} preload="auto" />
      <button
        data-music-toggle
        type="button"
        onClick={handleToggleMusic}
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded border border-dark-gold/50 bg-zinc-950/90 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gold-theme shadow-[0_0_20px_rgba(0,0,0,0.55)] backdrop-blur-sm transition-all hover:border-gold-theme hover:bg-amber-950/30"
      >
        {isLoading ? (
          <>
            <Volume2 className="h-4 w-4 animate-pulse" />
            Đang tải nhạc
          </>
        ) : isPlaying ? (
          <>
            <VolumeX className="h-4 w-4" />
            Tắt nhạc nền
          </>
        ) : (
          <>
            <Volume2 className="h-4 w-4" />
            Bật nhạc nền
          </>
        )}
      </button>
    </>
  );
}
