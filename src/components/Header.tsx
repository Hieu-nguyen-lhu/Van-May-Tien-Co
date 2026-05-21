import React, { useState, useEffect } from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { REALM_QUOTES } from '../data.ts';

export default function Header() {
  const [currentQuote, setCurrentQuote] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  // Update clock relative to simulated space-time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('vi-VN', { hour12: false });
      setCurrentTime(timeStr);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cycle high-concept spiritual quote
  useEffect(() => {
    const selectRandomQuote = () => {
      const idx = Math.floor(Math.random() * REALM_QUOTES.length);
      setCurrentQuote(REALM_QUOTES[idx]);
    };
    selectRandomQuote();
    const cycle = setInterval(selectRandomQuote, 12000);
    return () => clearInterval(cycle);
  }, []);

  return (
    <header className="relative border-b border-dark-gold/30 py-6 px-4 md:px-8 bg-zinc-950/80 backdrop-blur-sm z-30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Dynamic Ancient Title */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full border border-dark-gold/40 flex items-center justify-center p-1 bg-amber-950/10">
              <Compass className="w-6 h-6 text-gold-theme animate-spin-slow" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
            </span>
          </div>
          <div>
            <h1 className="font-serif text-2xl md:text-3xl tracking-wide text-paper-theme flex items-center gap-2">
              <span className="text-gold-theme font-semibold italic glow-text">Thiên Cơ Các</span>
              <span className="text-xs font-sans tracking-widest px-1.5 py-0.5 border border-dark-gold/30 bg-black/40 text-gold-theme rounded">
                ĐO TIÊN DUYÊN
              </span>
            </h1>
            <p className="text-[10px] font-sans text-gold-theme/60 uppercase tracking-[0.25em]">
              Thế Giới Tu Tiên • Khảo Hạch Thần Mạch
            </p>
          </div>
        </div>

        {/* Traditional Center Quote */}
        <div className="hidden lg:block text-center max-w-md bg-black/40 border border-dark-gold/20 py-1.5 px-4 rounded-full">
          <p className="font-serif text-xs italic text-paper-theme/80 truncate">
            {currentQuote}
          </p>
        </div>

        {/* Space time sync indicators */}
        <div className="flex items-center gap-4 text-xs font-mono text-gold-theme">
          <div className="text-right">
            <div className="text-[9px] text-gold-theme/50 uppercase tracking-widest">Thời Không Đồng Bộ</div>
            <div className="font-semibold text-paper-theme tracking-wider">{currentTime || '18:57:17'}</div>
          </div>
          <div className="h-8 w-[1px] bg-dark-gold/30"></div>
          <div>
            <div className="text-[9px] text-gold-theme/50 uppercase tracking-widest font-sans">Trận Pháp</div>
            <span className="inline-flex items-center gap-1.5 font-sans px-2.5 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-500/30 font-semibold">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" />
              Khởi Động
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
